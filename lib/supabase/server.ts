import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

/**
 * Server client, scoped to the caller's session. Use this for everything a
 * signed-in member of staff does — their RLS policies apply.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Service-role client. Bypasses RLS entirely.
 *
 * Only for operations that genuinely cannot be done as the user: creating
 * staff accounts via the Admin API, and scheduled jobs that run with no
 * session at all.
 *
 * This must never be imported by a Client Component. The key is read from a
 * non-`NEXT_PUBLIC_` variable so it cannot be inlined into the browser bundle,
 * and the guard below turns a mistaken import into a loud failure rather than
 * a silent leak.
 */
export function createServiceClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createServiceClient() was called in the browser. The service-role key " +
        "bypasses RLS and must never reach the client."
    );
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}

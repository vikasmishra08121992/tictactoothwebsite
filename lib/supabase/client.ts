import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

/**
 * Browser client. Uses the anon key, which ships in the client bundle — that
 * is expected and safe *only* because RLS denies `anon` every table in this
 * database (see supabase/migrations/0002_rls.sql).
 *
 * Never import the service-role key into anything that reaches the browser.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

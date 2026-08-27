import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/staff", "/admin"];

/**
 * Refreshes the Supabase session cookie on every request, and gates the staff
 * and admin areas.
 *
 * This is a first gate, not the security boundary. Middleware only checks that
 * someone is signed in — the real enforcement is RLS in the database, because
 * a route guard protects pages while RLS protects *data*. Both layers exist on
 * purpose: bypassing middleware would get you an empty page, not records.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));

  // Middleware runs on every request, so a throw here takes down the whole
  // site — including the marketing pages, which need no database at all. An
  // unconfigured environment must not turn "the clinic's phone number" into a
  // 500. The portal is a different matter: it cannot function without the
  // database, and quietly letting someone through to it would be worse than
  // an error, so that path fails loudly instead.
  if (!url || !anonKey) {
    if (needsAuth) {
      return new NextResponse(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
          "NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        { status: 503 }
      );
    }
    return response;
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() revalidates against the auth server. getSession() only reads the
  // cookie, which a client could have tampered with.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (needsAuth && !user) {
    const target = request.nextUrl.clone();
    target.pathname = "/auth/sign-in";
    target.searchParams.set("next", pathname);
    return NextResponse.redirect(target);
  }

  // Already signed in and sitting on the sign-in page — send them onward.
  if (pathname === "/auth/sign-in" && user) {
    const target = request.nextUrl.clone();
    target.pathname = "/staff";
    target.search = "";
    return NextResponse.redirect(target);
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except static assets and image optimisation.
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

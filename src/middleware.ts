import { type NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY, LOCAL_AUTH_COOKIE_NAME } from "@/lib/supabase/env";

/**
 * Musicosy auth middleware — protects all three portals' dashboard routes.
 *
 * Two auth modes:
 *
 * 1. Production (Supabase configured):
 *      Refresh the Supabase auth session (@supabase/ssr pattern) and call
 *      supabase.auth.getUser() to gate routes. Bounce logged-in users away
 *      from signin pages.
 *
 * 2. Sandbox fallback (Supabase env vars empty):
 *      Check for the LOCAL_AUTH_COOKIE_NAME cookie. If present, treat the
 *      user as logged in. The /api/auth/local-signin route sets this cookie
 *      after verifying the password via Postgres crypt().
 *
 * Graceful degradation: if Supabase credentials aren't configured yet
 * (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are empty), the
 * middleware uses the local cookie path. This keeps the rest of the site
 * (home, help center, docs) working while Supabase is being wired up.
 *
 * The matcher is scoped to ONLY the three portals' auth-gated routes — so
 * this middleware never runs on the rest of the site's routes (home, docs,
 * help center, advertising landing pages).
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- Production path: Supabase is configured ---
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const { createMiddlewareClient } = await import("@/lib/supabase/middleware");
    const { supabase, response } = createMiddlewareClient(request);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return handleAuthGate(request, pathname, Boolean(user), response);
  }

  // --- Sandbox path: check for local session cookie ---
  const hasLocalSession = Boolean(request.cookies.get(LOCAL_AUTH_COOKIE_NAME)?.value);
  return handleAuthGate(request, pathname, hasLocalSession, NextResponse.next());
}

/**
 * Centralised gate logic — same rules for both auth modes.
 *
 * - If the route is gated AND the user has no session: redirect to the
 *   matching signin page with ?next=<original-path> so we can resume.
 * - If the user IS logged in AND they're on a signin page: bounce them to
 *   the portal dashboard (drop ?next=).
 * - Otherwise: pass through.
 */
function handleAuthGate(
  request: NextRequest,
  pathname: string,
  isLoggedIn: boolean,
  response: NextResponse,
): NextResponse {
  const gatedSignin = signinFor(pathname);
  if (gatedSignin && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = gatedSignin;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const onSignin = signinPath(pathname);
  if (isLoggedIn && onSignin) {
    const url = request.nextUrl.clone();
    if (onSignin === "/developers/signin") {
      url.pathname = "/developers/dashboard";
    } else if (onSignin === "/signin") {
      url.pathname = "/dashboard";
    } else if (onSignin === "/ads/signin") {
      url.pathname = "/ads";
    }
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return response;
}

// Returns the matching signin path for a gated dashboard, or null if the
// path isn't auth-gated.
function signinFor(path: string): string | null {
  if (path.startsWith("/developers/dashboard")) return "/developers/signin";
  if (path.startsWith("/dashboard")) return "/signin";
  if (path.startsWith("/ads") && !path.startsWith("/ads/signin") && !path.startsWith("/ads/auth")) {
    return "/ads/signin";
  }
  return null;
}

// Returns the matching signin path if the request IS a signin page, else null.
function signinPath(path: string): string | null {
  if (path === "/developers/signin") return "/developers/signin";
  if (path === "/signin") return "/signin";
  if (path === "/ads/signin") return "/ads/signin";
  return null;
}

export const config = {
  matcher: [
    // Developer portal
    "/developers/dashboard/:path*",
    "/developers/signin",
    // Marketing portal
    "/dashboard/:path*",
    "/signin",
    // Ads portal
    "/ads/:path*",
  ],
};

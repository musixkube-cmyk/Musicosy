import { type NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";

/**
 * Musicosy auth middleware — protects the portal dashboard routes.
 *
 * Three responsibilities:
 *
 * 1. Refresh the Supabase auth session (the @supabase/ssr pattern). The
 *    library handles the actual JWT refresh; we just propagate the updated
 *    cookies back into the request and the response.
 * 2. Guard each portal's dashboard routes — if the user has no session,
 *    redirect to that portal's signin page with ?next=<original-path> so we
 *    can resume after they auth:
 *      /dashboard/*  → /signin   (developer portal)
 *      /ads/*        → /ads/signin
 * 3. Bounce logged-in users away from each portal's signin page so they don't
 *    get stuck re-authenticating when they already have a valid session.
 *
 * Graceful degradation: if Supabase credentials aren't configured yet
 * (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are empty), the
 * middleware passes the request through without touching Supabase. This
 * keeps the rest of the site (home, help center, docs) working while
 * Supabase is being wired up.
 *
 * The matcher is scoped to ONLY the portals' auth-gated routes — so this
 * middleware never runs on the rest of the site's routes (home, docs,
 * help center, advertising landing pages, consumer /app/* canvas).
 */
export async function middleware(request: NextRequest) {
  // Graceful skip when Supabase isn't configured — don't crash the site.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  // Lazy import so the @supabase/ssr client isn't loaded until we actually
  // need it (keeps the no-creds path zero-cost).
  const { createMiddlewareClient } = await import("@/lib/supabase/middleware");
  const { supabase, response } = createMiddlewareClient(request);

  // Refreshes session if expired; mutates response cookies when it does.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // --- Map each portal's dashboard to its signin page ---
  // Returns the matching signin path for a gated dashboard, or null if the
  // path isn't auth-gated.
  function signinFor(path: string): string | null {
    // Developer portal dashboard
    if (path.startsWith("/dashboard")) return "/signin";
    // Ads portal — everything under /ads except /ads/signin itself and /ads/auth/*
    if (path.startsWith("/ads") && !path.startsWith("/ads/signin") && !path.startsWith("/ads/auth")) {
      return "/ads/signin";
    }
    return null;
  }

  // Returns the matching signin path if the request IS a signin page, else null.
  function signinPath(path: string): string | null {
    if (path === "/signin") return "/signin";
    if (path === "/ads/signin") return "/ads/signin";
    return null;
  }

  // --- Guard dashboard routes ---
  const gatedSignin = signinFor(pathname);
  if (gatedSignin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = gatedSignin;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // --- Bounce logged-in users away from signin pages ---
  const onSignin = signinPath(pathname);
  if (user && onSignin) {
    const url = request.nextUrl.clone();
    if (onSignin === "/signin") {
      url.pathname = "/dashboard";
    } else if (onSignin === "/ads/signin") {
      url.pathname = "/ads";
    }
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Developer portal
    "/dashboard/:path*",
    "/signin",
    // Ads portal
    "/ads/:path*",
  ],
};

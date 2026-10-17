"use client";

import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

/**
 * Ads portal sign-in / sign-up page (mounted at /ads/signin).
 *
 * Portal-specific wiring:
 *   - redirectTo: /ads                (the ads dashboard)
 *   - callbackPath: /ads/auth/callback (Supabase OAuth return URL)
 *
 * Auth flow is identical to the other two portals — see
 * src/components/auth/SignInForm.tsx for the full flow doc.
 */
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm redirectTo="/ads" callbackPath="/ads/auth/callback" />
    </Suspense>
  );
}

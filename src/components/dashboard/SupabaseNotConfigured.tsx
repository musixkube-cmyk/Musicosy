"use client";

import Link from "next/link";

/**
 * SupabaseNotConfigured — placeholder shown by SignInForm when
 * `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` aren't set.
 *
 * Renders a helpful message on the same 2-column white layout as the real
 * sign-in form: oversized logo LEFT, configuration notice RIGHT, plus a
 * "Continue to dashboard" demo-bypass button so the rest of the portal can
 * still be previewed end-to-end without auth.
 *
 * `redirectTo` is the path the demo-bypass button should navigate to
 * (passed down from SignInForm, which derived it from `?next=` or
 * `redirectTo` prop).
 */
export function SupabaseNotConfigured({ redirectTo }: { redirectTo: string }) {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="px-6 pt-8 md:px-12">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Back
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 py-14 md:px-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24 lg:py-24">
        {/* Left: oversized transparent Musicosy logo */}
        <div className="flex items-center justify-start">
          <img
            src="/musicosy-logo.png"
            alt="Musicosy"
            className="w-full max-w-[420px] lg:max-w-[560px]"
          />
        </div>

        {/* Right: configuration notice + demo bypass */}
        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  Supabase isn&apos;t configured
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  Authentication is disabled. Set{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[10px]">
                    NEXT_PUBLIC_SUPABASE_URL
                  </code>
                  ,{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[10px]">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </code>
                  ,{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[10px]">
                    SUPABASE_SERVICE_ROLE_KEY
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[10px]">
                    DATABASE_URL
                  </code>{" "}
                  in{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[10px]">
                    .env
                  </code>{" "}
                  to enable Phone OTP, Google/Apple OAuth, and email sign-in.
                </p>
              </div>
            </div>

            <a
              href={redirectTo}
              className="mt-5 flex h-12 items-center justify-center rounded-full bg-neutral-900 font-medium text-white transition-opacity hover:opacity-90"
            >
              Continue to dashboard →
            </a>
            <p className="mt-2 text-center text-[11px] text-amber-700">
              Demo bypass — no auth required
            </p>
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-neutral-500">
            By continuing, you agree to our{" "}
            <span className="font-semibold text-neutral-900">Terms of Service</span>,{" "}
            <span className="font-semibold text-neutral-900">Privacy Policy</span> and{" "}
            <span className="font-semibold text-neutral-900">Cookie Use</span>.
          </p>
        </div>
      </div>
    </main>
  );
}

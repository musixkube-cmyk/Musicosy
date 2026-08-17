"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ads/ui";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";

/**
 * Musicosy sign-in / sign-up form.
 *
 * Two-step flow:
 *   1. User enters email → POST /api/auth/check-email to determine if the
 *      account exists.
 *   2. Based on the response:
 *        - exists=true  → render the password sign-in form
 *        - exists=false → render the sign-up form (email + password + confirm)
 *
 * Submission:
 *   - If Supabase env vars are configured (production): use the real
 *     supabase-js client via @supabase/ssr's createBrowserClient to call
 *     signInWithPassword() / signUp(). This is the production code path.
 *   - If Supabase env vars are empty (sandbox): fall back to our own
 *     /api/auth/local-signin route, which verifies the password against
 *     auth.users via Postgres crypt() and sets a session cookie the
 *     middleware recognises. Sign-up always goes through /api/auth/signup
 *     because that route inserts directly into auth.users (no GoTrue needed).
 *
 * Props:
 *   - redirectTo: where to send the user after a successful sign-in
 *   - callbackPath: the OAuth return path (e.g. "/ads/auth/callback")
 *
 * OAuth buttons (Google / Apple) only render when Supabase is configured —
 * they require real GoTrue endpoints we can't emulate locally.
 */

interface SignInFormProps {
  redirectTo: string;
  callbackPath: string;
}

type Mode = "email" | "signin" | "signup";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:opacity-50";

export default function SignInForm({ redirectTo, callbackPath }: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, startCheck] = useTransition();
  const [submitting, startSubmit] = useTransition();

  const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

  const next = searchParams.get("next") || redirectTo;

  /** Step 1: look up the email to decide between sign-in and sign-up. */
  const handleEmailCheck = useCallback(() => {
    setError(null);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    startCheck(async () => {
      try {
        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error || j.detail || "Could not check email.");
          return;
        }
        const data = (await res.json()) as { exists: boolean };
        setMode(data.exists ? "signin" : "signup");
      } catch {
        setError("Network error — please try again.");
      }
    });
  }, [email]);

  /** Step 2a: sign in (Supabase or local fallback). */
  const handleSignIn = useCallback(() => {
    setError(null);
    if (!password) {
      setError("Password is required.");
      return;
    }
    startSubmit(async () => {
      try {
        if (supabaseConfigured) {
          const { createBrowserClient } = await import("@supabase/ssr");
          const supabase = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) {
            setError(signInError.message);
            return;
          }
        } else {
          const res = await fetch("/api/auth/local-signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            const j = (await res.json().catch(() => ({}))) as { error?: string };
            setError(j.error || "Sign-in failed.");
            return;
          }
        }
        router.push(next);
        router.refresh();
      } catch {
        setError("Network error — please try again.");
      }
    });
  }, [email, password, supabaseConfigured, router, next]);

  /** Step 2b: sign up (always direct to /api/auth/signup). */
  const handleSignUp = useCallback(() => {
    setError(null);
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    startSubmit(async () => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          setError(j.error || "Sign-up failed.");
          return;
        }
        if (supabaseConfigured) {
          const { createBrowserClient } = await import("@supabase/ssr");
          const supabase = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) {
            setError(`Account created, but auto-signin failed: ${signInError.message}. Please sign in.`);
            setMode("signin");
            return;
          }
        } else {
          const signinRes = await fetch("/api/auth/local-signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!signinRes.ok) {
            setError("Account created. Please sign in with your new credentials.");
            setMode("signin");
            return;
          }
        }
        router.push(next);
        router.refresh();
      } catch {
        setError("Network error — please try again.");
      }
    });
  }, [email, password, confirmPassword, supabaseConfigured, router, next]);

  /** OAuth (Google/Apple) — only in production (Supabase configured). */
  const handleOAuth = useCallback(
    (provider: "google" | "apple") => {
      setError(null);
      startSubmit(async () => {
        try {
          const { createBrowserClient } = await import("@supabase/ssr");
          const supabase = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
          const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${window.location.origin}${callbackPath}?next=${encodeURIComponent(next)}`,
            },
          });
          if (oauthError) setError(oauthError.message);
        } catch {
          setError("OAuth not available.");
        }
      });
    },
    [callbackPath, next],
  );

  const busy = checking || submitting;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-full-same-row.png"
          alt="Musicosy"
          className="h-10 w-auto object-contain"
        />
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        {mode === "email" && (
          <>
            <h1 className="text-2xl font-bold text-neutral-900">Sign in or sign up</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Enter your email to continue to your dashboard.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailCheck()}
                  autoFocus
                  disabled={busy}
                  className={inputClass}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button onClick={handleEmailCheck} disabled={busy || !email} className="w-full">
                {checking ? "Checking…" : "Continue"}
              </Button>
            </div>

            {supabaseConfigured && (
              <>
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-200" />
                  <span className="text-xs font-medium uppercase text-neutral-400">or</span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>
                <div className="space-y-2">
                  <Button variant="secondary" onClick={() => handleOAuth("google")} disabled={busy} className="w-full">
                    Continue with Google
                  </Button>
                  <Button variant="secondary" onClick={() => handleOAuth("apple")} disabled={busy} className="w-full">
                    Continue with Apple
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {mode === "signin" && (
          <>
            <button
              onClick={() => {
                setMode("email");
                setPassword("");
                setError(null);
              }}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              ← Change email
            </button>
            <h1 className="mt-2 text-2xl font-bold text-neutral-900">Welcome back</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Signing in as <span className="font-medium text-neutral-700">{email}</span>
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  autoFocus
                  disabled={busy}
                  className={inputClass}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button onClick={handleSignIn} disabled={busy || !password} className="w-full">
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </div>
          </>
        )}

        {mode === "signup" && (
          <>
            <button
              onClick={() => {
                setMode("email");
                setPassword("");
                setConfirmPassword("");
                setError(null);
              }}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              ← Change email
            </button>
            <h1 className="mt-2 text-2xl font-bold text-neutral-900">Create your account</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Signing up as <span className="font-medium text-neutral-700">{email}</span>
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  disabled={busy}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                  disabled={busy}
                  className={inputClass}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                onClick={handleSignUp}
                disabled={busy || !password || !confirmPassword}
                className="w-full"
              >
                {submitting ? "Creating account…" : "Create account"}
              </Button>

              <p className="text-xs text-neutral-400">
                By signing up you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        {supabaseConfigured ? "Protected by Supabase Auth" : "Sandbox mode — local auth via Postgres"}
      </p>
    </div>
  );
}

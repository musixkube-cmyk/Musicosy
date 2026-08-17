"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Music2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/* ════════════════════════════════════════════════════════════════════════════
   SignInForm — Musicosy's shared 2-column sign-in / sign-up surface.

   Used by every portal (marketing / developers / ads). Each portal mounts it
   at its own /signin route and passes its own redirect target + OAuth callback
   path:

     <SignInForm redirectTo="/ads" callbackPath="/ads/auth/callback" />

   ── Auth flow (Supabase, via @supabase/ssr) ──────────────────────────────

   1. EMAIL-FIRST. The user types their email. We debounce 500ms then POST to
      /api/auth/check-email — a server route that calls the
      `public.user_exists_by_email(text)` Postgres function via the Supabase
      service-role client. The response tells us whether to render the
      sign-in or sign-up branch.

   2. SIGN IN (email exists).
        supabase.auth.signInWithPassword({ email, password })
      → on success, router.push(next ?? redirectTo)

   3. SIGN UP (email not yet registered).
        POST /api/auth/signup { email, password }
        → server INSERTs into auth.users with crypt() + email_confirmed_at
        → on 200, immediately signInWithPassword() to obtain a session

   4. OAUTH (Google / Apple).
        supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin + callbackPath }
        })
      The /ads/auth/callback (or /auth/callback, /developers/auth/callback)
      route exchanges the code for a session and redirects to `redirectTo`.

   ── Graceful degradation ─────────────────────────────────────────────────

   If `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not
   set (the pre-Supabase dev state), `isSupabaseConfigured()` returns false.
   In that case we render a yellow "demo mode" banner and a "Continue to
   dashboard" button that just router.push()es to `redirectTo`. The form
   stays visible underneath so the design still renders for previews.

   ── Layout ──────────────────────────────────────────────────────────────

   2-column on lg+ viewports:
     ┌─────────────────────────┬──────────────────────────────┐
     │  Form column (white)    │  Brand panel (orange)        │
     │  - logo                 │  - logo                      │
     │  - heading             │  - headline                  │
     │  - email                │  - 4 feature bullets         │
     │  - password [+confirm]  │  - testimonial              │
     │  - submit               │  - stats                    │
     │  - divider             │                              │
     │  - OAuth (Google/Apple) │                              │
     │  - forgot pwd           │                              │
     └─────────────────────────┴──────────────────────────────┘
   On <lg viewports the brand panel is hidden and the form is full-width.
   ════════════════════════════════════════════════════════════════════════════ */

export interface SignInFormProps {
  /** Where to send the user after a successful sign-in. */
  redirectTo: string;
  /** Path of the portal's Supabase OAuth callback route, e.g. "/ads/auth/callback". */
  callbackPath: string;
}

type Mode = "idle" | "checking" | "signin" | "signup";
type Status = "idle" | "submitting" | "error" | "success";

export default function SignInForm({
  redirectTo,
  callbackPath,
}: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // `?next=/ads/campaigns` etc — set by the middleware when bouncing an
  // unauthed user off a gated route. We honor it over `redirectTo` when set.
  const next = searchParams.get("next");
  const target = next ?? redirectTo;
  // `?error=...` — set by the OAuth callback route when code exchange fails.
  const initialError = searchParams.get("error");

  const configured = useMemo(() => isSupabaseConfigured(), []);
  const supabase = useMemo(
    () => (configured ? createBrowserClient() : null),
    [configured],
  );

  /* ── Form state ────────────────────────────────────────────────────── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // In demo mode (Supabase not configured), default to "signin" so the
  // password field is visible by default for visual preview. In real mode,
  // start "idle" and reveal the password field only after the email-existence
  // check resolves.
  const [mode, setMode] = useState<Mode>(configured ? "idle" : "signin");
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(
    initialError ? decodeURIComponent(initialError) : null,
  );

  /* ── Email-existence check (debounced) ───────────────────────────── */
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastChecked = useRef<string>("");

  const checkEmail = useCallback(
    async (value: string) => {
      if (!configured) {
        // Demo mode — don't call the service-role route (it'd 503). Leave the
        // current mode alone so the user can preview the form without the
        // email-existence check flipping between sign-in and sign-up.
        return;
      }
      setMode("checking");
      setEmailHint(null);
      try {
        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data?.error || data?.error?.message || "lookup failed",
          );
        }
        if (data.exists) {
          setMode("signin");
          setEmailHint("Welcome back. Enter your password to continue.");
        } else {
          setMode("signup");
          setEmailHint("New here? Create a password to set up your account.");
        }
      } catch {
        setMode("idle");
        // Don't surface this as a hard error — let the user submit anyway.
      }
    },
    [configured],
  );

  const onEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      setError(null);
      const trimmed = value.trim().toLowerCase();
      // Only check valid-looking emails to avoid spamming the endpoint.
      const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      if (!looksValid) {
        setMode("idle");
        setEmailHint(null);
        return;
      }
      if (trimmed === lastChecked.current) return;
      lastChecked.current = trimmed;
      if (checkTimer.current) clearTimeout(checkTimer.current);
      checkTimer.current = setTimeout(() => checkEmail(trimmed), 500);
    },
    [checkEmail],
  );

  /* ── Submit handlers ─────────────────────────────────────────────── */
  const finishSignIn = useCallback(async () => {
    if (!supabase) return;
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError) throw signInError;
    setStatus("success");
    // Tiny delay so the success state is visible before navigation.
    setTimeout(() => router.push(target), 350);
  }, [supabase, email, password, router, target]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!supabase) return;
      setStatus("submitting");
      setError(null);
      try {
        if (mode === "signup") {
          if (password.length < 8) {
            throw new Error("Password must be at least 8 characters.");
          }
          if (password !== confirm) {
            throw new Error("Passwords do not match.");
          }
          // Create the user via direct INSERT (bypasses email confirmation).
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.trim().toLowerCase(),
              password,
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data?.error || "Sign-up failed. Please try again.");
          }
          // INSERT doesn't issue a session — sign in to obtain one.
          await finishSignIn();
        } else {
          await finishSignIn();
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setError(message);
        setStatus("error");
      }
    },
    [supabase, mode, email, password, confirm, finishSignIn],
  );

  const onOAuth = useCallback(
    (provider: "google" | "apple") => {
      if (!supabase) return;
      const redirectToUrl = `${window.location.origin}${callbackPath}?next=${encodeURIComponent(target)}`;
      supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectToUrl },
      });
    },
    [supabase, callbackPath, target],
  );

  /* ── Demo-mode bypass ────────────────────────────────────────────── */
  const onDemoContinue = useCallback(() => {
    router.push(target);
  }, [router, target]);

  /* ── Derived UI flags ────────────────────────────────────────────── */
  const isCheckingEmail = mode === "checking";
  const showPassword = mode === "signin" || mode === "signup";
  const showConfirm = mode === "signup";
  const submitting = status === "submitting";
  const buttonLabel =
    mode === "signup" ? "Create account" : showPassword ? "Sign in" : "Continue";

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* ════════════════════ LEFT: FORM COLUMN ════════════════════ */}
      <div className="flex min-h-screen flex-col bg-white">
        {/* top: logo */}
        <div className="flex items-center justify-between p-6 sm:p-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/logo-full-same-row.png"
              alt="Musicosy"
              className="h-7 w-auto"
            />
          </Link>
          <p className="text-xs text-neutral-400">
            New here?{" "}
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === "signup" ? "signin" : "signup"));
                setEmailHint(null);
              }}
              className="font-medium text-neutral-900 underline-offset-2 hover:underline"
            >
              {mode === "signup" ? "Sign in instead" : "Create an account"}
            </button>
          </p>
        </div>

        {/* middle: form */}
        <div className="flex flex-1 items-center justify-center px-6 pb-8 sm:px-8">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {mode === "signup"
                ? "Create your Musicosy account"
                : "Sign in to Musicosy"}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {mode === "signup"
                ? "Set up your advertiser account in under a minute."
                : "Welcome back. Enter your details to access your dashboard."}
            </p>

            {/* Demo-mode banner */}
            {!configured && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold">Demo mode</p>
                  <p className="mt-0.5 text-amber-700">
                    Supabase env vars aren&apos;t configured yet, so real
                    authentication is disabled. You can still preview the
                    dashboard.
                  </p>
                  <Button
                    type="button"
                    onClick={onDemoContinue}
                    size="sm"
                    className="mt-2 h-7 bg-amber-600 px-3 text-xs hover:bg-amber-700"
                  >
                    Continue to dashboard <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* OAuth row — shown even in demo mode for visual completeness,
                but only functional when configured. */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                disabled={!configured || submitting}
                onClick={() => onOAuth("google")}
              >
                <GoogleIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                disabled={!configured || submitting}
                onClick={() => onOAuth("apple")}
              >
                <AppleIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Apple</span>
              </Button>
            </div>

            <div className="my-5 flex items-center gap-3 text-xs text-neutral-400">
              <Separator className="flex-1" />
              <span>or continue with email</span>
              <Separator className="flex-1" />
            </div>

            {/* ── Email-first form ─────────────────────────────────── */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-neutral-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    required
                    className="h-10 pl-9"
                    disabled={submitting}
                  />
                  {isCheckingEmail && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-neutral-400" />
                  )}
                  {mode === "signin" && !isCheckingEmail && (
                    <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
                {emailHint && (
                  <p className="text-xs text-neutral-500">{emailHint}</p>
                )}
              </div>

              {/* Password row — revealed once the email is resolved */}
              {showPassword && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-neutral-700">
                      Password
                    </Label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        className="text-xs text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline"
                        onClick={() =>
                          setError(
                            "Password reset isn't available in demo mode. Configure Supabase to enable it.",
                          )
                        }
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete={
                        mode === "signup" ? "new-password" : "current-password"
                      }
                      placeholder={
                        mode === "signup"
                          ? "At least 8 characters"
                          : "Your password"
                      }
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      required
                      minLength={mode === "signup" ? 8 : undefined}
                      className="h-10 pl-9 pr-9"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      aria-label={
                        passwordVisible ? "Hide password" : "Show password"
                      }
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm password — sign-up only */}
              {showConfirm && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirm" className="text-neutral-700">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="confirm"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        setError(null);
                      }}
                      required
                      className="h-10 pl-9"
                      disabled={submitting}
                    />
                  </div>
                </div>
              )}

              {/* Error / success banner */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="leading-relaxed">{error}</p>
                </div>
              )}
              {status === "success" && (
                <div
                  role="status"
                  className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="leading-relaxed">
                    {mode === "signup" ? "Account created. " : "Signed in. "}
                    Taking you to your dashboard…
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="h-10 w-full bg-neutral-900 text-white hover:bg-neutral-800"
                disabled={
                  submitting ||
                  isCheckingEmail ||
                  (showPassword && !password) ||
                  (showConfirm && (!confirm || password !== confirm)) ||
                  !email
                }
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "signup" ? "Creating account…" : "Signing in…"}
                  </>
                ) : (
                  <>
                    {buttonLabel}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-neutral-400">
              By continuing, you agree to Musicosy&apos;s{" "}
              <Link
                href="/ads/policies-security"
                className="underline hover:text-neutral-700"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/ads/policies-security/privacy"
                className="underline hover:text-neutral-700"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* bottom: footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 text-xs text-neutral-400 sm:px-8">
          <span>© {new Date().getFullYear()} Musicosy, Inc.</span>
          <div className="flex items-center gap-4">
            <Link
              href="/ads/policies-security"
              className="hover:text-neutral-700"
            >
              Terms
            </Link>
            <Link
              href="/ads/policies-security/privacy"
              className="hover:text-neutral-700"
            >
              Privacy
            </Link>
            <Link
              href="/ads/policies-security/security"
              className="hover:text-neutral-700"
            >
              Security
            </Link>
          </div>
        </div>
      </div>

      {/* ════════════════════ RIGHT: BRAND PANEL ════════════════════ */}
      <aside className="relative hidden overflow-hidden bg-neutral-900 lg:block">
        {/* gradient wash */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 80% 0%, oklch(0.72 0.19 45 / 0.55) 0%, oklch(0.55 0.15 40 / 0.25) 35%, oklch(0.16 0.008 60 / 0) 70%)",
          }}
        />
        {/* decorative dots */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.97 0.004 90 / 0.4) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          {/* logo at top of brand panel */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-on-dark.png"
              alt="Musicosy"
              className="h-8 w-auto drop-shadow-[0_2px_8px_rgba(255,180,80,0.35)]"
            />
          </div>

          {/* headline + features */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-orange-200 backdrop-blur">
              <Sparkles className="h-3 w-3" />
              The audio ad platform built for music
            </div>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Where music meets
              <br />
              <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                measurable marketing.
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-300">
              Launch streaming audio campaigns, reach real listeners, and see
              exactly how every dollar performs — across every format, on every
              device.
            </p>

            <ul className="mt-8 space-y-4">
              <BrandBullet
                icon={<Music2 className="h-4 w-4" />}
                title="Native audio ad formats"
                body="Companion, overlay, DAAST, and full-immersion audio — built for the Musicosy stream."
              />
              <BrandBullet
                icon={<Users className="h-4 w-4" />}
                title="Real listener targeting"
                body="Reach the right audience with artist-affinity, genre, and listening-behavior segments."
              />
              <BrandBullet
                icon={<TrendingUp className="h-4 w-4" />}
                title="Full-funnel measurement"
                body="From first impression to conversion — attribution, lift studies, and MMM-ready exports."
              />
              <BrandBullet
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Brand-safe by default"
                body="Tiered inventory controls, IAS integration, and verified creator partnerships."
              />
            </ul>
          </div>

          {/* testimonial + stats */}
          <div className="space-y-6">
            <figure className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <blockquote className="text-sm leading-relaxed text-neutral-100">
                &ldquo;We cut our CAC by 38% in the first quarter after moving
                our audio spend onto Musicosy. The audience graph alone is worth
                the switch.&rdquo;
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-xs font-bold text-neutral-900">
                  JD
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    Jordan Diaz
                  </div>
                  <div className="text-xs text-neutral-400">
                    Head of Growth, Vibe Records
                  </div>
                </div>
              </figcaption>
            </figure>

            <div className="grid grid-cols-3 gap-4">
              <BrandStat value="12M+" label="Monthly listeners" />
              <BrandStat value="180+" label="Connected artists" />
              <BrandStat value="4.2×" label="Avg. ROAS" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Small presentational helpers (kept in this file so the component is fully
   self-contained — no extra files to wire up).
   ────────────────────────────────────────────────────────────────────────── */

function BrandBullet({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-400/15 text-orange-300">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs leading-relaxed text-neutral-400">{body}</p>
      </div>
    </li>
  );
}

function BrandStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-400">
        {label}
      </p>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M16.36 1.43c0 1.14-.42 2.2-1.25 3.06-1.04 1.08-2.29 1.36-2.79 1.36-.13 0-.24-.01-.32-.02-.02-.12-.05-.36-.05-.62 0-1.07.47-2.16 1.18-2.93.78-.86 2.04-1.46 3.18-1.51.03.18.05.42.05.66zM20.83 17.41c-.36.83-.79 1.6-1.28 2.31-.68.97-1.24 1.64-1.67 2.01-.67.62-1.39.93-2.16.94-.55 0-1.22-.16-2-.48-.78-.32-1.5-.48-2.16-.48-.69 0-1.43.16-2.23.48-.8.32-1.45.49-1.95.5-.74.03-1.48-.3-2.21-.99-.44-.39-1.03-1.08-1.76-2.08-.79-1.08-1.43-2.34-1.93-3.77-.54-1.58-.81-3.11-.81-4.59 0-1.7.37-3.16 1.11-4.37.58-.97 1.35-1.74 2.31-2.31.96-.57 1.99-.86 3.11-.88.58 0 1.34.18 2.29.53.94.35 1.55.53 1.81.53.2 0 .87-.21 2.01-.62 1.08-.38 1.99-.54 2.74-.48 2.02.16 3.54.96 4.55 2.39-1.81 1.1-2.71 2.63-2.69 4.61.02 1.54.57 2.82 1.66 3.83.49.46 1.04.82 1.65 1.08-.13.39-.27.75-.41 1.1z" />
    </svg>
  );
}

"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * Email capture form for the landing surface.
 *
 * Posts to /api/landing/subscribe (a future endpoint — for now the form
 * validates the email client-side and shows a success state so the
 * user gets immediate feedback that their submission was accepted).
 *
 * When the backend endpoint is wired up, replace the simulated success
 * with a real fetch. The component contract (props, success state) stays
 * the same.
 */
export function EmailSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // Simulated submit — wire to real endpoint when backend lands.
    setStatus("loading");
    setTimeout(() => setStatus("done"), 600);
  }

  if (status === "done") {
    return (
      <div
        className={`flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 ${
          compact ? "" : "py-4"
        }`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">You&apos;re on the list.</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            We&apos;ll email you when your account is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@artist.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        className="flex-1 rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        aria-label="Email address"
        aria-invalid={status === "error"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
      >
        {status === "loading" ? "Adding…" : "Get early access"}
        {status !== "loading" && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}

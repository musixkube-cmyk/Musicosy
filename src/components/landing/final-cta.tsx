import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { EmailSignup } from "./email-signup";

/**
 * Surfaces grid — the platform map.
 *
 * Each card links to a real surface route. Order matches the user's stated
 * architecture: landing → social → settings → help → developers → ads.
 */
const SURFACES = [
  {
    eyebrow: "Consumer",
    label: "Social",
    body: "Listen, watch, follow, share. The fan-facing music network.",
    href: "/social",
    cta: "Open social",
  },
  {
    eyebrow: "Account",
    label: "Settings",
    body: "Profile, organization, team members, roles and permissions.",
    href: "/settings",
    cta: "Open settings",
  },
  {
    eyebrow: "Support",
    label: "Help Center",
    body: "Guides, policies, transparency reports, and escalation paths.",
    href: "/help",
    cta: "Open help",
  },
  {
    eyebrow: "Developer",
    label: "API & Developers",
    body: "399 endpoints across 27 domains, scoped keys, webhooks, dashboard.",
    href: "/developers",
    cta: "Open developers",
  },
  {
    eyebrow: "Business",
    label: "Ad Center",
    body: "Plan, launch, and measure advertising campaigns across surfaces.",
    href: "/ads",
    cta: "Open ad center",
  },
  {
    eyebrow: "Auth",
    label: "Sign in",
    body: "Resume your existing session across every Musicosy surface.",
    href: "/ads/signin",
    cta: "Sign in",
  },
];

const proof = [
  { k: "Setup time", v: "Under 10 minutes" },
  { k: "Contract", v: "Non-exclusive, cancel anytime" },
  { k: "Ownership", v: "You keep 100% of your masters" },
];

export function FinalCta() {
  return (
    <>
      {/* Surfaces grid */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              The platform
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              One account. Six surfaces. One record.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every Musicosy surface reads from the same canonical record — your
              catalog, your fans, your rights, your payouts. Pick a surface below
              to get started.
            </p>
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {SURFACES.map((s) => (
              <li key={s.href} className="bg-background">
                <Link
                  href={s.href}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-muted/50"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {s.eyebrow}
                  </span>
                  <span className="mt-2 flex items-center gap-1.5 text-lg font-semibold text-foreground">
                    {s.label}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
                  </span>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent">
                    {s.cta}
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl px-6 lg:grid-cols-12 lg:px-10">
          <div className="border-border py-16 lg:col-span-7 lg:border-r lg:pr-14 lg:py-24">
            <Logo className="h-6" />
            <h2 className="mt-8 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Start with your next release. Grow into the whole catalog.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Create your artist account, deliver your first release free, and
              switch on the rest of the platform whenever you need it.
            </p>

            <div className="mt-9 max-w-lg">
              <EmailSignup />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/ads/signin"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="lg:col-span-5 lg:pl-14">
            <dl className="divide-y divide-border border-border lg:border-none">
              {proof.map((p) => (
                <div key={p.k} className="py-6 lg:py-8">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {p.k}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">
                    {p.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}

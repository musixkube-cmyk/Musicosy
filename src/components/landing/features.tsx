"use client";

import { useState } from "react";

type Pillar = {
  id: string;
  label: string;
  headline: string;
  body: string;
  items: { title: string; detail: string }[];
};

const pillars: Pillar[] = [
  {
    id: "distribution",
    label: "Distribution",
    headline: "Ship a release once. Reach every store on earth.",
    body: "DDEX-grade delivery, territory routing, pre-orders and physical pressing — with takedown and redelivery you control yourself.",
    items: [
      { title: "180+ stores & DSPs", detail: "Spotify, Apple, Amazon, YouTube, TikTok, Beatport, regional platforms." },
      { title: "Release scheduling", detail: "Timed drops, pre-save windows, staggered territory rollouts." },
      { title: "Metadata & assets", detail: "ISRC/UPC generation, artwork validation, credits and contributor roles." },
      { title: "Catalog operations", detail: "Bulk edits, redelivery, takedowns and transfers without a support ticket." },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & Fans",
    headline: "Own the relationship, not just the stream count.",
    body: "Turn passive listeners into a first-party audience you can reach on release day without renting attention.",
    items: [
      { title: "Smart links & pre-saves", detail: "Branded landing pages with per-source conversion tracking." },
      { title: "Fan CRM", detail: "Emails, SMS and segments built from streaming and commerce behaviour." },
      { title: "Campaign automation", detail: "Release cycles, drip sequences and lapsed-fan win-backs." },
      { title: "Playlist & press pitching", detail: "Structured pitches with response tracking and editorial windows." },
    ],
  },
  {
    id: "monetization",
    label: "Monetization",
    headline: "Every revenue line in one ledger.",
    body: "Streaming, merch, memberships, tips, ticketing and sync — reported together so you can see what actually pays.",
    items: [
      { title: "Merch & print-on-demand", detail: "Storefront, inventory and fulfilment attached to your release pages." },
      { title: "Memberships & tipping", detail: "Recurring supporter tiers with gated drops and early access." },
      { title: "Sync licensing", detail: "Licence-ready catalog with stems, cue sheets and one-stop clearance." },
      { title: "Live & ticketing", detail: "Event pages, presales and bundles tied to fan segments." },
    ],
  },
  {
    id: "rights",
    label: "Rights & Royalties",
    headline: "Splits, statements and payouts that survive an audit.",
    body: "Accounting built for collaborators — automatic, transparent and exportable.",
    items: [
      { title: "Automated splits", detail: "Percentage or fixed shares paid straight to each collaborator." },
      { title: "Publishing administration", detail: "Works registration and global mechanical collection." },
      { title: "Statements & exports", detail: "Line-level reporting by store, territory, track and period." },
      { title: "Payouts", detail: "Multi-currency withdrawals with full transaction history." },
    ],
  },
];

export function Features() {
  const [active, setActive] = useState(pillars[0].id);
  const current = pillars.find((p) => p.id === active) ?? pillars[0];

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            What&apos;s inside
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Four pillars. One source of truth.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Each pillar is independently powerful. Together they remove the seams
            between making music, releasing it, marketing it, and getting paid for it.
          </p>
        </div>

        {/* Pillar tabs */}
        <div className="mt-12 flex flex-wrap gap-2 border-b border-border pb-4">
          {pillars.map((p) => {
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                aria-pressed={isActive}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Active pillar content */}
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {current.headline}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {current.body}
            </p>
          </div>

          <div className="lg:col-span-7">
            <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {current.items.map((item) => (
                <div key={item.title}>
                  <dt className="text-sm font-semibold text-foreground">
                    {item.title}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

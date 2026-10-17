"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

/**
 * Top navigation bar for the marketing surface.
 *
 * Surfaces, in the order the user specified:
 *   Landing → Social → Settings → Help Center → Developers (API) → Ad Center
 *
 * Mobile: hamburger opens a slide-down menu with the same links.
 * Desktop: inline links right-aligned against the logo.
 */
const NAV_LINKS: { label: string; href: string; description: string }[] = [
  { label: "Social", href: "/social", description: "Listen, watch, follow, share" },
  { label: "Help", href: "/resources/help-center", description: "Guides, policies, support" },
  { label: "Developers", href: "/developers", description: "API reference & dashboard" },
  { label: "Ad Center", href: "/ads", description: "Run advertising campaigns" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-10">
          <Logo className="h-7" />
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/ads/signin"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex flex-col rounded-md px-3 py-3 transition-colors hover:bg-muted"
              >
                <span className="text-sm font-medium text-foreground">{link.label}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {link.description}
                </span>
              </Link>
            ))}
            <Link
              href="/ads/signin"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

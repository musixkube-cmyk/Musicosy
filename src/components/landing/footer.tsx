import Link from "next/link";
import { Logo } from "./logo";

/**
 * Site footer — sticky to bottom per project UI rules.
 *
 * Layout: min-h-screen flex-col on the parent wraps this with mt-auto so
 * the footer sticks to viewport bottom on short pages and gets pushed
 * down naturally on long pages.
 *
 * Links mirror the surfaces grid so the footer is a permanent map of the
 * platform — same six destinations, same order.
 */
const FOOTER_COLUMNS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Platform",
    links: [
      { label: "Social", href: "/social" },
      { label: "Ad Center", href: "/ads" },
      { label: "Developers", href: "/developers" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/ads/signin" },
      { label: "Sign up", href: "/signup" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "News", href: "/news" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Policies", href: "/policies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Logo className="h-6" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The operating system for independent artists. Distribution,
              marketing, monetization, rights and royalties in one platform.
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              © {new Date().getFullYear()} Musicosy
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/80 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

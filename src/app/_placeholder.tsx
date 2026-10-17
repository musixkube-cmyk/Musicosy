import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

/**
 * Placeholder page for surfaces that aren't built yet in this codebase.
 *
 * Used by: /social, /settings, /help, /developers, /signup
 * (And any other route the landing links to that doesn't have a real
 * implementation yet.)
 *
 * Layout: full-height flex column, sticky footer per project UI rules.
 */
export default function PlaceholderPage({
  eyebrow,
  title,
  body,
  nextHref,
  nextLabel,
}: {
  eyebrow: string;
  title: string;
  body: string;
  nextHref: string;
  nextLabel: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-32">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            <span className="mt-8 block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {body}
            </p>

            <div className="mt-10 flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-5 py-4">
              <span className="flex h-2 w-2 rounded-full bg-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                In active development
              </span>
            </div>

            <Link
              href={nextHref}
              className="mt-10 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              {nextLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

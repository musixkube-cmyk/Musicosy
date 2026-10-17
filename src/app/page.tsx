import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Musicosy — Music Distribution, Marketing & Royalties for Creators",
  description:
    "Musicosy is the operating system for independent artists: distribution to 180+ stores, fan marketing, monetization, rights and royalty splits, and a creative studio in one platform.",
  openGraph: {
    title: "Musicosy — Music Distribution, Marketing & Royalties for Creators",
    description:
      "Musicosy is the operating system for independent artists: distribution to 180+ stores, fan marketing, monetization, rights and royalty splits, and a creative studio in one platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * Landing page at / — the front door to every Musicosy surface.
 *
 * Layout follows the project UI rule: root wrapper is min-h-screen flex
 * flex-col, main content sits in a flex-1 container, footer uses mt-auto
 * to stick to the viewport bottom on short pages and get pushed down on
 * long pages.
 *
 * Route map (links from this page):
 *   /social      → consumer music network      (placeholder until built)
 *   /settings    → account settings            (placeholder until built)
 *   /help        → help center                 (placeholder until built)
 *   /developers  → API docs & dashboard        (placeholder until built)
 *   /ads         → Ad Center                   (already exists)
 *   /signin      → auth                        (already exists)
 *   /signup      → sign up                     (placeholder until built)
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Features />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

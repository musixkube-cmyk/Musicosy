import type { Metadata } from "next";
import { DocsShell } from "@/components/docs/DocsShell";

export const metadata: Metadata = {
  title: "Musicosy Docs",
  description:
    "Complete Musicosy platform reference: 296 features across 15 surfaces with routes, components, endpoints and permission rules.",
};

/**
 * Developer portal layout.
 *
 * The wrapper div forces light-mode tokens via inline style so the
 * devportal renders white-on-black regardless of:
 *   - Browser dark mode preference
 *   - Any `.dark` class applied to <html>/<body> by extensions
 *   - System-wide dark mode
 *
 * The inline `style` overrides the root `:root` and `.dark` token blocks
 * for every element inside the devportal subtree. This is intentional —
 * the devportal was designed as a light docs surface (Stripe/Linear/
 * Vercel docs style) and should never flip to dark.
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        // Force light-mode tokens — these win over .dark in globals.css
        // because inline styles have higher specificity than CSS classes.
        ["--background" as string]: "oklch(1 0 0)",
        ["--foreground" as string]: "oklch(0.18 0.006 60)",
        ["--card" as string]: "oklch(1 0 0)",
        ["--card-foreground" as string]: "oklch(0.18 0.006 60)",
        ["--popover" as string]: "oklch(1 0 0)",
        ["--popover-foreground" as string]: "oklch(0.18 0.006 60)",
        ["--primary" as string]: "oklch(0.16 0.004 60)",
        ["--primary-foreground" as string]: "oklch(0.98 0.004 92)",
        ["--secondary" as string]: "oklch(0.885 0.005 92)",
        ["--secondary-foreground" as string]: "oklch(0.2 0.006 60)",
        ["--muted" as string]: "oklch(0.895 0.004 92)",
        ["--muted-foreground" as string]: "oklch(0.46 0.008 70)",
        ["--accent" as string]: "oklch(0.67 0.185 44)",
        ["--accent-foreground" as string]: "oklch(0.99 0.01 90)",
        ["--border" as string]: "oklch(0.845 0.005 92)",
        ["--input" as string]: "oklch(0.845 0.005 92)",
        ["--ring" as string]: "oklch(0.67 0.185 44)",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <DocsShell>{children}</DocsShell>
    </div>
  );
}

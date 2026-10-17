"use client";

import { AppShellProvider } from "@/state/app-shell";
import { ShellInner } from "@/components/shell/ShellInner";

/**
 * Consumer social app layout — wraps every /app/* route in the AppShell
 * (TopRail + RightRail + PlayerRail + Overlays).
 *
 * The wrapper div forces the dark MD3 surface background that the social
 * app expects. Root globals.css sets `--background: oklch(1 0 0)` for
 * the light marketing/help/ads surfaces, but the consumer app needs the
 * dark surface tokens (`oklch(0.16 0.008 60)`) that its MD3 components
 * are designed against. The inline style overrides the root token only
 * for routes under /app/*.
 */
export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellProvider>
      <div
        className="min-h-screen"
        style={{
          // Dark MD3 social-app surface (matches musicosy-social's :root)
          ["--background" as string]: "oklch(0.16 0.008 60)",
          ["--foreground" as string]: "oklch(0.97 0.004 90)",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <ShellInner>{children}</ShellInner>
      </div>
    </AppShellProvider>
  );
}

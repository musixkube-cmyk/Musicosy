"use client";

import { useShell } from "@/state/app-shell";
import { TopRail, MobileRail } from "@/components/shell/TopRail";
import { RightRail } from "@/components/shell/RightRail";
import { PlayerRail } from "@/components/shell/PlayerRail";
import { SearchPalette, OverlayHost } from "@/components/shell/Overlays";

/**
 * Client shell — reads whether a track is active so the main content
 * padding adapts: player bar present (152px bottom) vs absent (88px).
 * The player only mounts after the user presses Play on something.
 */
export function ShellInner({ children }: { children: React.ReactNode }) {
  const { active } = useShell();
  const hasPlayer = Boolean(active);
  return (
    <div className="min-h-screen bg-background">
      <TopRail />
      <main
        className={`min-h-screen px-gutter pt-[72px] lg:pr-[calc(var(--width-rail-right-width)+var(--spacing-gutter))] ${
          hasPlayer
            ? "pb-[152px] xl:pb-[88px]"
            : "pb-[88px] xl:pb-[24px]"
        }`}
      >
        {children}
      </main>
      <RightRail />
      <PlayerRail />
      <MobileRail />
      <SearchPalette />
      <OverlayHost />
    </div>
  );
}

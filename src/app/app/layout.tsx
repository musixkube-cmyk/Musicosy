"use client";

import { AppShellProvider } from "@/state/app-shell";
import { ShellInner } from "@/components/shell/ShellInner";
import { useState, useEffect, useCallback, createContext, useContext } from "react";

/**
 * Consumer social app layout.
 *
 * Forces the dark MD3 surface background (pure black, not brown) that the
 * social app is designed against. The root globals.css sets --background
 * to white for the marketing/help/devportal surfaces, but the consumer
 * app needs the dark surface tokens.
 *
 * Canvas toggle: a button in the TopRail lets users switch between
 * black canvas (default) and white canvas. The preference is stored in
 * localStorage. Icons (Material Symbols) are not affected — they use
 * currentColor and inherit from --on-surface.
 */

type CanvasCtx = { light: boolean; toggle: () => void };
export const CanvasToggleContext = createContext<CanvasCtx>({
  light: false,
  toggle: () => {},
});

export function useCanvasToggle() {
  return useContext(CanvasToggleContext);
}

const DARK: React.CSSProperties = {
  ["--background" as string]: "oklch(0.08 0 0)",
  ["--color-background" as string]: "oklch(0.08 0 0)",
  ["--color-surface" as string]: "#0a0a0a",
  ["--color-on-surface" as string]: "#e5e2e1",
  ["--color-surface-container-lowest" as string]: "#050505",
  ["--color-surface-container-low" as string]: "#141414",
  ["--color-surface-container" as string]: "#1c1c1c",
  ["--color-surface-container-high" as string]: "#242424",
  ["--color-surface-container-highest" as string]: "#2c2c2c",
  ["--color-on-surface-variant" as string]: "#c0c0c0",
  ["--color-outline" as string]: "#4a4a4a",
  ["--color-outline-variant" as string]: "#2e2e2e",
  ["--foreground" as string]: "oklch(0.97 0 0)",
  ["--card" as string]: "oklch(0.14 0 0)",
  ["--card-foreground" as string]: "oklch(0.97 0 0)",
  ["--border" as string]: "oklch(0.24 0 0)",
  background: "oklch(0.08 0 0)",
  color: "oklch(0.97 0 0)",
};

const LIGHT: React.CSSProperties = {
  ["--background" as string]: "oklch(0.98 0 0)",
  ["--color-background" as string]: "oklch(0.98 0 0)",
  ["--color-surface" as string]: "#f5f5f5",
  ["--color-on-surface" as string]: "#1a1a1a",
  ["--color-surface-container-lowest" as string]: "#ffffff",
  ["--color-surface-container-low" as string]: "#f0f0f0",
  ["--color-surface-container" as string]: "#e8e8e8",
  ["--color-surface-container-high" as string]: "#e0e0e0",
  ["--color-surface-container-highest" as string]: "#d8d8d8",
  ["--color-on-surface-variant" as string]: "#3a3a3a",
  ["--color-outline" as string]: "#9a9a9a",
  ["--color-outline-variant" as string]: "#c4c4c4",
  ["--foreground" as string]: "oklch(0.12 0 0)",
  ["--card" as string]: "oklch(1 0 0)",
  ["--card-foreground" as string]: "oklch(0.12 0 0)",
  ["--border" as string]: "oklch(0.85 0 0)",
  background: "oklch(0.98 0 0)",
  color: "oklch(0.12 0 0)",
};

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("musicosy-canvas-light");
    if (stored === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLight(true);
    }
  }, []);

  const toggle = useCallback(() => {
    setLight((prev) => {
      const next = !prev;
      localStorage.setItem("musicosy-canvas-light", String(next));
      return next;
    });
  }, []);

  return (
    <CanvasToggleContext.Provider value={{ light, toggle }}>
      <AppShellProvider>
        <div className="min-h-screen" style={light ? LIGHT : DARK}>
          <ShellInner>{children}</ShellInner>
        </div>
      </AppShellProvider>
    </CanvasToggleContext.Provider>
  );
}

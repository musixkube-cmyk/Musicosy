"use client";

import { AppShellProvider } from "@/state/app-shell";
import { ShellInner } from "@/components/shell/ShellInner";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellProvider>
      <ShellInner>{children}</ShellInner>
    </AppShellProvider>
  );
}

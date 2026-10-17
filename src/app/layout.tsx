import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

/**
 * ROOT LAYOUT — applies the Musicosy design system to every surface.
 *
 * Imports globals.css at the root so the design tokens (background, foreground,
 * accent, border, etc.) are available everywhere — landing, ad center, social,
 * help center, developers, signin/signup.
 *
 * Per-route-group layouts may still layer their own fonts or dark-mode
 * overrides on top, but the base token set lives here.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Questrial, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

/**
 * ROOT LAYOUT — applies the Musicosy design system to every surface.
 *
 * Four fonts loaded at root so every route group can use what it needs:
 *   - Questrial   → marketing landing display
 *   - DM Sans     → marketing landing body
 *   - Inter       → consumer social app (MD3 surface)
 *   - JetBrains Mono → social app data + label-caps
 *
 * Material Symbols (the icon set used by the social app) is loaded via
 * a CDN <link> in <head> because next/font doesn't support icon fonts.
 *
 * Per-route-group layouts may still layer their own globals.css on top,
 * but the base token set + fonts live here so every surface has access.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const questrial = Questrial({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-questrial",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Musicosy — Stream. Earn. Publish.",
    template: "%s — Musicosy",
  },
  description:
    "Musicosy is the social platform for music: stream what you love, earn from every play, and publish straight to labels, sync agents and distributors.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} ${questrial.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Material Symbols — icon set used by the consumer social app */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

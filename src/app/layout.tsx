import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Questrial, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

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
  keywords: [
    "Musicosy",
    "music platform",
    "stream music",
    "earn from music",
    "publish music",
    "indie artists",
    "labels",
    "sync agents",
  ],
  authors: [{ name: "Musicosy" }],
  openGraph: {
    title: "Musicosy — Stream. Earn. Publish.",
    description:
      "Stream, earn and publish on the social platform built for creators, indie artists, labels and advertisers.",
    url: "https://musicosy.com",
    siteName: "Musicosy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musicosy — Stream. Earn. Publish.",
    description:
      "Stream, earn and publish on the social platform built for creators, indie artists, labels and advertisers.",
  },
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable} ${questrial.variable} ${dmSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <style>{`
          :root {
            --font-display: "Questrial", sans-serif;
            --font-sans: "DM Sans", sans-serif;
            --font-headline-sm: "Inter", sans-serif;
            --font-headline-md: "Inter", sans-serif;
            --font-body-sm: "Inter", sans-serif;
            --font-body-lg: "Inter", sans-serif;
            --font-mono-data: "JetBrains Mono", monospace;
            --font-label-caps: "JetBrains Mono", monospace;
          }
        `}</style>
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

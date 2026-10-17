import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the IM preview proxy domains to access the dev server.
  // Without this, Next.js 16 blocks cross-origin /_next/* requests from
  // preview-chat-*.space-z.ai, which prevents client hydration and
  // causes video elements to fail with NotSupportedError because the
  // page never fully hydrates.
  allowedDevOrigins: [
    "preview-chat-*.space-z.ai",
    "preview-*.space-z.ai",
    "*.space-z.ai",
    "localhost",
    "127.0.0.1",
    "21.0.21.188",
  ],
};

export default nextConfig;

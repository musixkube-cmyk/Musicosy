import PlaceholderPage from "../_placeholder";

export const metadata = {
  title: "Developers — Musicosy API",
  description:
    "399 endpoints across 27 domains, scoped keys, webhooks, and a dashboard.",
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Developer"
      title="API & Developers"
      body="399 endpoints across 27 domains, scoped API keys, webhooks, and a developer dashboard. This is the fifth surface in our build order — landing after Help Center. It will expose the full Musicosy API reference, getting-started guides, appendices, and a dashboard for managing keys and webhooks."
      nextHref="/ads"
      nextLabel="Open Ad Center"
    />
  );
}

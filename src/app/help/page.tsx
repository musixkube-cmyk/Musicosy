import PlaceholderPage from "../_placeholder";

export const metadata = {
  title: "Help Center — Musicosy",
  description:
    "Guides, policies, transparency reports, and escalation paths.",
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Support"
      title="Help Center"
      body="Guides, policies, transparency reports, and escalation paths. The help center is the fourth surface in our build order — landing after Settings. It will cover the full 16-section advertising help tree plus account, billing, security, and developer docs."
      nextHref="/ads"
      nextLabel="Open Ad Center"
    />
  );
}

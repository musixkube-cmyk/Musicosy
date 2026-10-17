import PlaceholderPage from "../_placeholder";

export const metadata = {
  title: "Settings — Musicosy",
  description:
    "Profile, organization, team members, roles and permissions.",
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Account"
      title="Settings"
      body="Profile, organization, team members, roles and permissions. The settings surface unifies account, billing, security, and workspace configuration across every Musicosy portal. Third in our build order — landing after Social."
      nextHref="/signin"
      nextLabel="Sign in to continue"
    />
  );
}

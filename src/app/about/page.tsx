import PlaceholderPage from "../_placeholder";

export const metadata = {
  title: "About — Musicosy",
  description: "About page",
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Company"
      title="About"
      body="This page is part of the Musicosy marketing surface and will be filled in as the landing is finalized."
      nextHref="/"
      nextLabel="Back to home"
    />
  );
}

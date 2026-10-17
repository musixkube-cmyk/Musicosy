import PlaceholderPage from "../_placeholder";

export const metadata = {
  title: "Sign up — Musicosy",
  description: "Create your free Musicosy account and release your music everywhere.",
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Auth"
      title="Create your account"
      body="Create your free Musicosy account and release your music everywhere. Sign-up is part of the auth surface — we already have /ads/signin working with Supabase, and /signup will follow the same pattern once the landing ships."
      nextHref="/ads/signin"
      nextLabel="Sign in instead"
    />
  );
}

import { redirect } from "next/navigation";

/**
 * Root entry — the Musicosy Ad Center dashboard lives at /ads.
 * Bounce visitors there immediately so the preview at "/" shows real content.
 */
export default function RootPage() {
  redirect("/ads");
}

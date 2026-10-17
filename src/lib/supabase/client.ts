import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./env";

/**
 * Browser-side Supabase client.
 * Use this only inside Client Components (`"use client"`) or event handlers.
 * The session is persisted in cookies managed by @supabase/ssr.
 *
 * Returns `null` when Supabase env vars are missing instead of throwing —
 * so pages can render a "Supabase not configured" state instead of 500-ing.
 * Callers must null-check before using the client.
 *
 *   const supabase = createBrowserClient();
 *   if (!supabase) return <SupabaseNotConfigured />;
 *   const { data } = await supabase.from("...").select("*");
 */
export function createBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  return createSSRBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export type BrowserClient = ReturnType<typeof createSSRBrowserClient>;

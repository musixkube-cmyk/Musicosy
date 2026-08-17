import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSupabase } from "@/lib/supabase/guard";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { pgPool } from "@/lib/pg";

/**
 * POST /api/auth/check-email
 * Body: { email: string }
 * Returns: { exists: boolean }
 *
 * Used by the signin page to decide whether to render the sign-in flow
 * (email already registered) or the sign-up flow (new user) — without
 * requiring the user to submit wrong credentials first.
 *
 * Two paths:
 *
 * 1. Supabase configured (production):
 *      Calls the `public.user_exists_by_email(text)` Postgres function via
 *      the Supabase service-role client's `rpc()` method. The RPC is only
 *      callable with the service_role key — anon/authenticated roles cannot
 *      invoke it directly.
 *
 * 2. Sandbox fallback (no Supabase env vars):
 *      Queries `auth.users` directly via the pg pool. RLS isn't enforced
 *      for direct server-side queries (we're connecting as the postgres
 *      superuser), so this is equivalent to the service_role path.
 *
 * Security note: this endpoint enables user enumeration by email. That is
 * an explicit UX trade-off the product has accepted (matches the pattern
 * used by Linear, Notion, Vercel, Stripe, etc.).
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email as string | undefined)?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  // --- Sandbox path: query auth.users directly via pg pool ---
  if (!isSupabaseConfigured({ requireServiceRole: true })) {
    try {
      const result = await pgPool.query<{ exists: boolean }>(
        `SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = lower($1)) AS exists`,
        [email],
      );
      return NextResponse.json({ exists: Boolean(result.rows[0]?.exists) });
    } catch (err) {
      const msg = (err as Error)?.message || "lookup failed";
      return NextResponse.json({ error: "lookup failed", detail: msg }, { status: 500 });
    }
  }

  // --- Production path: invoke the user_exists_by_email RPC ---
  // Note: in the production path we still need the requireSupabase guard
  // to short-circuit if Postgres isn't configured for the pg path. We reach
  // here only when Supabase IS fully configured, so requireSupabase() passes.
  const __sb = requireSupabase({ requireServiceRole: true });
  if (__sb) return __sb;

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("user_exists_by_email", {
    p_email: email,
  });

  if (error) {
    return NextResponse.json(
      { error: "lookup failed", detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ exists: Boolean(data) });
}

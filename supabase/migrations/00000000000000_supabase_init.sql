-- ============================================================================
-- MUSICOSY SANDBOX INIT: Supabase-auth emulation layer
-- ============================================================================
-- This file is a sandbox-only bootstrap. In a real Supabase deployment, the
-- GoTrue auth service and Supabase CLI's `supabase db reset` create:
--   - The `auth` schema (with `auth.users`, `auth.sessions`, etc.)
--   - The `anon`, `authenticated`, `service_role` roles
--   - The `uuid-ossp` extension (providing uuid_generate_v4())
--
-- Since this sandbox runs a bare embedded-postgres (no GoTrue, no Supabase
-- container), we emulate those pieces here so the real migrations can run.
--
-- Idempotent: safe to re-run.
-- ============================================================================

-- ============================================================================
-- 1. Extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- If uuid-ossp couldn't be installed (binary unavailable on minimal PG),
-- provide uuid_generate_v4() as a wrapper around pgcrypto's gen_random_uuid()
-- so the schema migration's `DEFAULT uuid_generate_v4()` still works.
CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
RETURNS uuid
LANGUAGE sql
AS $$ SELECT gen_random_uuid(); $$;
COMMENT ON FUNCTION public.uuid_generate_v4() IS
  'Sandbox shim: aliases pgcrypto gen_random_uuid() so legacy uuid-ossp calls work.';

-- Expose it without schema prefix by adding `public` to search_path (default
-- already includes public). If callers call uuid_generate_v4() unqualified,
-- they'll find it here.

-- ============================================================================
-- 2. Supabase auth roles
-- ============================================================================
-- Supabase creates these three roles at project provisioning time:
--   - anon           — unauthenticated requests (public API access)
--   - authenticated  — logged-in users (RLS policies typically grant TO this)
--   - service_role    — server-side admin (bypasses RLS)
DO $$ BEGIN
  CREATE ROLE anon NOLOGIN NOREPLICATION;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE ROLE authenticated NOLOGIN NOREPLICATION;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE ROLE service_role NOLOGIN NOREPLICATION BYPASSRLS;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 3. auth schema + auth.users table
-- ============================================================================
-- This is a minimal subset of the real Supabase auth.users table — just the
-- columns the Musicosy signup route (src/app/api/auth/signup/route.ts) inserts
-- into, plus the columns the local signin route will read to verify passwords.
--
-- The real table has ~50 columns; we only need the ones our code touches.
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  instance_id            uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aud                    text NOT NULL DEFAULT 'authenticated',
  role                   text NOT NULL DEFAULT 'authenticated',
  email                  text UNIQUE NOT NULL,
  encrypted_password     text,
  email_confirmed_at     timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  last_sign_in_at        timestamptz,
  raw_app_meta_data      jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_user_meta_data     jsonb NOT NULL DEFAULT '{}'::jsonb,
  email_change           text NOT NULL DEFAULT '',
  email_change_token_new text NOT NULL DEFAULT '',
  email_change_token_current text NOT NULL DEFAULT '',
  phone                  text,
  phone_change           text NOT NULL DEFAULT '',
  confirmation_token     text NOT NULL DEFAULT '',
  recovery_token         text NOT NULL DEFAULT ''
);

-- The signup route inserts lowercased emails; make sure the unique constraint
-- enforces case-insensitive uniqueness too (matches Supabase behavior).
CREATE UNIQUE INDEX IF NOT EXISTS auth_users_email_idx
  ON auth.users (lower(email));

-- ============================================================================
-- 4. Grant access — anon and authenticated can read their own row (RLS will
--    be enabled later by the rls_policies migration for public.* tables; the
--    auth schema is normally locked down to service_role only).
-- ============================================================================
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT SELECT ON auth.users TO service_role;
GRANT INSERT, UPDATE, SELECT ON auth.users TO service_role;

/*
# Create authentication and multi-tenancy schema

## Overview
Creates foundational tables for a multi-tenant enterprise CRM:
- `profiles` — extends auth.users with display info
- `organizations` — tenant root
- `organization_members` — user <-> organization join with role

## Tables
1. profiles: id, email, full_name, avatar_url, title, created_at, updated_at
2. organizations: id, name, slug, owner_id, plan, created_at, updated_at
3. organization_members: id, organization_id, user_id, role, invited_by, created_at, updated_at

## Triggers
- handle_new_user: auto-creates profile row on auth.users insert
- set_updated_at: auto-updates updated_at on all three tables

## RLS
- profiles: users read/update own profile
- organizations: members read; owner insert/update/delete
- organization_members: members read; owner/admin insert; owner update; self/owner delete
*/

-- ============================================
-- Step 1: Create all tables first
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  plan text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'sales_rep',
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- ============================================
-- Step 2: Enable RLS on all tables
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 3: Policies for profiles
-- ============================================
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================
-- Step 4: Policies for organizations
-- ============================================
DROP POLICY IF EXISTS "select_orgs_as_member" ON organizations;
CREATE POLICY "select_orgs_as_member" ON organizations FOR SELECT
  TO authenticated USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_orgs" ON organizations;
CREATE POLICY "insert_orgs" ON organizations FOR INSERT
  TO authenticated WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "update_orgs_as_owner" ON organizations;
CREATE POLICY "update_orgs_as_owner" ON organizations FOR UPDATE
  TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "delete_orgs_as_owner" ON organizations;
CREATE POLICY "delete_orgs_as_owner" ON organizations FOR DELETE
  TO authenticated USING (owner_id = auth.uid());

-- ============================================
-- Step 5: Policies for organization_members
-- ============================================
DROP POLICY IF EXISTS "select_members_in_org" ON organization_members;
CREATE POLICY "select_members_in_org" ON organization_members FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
      AND om2.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_members_as_owner_or_admin" ON organization_members;
CREATE POLICY "insert_members_as_owner_or_admin" ON organization_members FOR INSERT
  TO authenticated WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
      AND om2.user_id = auth.uid()
      AND om2.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "update_members_as_owner" ON organization_members;
CREATE POLICY "update_members_as_owner" ON organization_members FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
      AND om2.user_id = auth.uid()
      AND om2.role = 'owner'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
      AND om2.user_id = auth.uid()
      AND om2.role = 'owner'
    )
  );

DROP POLICY IF EXISTS "delete_members_self_or_owner" ON organization_members;
CREATE POLICY "delete_members_self_or_owner" ON organization_members FOR DELETE
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
      AND om2.user_id = auth.uid()
      AND om2.role = 'owner'
    )
  );

-- ============================================
-- Step 6: Triggers
-- ============================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS organizations_updated_at ON organizations;
CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS organization_members_updated_at ON organization_members;
CREATE TRIGGER organization_members_updated_at BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

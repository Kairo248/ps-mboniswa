-- =============================================================================
-- Dual-Identity Platform Schema (Gospel Artist & Pastor)
-- Supabase migration: profiles, content_feed, itinerary + RLS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ENUM types
-- -----------------------------------------------------------------------------
CREATE TYPE app_role AS ENUM ('super_admin', 'editor');

CREATE TYPE content_category AS ENUM ('Sermon', 'Music', 'Event');

CREATE TYPE content_status_tag AS ENUM ('Hot', 'New', 'Popular', 'Live');

-- -----------------------------------------------------------------------------
-- Table: profiles (Admin RBAC)
-- -----------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role app_role NOT NULL DEFAULT 'editor',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Optional: auto-create profile on signup (run after auth is set up)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, email, full_name, role)
--   VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'editor');
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Table: content_feed
-- -----------------------------------------------------------------------------
CREATE TABLE content_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT,
  category content_category NOT NULL,
  status_tag content_status_tag,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TRIGGER content_feed_updated_at
  BEFORE UPDATE ON content_feed
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- Table: itinerary (upcoming appearances)
-- -----------------------------------------------------------------------------
CREATE TABLE itinerary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location_name TEXT,
  location_coord TEXT,
  ticket_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TRIGGER itinerary_updated_at
  BEFORE UPDATE ON itinerary
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS: Enable on all tables
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary ENABLE ROW LEVEL SECURITY;

-- Helper: true if current user is an admin (super_admin or editor)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: true if current user is super_admin only
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -----------------------------------------------------------------------------
-- RLS Policies: profiles
-- -----------------------------------------------------------------------------
-- Anyone (including anon) can SELECT profiles (e.g. to show role for UI)
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  USING (true);

-- Only admins can INSERT/UPDATE profiles
CREATE POLICY "profiles_insert_admin"
  ON profiles FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Optional: users can update their own profile (non-role fields) if you prefer
-- CREATE POLICY "profiles_update_own"
--   ON profiles FOR UPDATE
--   USING (auth.uid() = id)
--   WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- RLS Policies: content_feed
-- -----------------------------------------------------------------------------
CREATE POLICY "content_feed_select_all"
  ON content_feed FOR SELECT
  USING (true);

CREATE POLICY "content_feed_insert_admin"
  ON content_feed FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "content_feed_update_admin"
  ON content_feed FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "content_feed_delete_admin"
  ON content_feed FOR DELETE
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS Policies: itinerary
-- -----------------------------------------------------------------------------
CREATE POLICY "itinerary_select_all"
  ON itinerary FOR SELECT
  USING (true);

CREATE POLICY "itinerary_insert_admin"
  ON itinerary FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "itinerary_update_admin"
  ON itinerary FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "itinerary_delete_admin"
  ON itinerary FOR DELETE
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- Indexes for common queries
-- -----------------------------------------------------------------------------
CREATE INDEX idx_content_feed_category ON content_feed(category);
CREATE INDEX idx_content_feed_status_tag ON content_feed(status_tag);
CREATE INDEX idx_content_feed_created_at ON content_feed(created_at DESC);
CREATE INDEX idx_itinerary_event_date ON itinerary(event_date);
CREATE INDEX idx_profiles_role ON profiles(role);

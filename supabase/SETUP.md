# Supabase database setup

Follow these steps to create a **new Supabase project** (your database) and apply this app’s schema.

---

## 1. Create a new project (new database)

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard)** and sign in.
2. Click **New project**.
3. Choose your **organization** (or create one).
4. Set:
   - **Name:** e.g. `ps-mboniswa` or `dual-identity`
   - **Database password:** choose a strong password and **save it** (you need it for direct DB access).
   - **Region:** pick the one closest to you.
5. Click **Create new project** and wait until the project is ready.

You now have a new database (and Auth, Storage, etc.) for this project.

---

## 2. Get your project keys

1. In the project, go to **Project Settings** (gear icon) → **API**.
2. Copy:
   - **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In the project root, create or update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Optional – Booking form (WhatsApp):** To have the booking form open WhatsApp with the message, add your WhatsApp number (country code + number, no spaces, e.g. `27123456789`):

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=27123456789
```

---

## 3. Apply the schema (tables + RLS)

Use **one** of these two ways.

### Option A: Supabase SQL Editor (no CLI)

1. In the dashboard, open **SQL Editor**.
2. Open `supabase/migrations/001_dual_identity_schema.sql` in your repo.
3. Copy its full contents and paste into a new query in the SQL Editor.
4. Click **Run**. You should see “Success. No rows returned.”
5. In **Table Editor** you should see `profiles`, `content_feed`, and `itinerary`.

### Option B: Supabase CLI (link + push)

1. Install the CLI if needed: `npm install -g supabase`
2. Log in: `supabase login`
3. Link this repo to your project:  
   `supabase link --project-ref YOUR_PROJECT_REF`  
   (Project ref is in Project Settings → General → Reference ID.)
4. Push migrations:  
   `supabase db push`
5. Confirm in **Table Editor** that `profiles`, `content_feed`, and `itinerary` exist.
6. Run the **storage** migration so admins can upload photos and videos:
   - Open **SQL Editor** again, then open `supabase/migrations/002_content_media_bucket.sql`.
   - Copy its contents, paste into a new query, and click **Run**.
   - In **Storage** you should see a public bucket `content-media`.
7. **Add image support for itinerary events** (required for admin itinerary): in the SQL Editor, run:
   ```sql
   ALTER TABLE itinerary ADD COLUMN IF NOT EXISTS image_url TEXT;
   ```
   Then click **Run**. This adds the `image_url` column so event images work.

---

## 4. Create your first admin user

1. In the dashboard go to **Authentication** → **Users** → **Add user** → **Create new user**.
2. Set **Email** and **Password** (e.g. `admin@example.com` and a strong password). Create the user.
3. Copy the new user’s **UUID** from the Users list.
4. Go to **Table Editor** → **profiles** → **Insert row**:
   - **id:** paste the user’s UUID
   - **email:** same email (e.g. `admin@example.com`)
   - **role:** `super_admin`
5. Save the row.

You can now sign in at your app’s `/login` with that email and password; only users with `super_admin` can access `/admin`.

---

## Optional: auto-create profile on signup

To automatically insert a row in `profiles` when someone signs up (with default role `editor`), run this once in the SQL Editor after the main migration:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'editor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Then new users will get a profile; you can change their `role` to `super_admin` in **profiles** when needed.


nddXYL1E63aVAt4l
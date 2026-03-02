# Deploy to Vercel

## 1. Push your code to GitHub

If you haven’t already, turn the project into a Git repo and push it to GitHub:

```bash
cd ps-mboniswa
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

(Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.)

## 2. Import the project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. Import the GitHub repository that contains **ps-mboniswa**.
4. If the repo has multiple folders, set **Root Directory** to `ps-mboniswa` (or leave blank if the repo root is the Next.js app).
5. **Framework Preset:** Vercel should detect **Next.js** automatically.
6. **Build Command:** `npm run build` (default).
7. **Output Directory:** leave default.
8. Do **not** deploy yet; add environment variables first.

## 3. Environment variables

In the Vercel project, go to **Settings** → **Environment Variables** and add:

| Name | Value | Notes |
|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | From Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | From Supabase → Project Settings → API |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | e.g. `27123456789` | Optional; for the booking form |

Use the same values as in your local `.env` or `.env.local`. Apply them to **Production**, and optionally to **Preview** if you want them on branch deployments.

## 4. Deploy

Click **Deploy**. Vercel will run `npm run build` and then deploy. Your app will be available at a URL like `https://your-project.vercel.app`.

## 5. After deploy

- **Supabase:** Confirm your Supabase project allows requests from your Vercel domain (e.g. `https://your-project.vercel.app`). For Supabase Auth, add this URL in **Authentication** → **URL Configuration** → **Redirect URLs** if you use redirects after login.
- **Custom domain:** In the Vercel project, go to **Settings** → **Domains** to add your own domain.

## Deploying from the CLI (optional)

```bash
npm i -g vercel
cd ps-mboniswa
vercel
```

Follow the prompts and add the same environment variables when asked or in the Vercel dashboard.

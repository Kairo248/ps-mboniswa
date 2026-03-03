# Security – do not commit to GitHub

These must **never** be committed or pushed to GitHub (they are in `.gitignore`).

## Environment files (secrets)

- **`.env`** – any file starting with `.env` except `.env.example`
- **`.env.local`**, **`.env.development`**, **`.env.production`**, etc.

They contain:

- **`NEXT_PUBLIC_SUPABASE_URL`** – your Supabase project URL  
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** – Supabase anon key (public but project-specific)  
- **`NEXT_PUBLIC_WHATSAPP_NUMBER`** – optional WhatsApp number for the booking form  

Use **`.env.example`** as a template only (no real values). Set real values in Vercel (or your host) and locally in `.env` / `.env.local`, which are git-ignored.

## Before pushing

1. Run: `git status` and confirm no `.env` or `.env.local` is staged.  
2. If you ever committed env files by mistake: remove them from history and rotate the keys (new Supabase anon key if needed).

## Safe to commit

- **`.env.example`** – placeholder variable names and example values only  
- **`SECURITY.md`** and **`DEPLOY.md`** – no secrets, only instructions  
- **`supabase/config.toml`** – uses `env(...)` for secrets; no raw keys in file  

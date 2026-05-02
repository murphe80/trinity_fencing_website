# Deployment Guide

This guide covers deploying the DUFC website to Vercel and configuring the custom domain.

---

## Prerequisites

- A GitHub account with access to the DUFC repository
- A Vercel account (free tier is sufficient)
- All Google API credentials configured (see [GOOGLE_API_SETUP.md](./GOOGLE_API_SETUP.md))

---

## Step 1 — Connect the GitHub Repo to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Select the DUFC GitHub repository
4. Vercel will auto-detect Next.js — leave all settings as default
5. Click **Deploy**

Vercel will build and deploy the site. Every push to the `main` branch will trigger a new deployment automatically.

---

## Step 2 — Set Environment Variables in Vercel

1. In the Vercel dashboard, go to **Project → Settings → Environment Variables**
2. Add each variable from your `.env.local` file:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `GOOGLE_SHEETS_ID`
   - `GOOGLE_CALENDAR_ID`
   - `DRIVE_GALLERY_FOLDER_ID`
   - `DRIVE_INSTAGRAM_FOLDER_ID`
3. Set the environment to **Production** (and optionally Preview)
4. Click **Save**
5. Trigger a new deployment (push a commit or click Redeploy)

---

## Step 3 — Create a Deploy Hook

The Deploy Hook allows the Google Apps Script to trigger a website rebuild when the Sheet changes.

1. In Vercel → Project → **Settings → Git → Deploy Hooks**
2. Click **Create Hook**
3. Name it: `Google Sheets Trigger`
4. Branch: `main`
5. Copy the generated URL
6. Paste it into the Apps Script in the Google Sheet (see [GOOGLE_API_SETUP.md](./GOOGLE_API_SETUP.md), Step 6)
7. Also save it in `.env.local.example` as `VERCEL_DEPLOY_HOOK_URL` for documentation

---

## Step 4 — Configure the Custom Domain

1. In Vercel → Project → **Settings → Domains**
2. Add `trinityfencing.ie`
3. Vercel will show the DNS records you need to set
4. Log in to your domain registrar (where trinityfencing.ie is registered)
5. Update the DNS records as instructed by Vercel (usually an A record and/or CNAME)
6. DNS propagation takes up to 48 hours — the site will be live at trinityfencing.ie once it propagates

---

## Local Development

```bash
npm install
cp .env.local.example .env.local
# Fill in .env.local with real credentials

npm run dev
# → http://localhost:3000
```

The dev server uses the mock data in `/lib/google-calendar.ts` and `/lib/google-sheets.ts` if credentials are not set. Real data will load once credentials are configured and the TODO API calls are implemented.

---

## Updating the Site

For **content changes** (events, achievements, members): no deployment needed — use Google Calendar/Sheets as described in the [/docs](.) guides.

For **design or structural changes**: edit the code locally, push to GitHub, and Vercel will deploy automatically.

# Dublin University Fencing Club — Website

The official website for Dublin University Fencing Club (DUFC), trinityfencing.ie.

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and hosted on **Vercel**.  
Content is managed entirely through Google Calendar, Google Sheets, and Google Drive — no CMS dashboard required.

---

## Quick Start (Developers)

```bash
git clone <repo-url>
cd dufc-website
npm install

# Copy the environment variable template
cp .env.local.example .env.local
# Fill in your Google credentials in .env.local

npm run dev
# → http://localhost:3000
```

See [/docs/GOOGLE_API_SETUP.md](./docs/GOOGLE_API_SETUP.md) for credential setup.  
See [/docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for Vercel deployment.

---

## Content Management (Non-Technical)

All content is managed through Google. You do **not** need to touch any code:

| What to update | How |
|---|---|
| Events & training sessions | Google Calendar (dufencing@gmail.com) |
| Competition results & achievements | DUFC Google Sheet → Achievements tab |
| Committee members & photos | DUFC Google Sheet → Committee tab |
| Coach information | DUFC Google Sheet → Coach tab |
| Instagram featured photos | DUFC Google Sheet → Instagram Featured tab |
| Honorary members | DUFC Google Sheet → Honorary Members tab |

The website rebuilds automatically within ~60 seconds of any Sheet edit. See the [/docs](./docs/) folder for step-by-step guides.

---

## Architecture

```
Google Calendar / Sheets / Drive
        ↓ (Google APIs, server-side only)
Next.js 14 App Router (ISR)
        ↓ (Git push or Deploy Hook)
Vercel → trinityfencing.ie
```

Pages use **Incremental Static Regeneration (ISR)** — they are pre-rendered at build time and silently refreshed in the background on a schedule. The Vercel Deploy Hook forces an immediate rebuild when the Google Sheet changes.

---

## Making Structural Changes

If you need to change the site layout, add a new page, or make design changes, this requires a developer or an AI coding agent. The complete design specification is in [DUFC_Website_Design_Document.md](./DUFC_Website_Design_Document.md) and the [/docs](./docs/) folder contains setup guides for all integrations.

To hand the repo to an AI agent: share this README, the design document, and the [/docs](./docs/) folder as context.

---

## Tech Stack

- **Next.js 14** (App Router) — framework
- **TypeScript** — type safety
- **Tailwind CSS** — styling
- **Vercel** — hosting & deployment
- **Google Calendar API v3** — events
- **Google Sheets API v4** — achievements, members, gallery metadata
- **Google Drive API v3** — photos
- **Mailchimp** — newsletter (embedded form on /friends)
- **Vercel Analytics** — page views

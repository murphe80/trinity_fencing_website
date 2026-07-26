# Dublin University Fencing Club — Website Design Document

> **Purpose of this document:** This is a complete specification for building the DUFC website. It is intended to be handed directly to an AI coding agent with no additional context required. Every architectural decision, design choice, integration detail, data schema, and content management workflow is documented here. Read the entire document before writing any code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Constraints](#2-goals--constraints)
3. [Tech Stack](#3-tech-stack)
4. [Architecture Overview](#4-architecture-overview)
5. [Design System](#5-design-system)
6. [Site Map & Navigation](#6-site-map--navigation)
7. [Page Specifications](#7-page-specifications)
8. [Google Integration Architecture](#8-google-integration-architecture)
9. [Data Schemas](#9-data-schemas)
10. [Mailchimp Integration](#10-mailchimp-integration)
11. [Project File & Folder Structure](#11-project-file--folder-structure)
12. [Environment Variables](#12-environment-variables)
13. [Deployment Configuration](#13-deployment-configuration)
14. [Content Management Workflows](#14-content-management-workflows)
15. [README Files to Create](#15-readme-files-to-create)

---

## 1. Project Overview

**Club:** Dublin University Fencing Club (DUFC), the fencing club of Trinity College Dublin.  
**Domain:** trinityfencing.ie (existing domain, point DNS to Vercel)  
**Google Account:** dufencing@gmail.com  
**Instagram:** [@trinityfencing](https://www.instagram.com/trinityfencing/)  
**Current Wikipedia:** https://en.wikipedia.org/wiki/Dublin_University_Fencing_Club  

### Club Background

DUFC is one of Ireland's oldest and most decorated university fencing clubs. While the modern club was formally established in 1936, its roots trace back to 1774 when Trinity College students formed a "Gentleman's Club of the Sword." In 1774, Provost John Hely-Hutchinson formally established fencing in Trinity, employing a fencing master and designating the Senate House for this purpose. The club caters for foil, épée, and sabre, and has produced five Olympians. It consistently ranks at the top of the national club medal table and was named Trinity Sport's Club of the Year in 2017 and again in 2025.

**Club Colours:** Red (`#C8102E`) and Black (`#0A0A0A`)  
**Club Crest:** Available in the repository at `/public/images/crest.png` (the crest image will be provided — a circular seal reading "Universitas Dublinensis Sodalitas Ars Gladii" with crossed sabres beneath)

---

## 2. Goals & Constraints

### Primary Goals
- Improve visibility of the club, its events, and achievements
- Make the site maintainable by non-technical future captains with zero code knowledge
- Ensure the Google account (dufencing@gmail.com) is the primary interface for all content updates

### Key Constraints
- **Free to host:** Vercel free tier + GitHub. No paid services except what the club already uses (Mailchimp, Google Workspace)
- **No CMS dashboard:** All content is managed through Google Calendar, Google Sheets, and Google Forms
- **Non-technical maintainability:** After initial build, structural code changes should be rare. Content updates happen entirely through Google
- **AI-agent handoff:** Comprehensive READMEs in the repo allow a future captain to hand the repo to an AI agent for any structural changes

---

## 3. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js 14** (App Router) | First-class Vercel support, ISR for auto-refreshing content, TypeScript support |
| Language | **TypeScript** | Type safety reduces bugs, especially in API integration code |
| Styling | **Tailwind CSS** | Utility-first, no separate CSS files to maintain, easy theming via config |
| Hosting | **Vercel** (free tier) | Zero-config Next.js deployment, automatic HTTPS, deploy hooks |
| Source control | **GitHub** | Free, Vercel integrates natively |
| Events | **Google Calendar API v3** | Direct read from dufencing@gmail.com calendar |
| Structured content | **Google Sheets API v4** | Achievements, members, gallery metadata |
| Images | **Google Drive API v3** | Club photos stored in organised Drive folders |
| Form submissions | **Google Forms → Sheets** | Non-technical data entry for achievements, members |
| Deploy trigger | **Google Apps Script** | Watches Sheets for edits, calls Vercel Deploy Hook |
| Newsletter | **Mailchimp Embedded Form** | Existing Mailchimp account, embed signup form |
| Membership | **External link** to Clubforce | https://trinityfencing.clubforce.com/products/membership |
| Analytics | **Vercel Analytics** (free tier) | Page view tracking, no cookie banner required |

### Package Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "googleapis": "^140.0.0",
    "date-fns": "^3.0.0",
    "clsx": "^2.0.0",
    "@vercel/analytics": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT LAYER (Google)                    │
│                                                              │
│  Google Calendar ──── Events & competition dates            │
│  Google Sheets ─────── Achievements, Members, Gallery meta  │
│  Google Drive ──────── Photos & images                       │
│  Google Forms ──────── Data entry interface (non-technical) │
│  Apps Script ───────── Edit trigger → Vercel Deploy Hook    │
└──────────────────────────────┬──────────────────────────────┘
                               │ APIs (server-side, build time)
┌──────────────────────────────▼──────────────────────────────┐
│                  APPLICATION LAYER (Next.js)                 │
│                                                              │
│  /app                                                        │
│    ├── / ──────────── Home page (ISR, 1hr)                   │
│    ├── /events ─────── Calendar page (ISR, 30min)            │
│    ├── /achievements ── Timeline page (ISR, 1hr)             │
│    ├── /members ─────── People page (ISR, 6hr)               │
│    ├── /membership ──── Join page (static)                   │
│    ├── /shop ────────── Shop redirect/page (static)          │
│    └── /friends ─────── Alumni/donations page (static)       │
│                                                              │
│  /lib                                                        │
│    ├── google-calendar.ts                                    │
│    ├── google-sheets.ts                                      │
│    └── google-drive.ts                                       │
└──────────────────────────────┬──────────────────────────────┘
                               │ Git push / Deploy Hook
┌──────────────────────────────▼──────────────────────────────┐
│                   DEPLOYMENT (Vercel + GitHub)               │
│                                                              │
│  GitHub repo → Vercel builds on every push to main          │
│  Vercel Deploy Hook → triggered by Apps Script on Sheet edit │
│  Domain: trinityfencing.ie (DNS pointed at Vercel)           │
└─────────────────────────────────────────────────────────────┘
```

### ISR (Incremental Static Regeneration) Strategy

Pages are statically generated at build time and silently re-fetched in the background on a schedule. This means the site is fast (pre-rendered HTML) but content stays fresh without a full rebuild.

| Page | Revalidation | Reason |
|---|---|---|
| Home | 3600s (1hr) | Latest achievements snippet, upcoming events |
| Events | 1800s (30min) | Calendar may be updated frequently |
| Achievements | 3600s (1hr) | Updated occasionally via Sheet |
| Members | 21600s (6hr) | Updated rarely, once per season |
| All others | `false` (fully static) | No dynamic content |

In addition to ISR, the Vercel Deploy Hook triggered by Apps Script forces an immediate full rebuild whenever the Sheets content changes.

---

## 5. Design System

### 5.1 Colour Palette

```typescript
// tailwind.config.ts
colors: {
  red: {
    DEFAULT: '#C8102E',   // Trinity/DUFC red — primary brand colour
    dark:    '#A00D24',   // Hover states, accents
    light:   '#F5E6E9',   // Subtle backgrounds, tags
  },
  black: {
    DEFAULT: '#0A0A0A',   // Near-black for text and backgrounds
    soft:    '#1A1A1A',   // Card backgrounds on dark sections
  },
  cream:   '#F9F6F1',     // Primary page background (warm off-white)
  gold:    '#B8962E',     // Accent — drawn from the club crest colours
  grey: {
    light:  '#F3F3F3',    // Alternate section backgrounds
    mid:    '#9CA3AF',    // Muted text, metadata
    dark:   '#374151',    // Secondary body text
  },
  white:   '#FFFFFF',
}
```

### 5.2 Typography

```typescript
// Use Google Fonts via next/font
// Heading font: EB Garamond — serif, conveys heritage and tradition
// Body font: Inter — clean, modern, readable sans-serif

fontFamily: {
  heading: ['EB Garamond', 'Georgia', 'serif'],
  body:    ['Inter', 'system-ui', 'sans-serif'],
}
```

**Type Scale (Tailwind classes):**

| Element | Class |
|---|---|
| Page hero title | `font-heading text-5xl md:text-7xl font-semibold` |
| Section heading | `font-heading text-3xl md:text-4xl font-semibold` |
| Subsection heading | `font-heading text-2xl font-semibold` |
| Card title | `font-heading text-xl font-medium` |
| Body text | `font-body text-base text-grey-dark leading-relaxed` |
| Small/meta text | `font-body text-sm text-grey-mid` |
| Navigation | `font-body text-sm font-medium uppercase tracking-widest` |

### 5.3 Spacing & Layout

- **Max content width:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section vertical padding:** `py-16 md:py-24`
- **Card gap:** `gap-6 md:gap-8`
- **Border radius:** Cards use `rounded-lg`, buttons use `rounded-md`
- **Shadows:** Cards use `shadow-sm hover:shadow-md transition-shadow`

### 5.4 Component Patterns

**Primary Button:**
```html
<button class="bg-red text-white px-6 py-3 rounded-md font-body font-medium 
               text-sm uppercase tracking-wide hover:bg-red-dark 
               transition-colors duration-200">
  Label
</button>
```

**Secondary Button / Outline:**
```html
<button class="border-2 border-red text-red px-6 py-3 rounded-md font-body 
               font-medium text-sm uppercase tracking-wide hover:bg-red 
               hover:text-white transition-colors duration-200">
  Label
</button>
```

**Section Divider Pattern:** Alternate between `bg-cream` and `bg-grey-light` for visual separation without harsh borders.

**Dark Section (Hero, CTA strips):** `bg-black text-white` with `text-red` accents.

**Tag / Badge:**
```html
<span class="inline-block bg-red-light text-red text-xs font-medium 
             px-2.5 py-1 rounded-full uppercase tracking-wide">
  Competition
</span>
```

**Event tags** use these colour assignments:
- Competition → `bg-red-light text-red`
- Training → `bg-blue-50 text-blue-700`
- Social → `bg-green-50 text-green-700`
- Alumni → `bg-gold/10 text-gold`

### 5.5 Header

Fixed top navigation bar. Height: `h-16`. Background: `bg-black`. On scroll past 80px, add `shadow-md`.

Logo area: Club crest image (32×32px) + "DUFC" wordmark in `font-heading text-white text-xl`. On wider screens, show full "Dublin University Fencing Club."

Nav links: `text-white/80 hover:text-white` with a `border-b-2 border-red` underline on the active page.

Mobile: hamburger menu revealing a full-screen overlay with nav links stacked vertically.

### 5.6 Footer

Three-column layout on desktop, stacked on mobile. Background `bg-black`, text `text-white/70`.

**Column 1:** Club crest (48px) + name + short tagline ("Ireland's oldest university fencing club. Founded 1774.")

**Column 2:** Quick links (Home, Events, Achievements, Members, Membership, Shop, Friends of DUFC)

**Column 3:** Social & External Links
- Instagram: [@trinityfencing](https://www.instagram.com/trinityfencing/) — include Instagram SVG icon
- [Fencing Ireland](https://irishfencing.net) — include external link icon
- [Trinity Sport](https://www.tcd.ie/Sport/) — include external link icon

**Bottom bar:** `© {currentYear} Dublin University Fencing Club. All rights reserved.`

---

## 6. Site Map & Navigation

```
trinityfencing.ie/
├── /                  → Home
├── /events            → Events & Calendar
├── /achievements      → Achievements Timeline
├── /members           → Club Members & Committee
├── /membership        → Join the Club
├── /shop              → Club Shop (McKeever)
└── /friends           → Friends of DUFC (Alumni & Donations)
```

**Navigation order:** Home · Events · Achievements · Members · Membership · Shop · Friends of DUFC

The "Membership" link should be visually distinct — style as a red-outlined pill button in the nav to drive conversions: `border border-red text-red px-3 py-1 rounded-full text-xs hover:bg-red hover:text-white`.

---

## 7. Page Specifications

---

### 7.1 Home Page (`/`)

**ISR revalidation:** 3600s

#### Section 1: Hero

Full-viewport-height hero. Background: dark overlay (`bg-black/60`) over a high-quality action fencing photo (stored at `/public/images/hero.jpg` — use a placeholder if not yet provided; the file will be added to the repo).

Centred content:
- Club crest image (80px, white filter applied via CSS `filter: brightness(0) invert(1)`)
- Heading: `"Dublin University Fencing Club"` — `font-heading text-white text-5xl md:text-7xl`
- Subheading: `"Ireland's oldest university fencing club. Est. 1774."` — `text-white/80 text-lg md:text-xl mt-4`
- Two CTA buttons side by side: **"Join the Club"** (primary red) linking to `/membership`, and **"Our Story"** (outline white) linking to the About section below

#### Section 2: Stats Strip

Full-width `bg-red` strip with 4 stats displayed horizontally (or in a 2×2 grid on mobile):

| Stat | Value |
|---|---|
| Founded | 1774 |
| Olympians | 5 |
| Weapons | 3 (Foil, Épée, Sabre) |
| Club of the Year | 2017 & 2025 |

Each stat: large number in `font-heading text-white text-4xl`, label in `text-white/80 text-sm uppercase tracking-wide` below.

#### Section 3: About / History

Two-column layout (text left, image right). Image: `/public/images/about.jpg` (club training or historical photo — placeholder if not provided).

Heading: `"A Club With Deep Roots"`

Body text (write this content):
> Dublin University Fencing Club is the fencing club of Trinity College Dublin, catering for foil, épée, and sabre. While the modern club was established in 1936, fencing at Trinity has a history stretching back to 1774, when students formed the Gentleman's Club of the Sword. In 1774, Provost John Hely-Hutchinson formally established fencing in the college, employing a dedicated fencing master and designating the Senate House for practice.
>
> Today, DUFC is one of Ireland's premier fencing clubs, consistently topping the national club medal table, producing five Olympians, and welcoming students, alumni, and staff from Trinity College.

Below the text: "Read more on Wikipedia →" link (opens in new tab).

#### Section 4: Upcoming Events (dynamic)

Heading: `"Upcoming Events"`

Fetch the next 3 upcoming events from Google Calendar (see Section 8). Display as a horizontal row of event cards. Each card:
- Date badge (day + month, in red)
- Event title
- Location (from calendar event location field)
- Tag (Competition / Training / Social / Alumni — parsed from event description or calendar colour, see Section 8.1)
- "View all events →" link to `/events`

If no events are found, show a friendly message: "No upcoming events scheduled. Check back soon."

#### Section 5: Latest Achievements (dynamic)

Heading: `"Recent Highlights"`

Fetch the 3 most recent achievements from the Google Sheet (sorted by date descending). Display as cards:
- Year badge
- Event name + result
- Short description
- Thumbnail image (Drive URL)
- "View all achievements →" link to `/achievements`

#### Section 6: Instagram Strip

Heading: `"Follow Along"`

Subtext: `"@trinityfencing on Instagram"`

Display a 6-image grid linking to the club's Instagram profile. Since direct Instagram API embedding requires a Meta developer account, use a static approach: store the 6 most recent "feature" photos in a Google Drive folder called `Instagram Featured` and display them. Caption each with a short text from the Sheet. Include a prominent "Follow us on Instagram" button linking to https://www.instagram.com/trinityfencing/.

> **Implementation note:** Do not attempt to use the Instagram oEmbed API or the Graph API — these require app review and refresh tokens that expire. The static Drive-based approach is more reliable long-term.

#### Section 7: Recruitment CTA

Full-width dark section (`bg-black`). Centred text.

Heading: `"New to Fencing?"` in `font-heading text-white text-4xl`

Subtext: `"No experience needed, welcome fencers of all levels. Join us at training and try it for yourself."` in `text-white/70`.

Button: **"Find Out How to Join"** → `/membership`

---

### 7.2 Events Page (`/events`)

**ISR revalidation:** 1800s

#### Hero
Compact page hero (not full-viewport). `bg-black` with crest watermark (low opacity). Heading: `"Events & Calendar"`.

#### Filter Bar
A sticky filter row below the hero with pill-style toggle buttons for: **All** · **Competition** · **Training** · **Social** · **Alumni**. Clicking a filter hides non-matching events client-side (JavaScript, no reload). Active filter pill: `bg-red text-white`. Inactive: `border border-grey-mid text-grey-dark`.

#### Event List
Fetch all future events from Google Calendar (up to 50), grouped by month. Within each month group, events are sorted ascending by date.

**Month header:** `font-heading text-2xl text-black border-b border-grey-light pb-2 mb-4`

**Event card layout:**
```
┌────────────────────────────────────────────────────────┐
│  [DATE]   [TAG]                                        │
│  DAY      Event Title (font-heading text-xl)           │
│  MON      Location · Time                              │
│  YEAR     Description (first 150 chars of event desc)  │
└────────────────────────────────────────────────────────┘
```

Date is displayed as a left-aligned block: large day number (`text-3xl font-heading text-red`), abbreviated month (`text-sm uppercase text-grey-mid`), year (`text-xs text-grey-mid`).

If a Google Meet or external link is attached to the calendar event, show a "Details →" link.

#### Past Events Toggle
Below the upcoming events list, a collapsible section: "Past Events (this season)". Lists past events in reverse chronological order. Collapsed by default.

#### Google Calendar Embed
Below the list view, offer an optional "View as Calendar" toggle that shows the embedded Google Calendar iframe:
```html
<iframe 
  src="https://calendar.google.com/calendar/embed?src=dufencing%40gmail.com&ctz=Europe%2FDublin&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&bgcolor=%23C8102E"
  style="border:0" 
  width="100%" 
  height="600" 
  frameborder="0" 
  scrolling="no">
</iframe>
```

---

### 7.3 Achievements Page (`/achievements`)

**ISR revalidation:** 3600s

#### Hero
Heading: `"Achievements"`. Subtext: `"A record of DUFC's competitive highlights, season by season."`

#### Year Filter
Horizontal scrollable pill filter bar showing all years present in the Achievements Sheet data. "All" selected by default. Clicking a year filters client-side.

#### Timeline
Data is fetched from the `Achievements` Google Sheet (see Section 9.1). Grouped by academic year (e.g. "2024/25"), sorted descending (most recent first).

**Year heading:** Large serif year label on the left. A vertical red line runs down the left side connecting all events within that year.

**Achievement card** (connected to the timeline line):
- Event name (bold, `font-heading text-xl`)
- Date
- Competition level tag (e.g. Intervarsities, National, International)
- Weapon tag (Foil / Épée / Sabre / Team / Modern Pentathlon)
- Result / placement (e.g. "1st Place — Women's Sabre")
- Fencer name(s)
- Description (expandable — show first 100 chars with "Read more" toggle)
- Image(s): If image URLs are present in the Sheet, display as a thumbnail that opens a lightbox modal on click. Support multiple images per achievement (comma-separated URLs in the Sheet).

#### Olympians & International Representatives Section
A dedicated section below the timeline. Static content (hardcoded in the page, not from a Sheet) listing DUFC's Olympians:
- Patrick Duffy — 1948 & 1952 Olympics
- Harry Thuillier — 1952 & 1960 Olympics
- Shirley Armstrong — 1960 Olympics (Women's Foil)
- Brian Hamilton — 1960 Olympics (Individual Foil & Team Épée)
- Colm Murrogh Vere O'Brien — 1968 Olympics
- Natalya Coyle — 2012, 2016 & 2020 Olympics (Modern Pentathlon)

Display as a horizontal card row with name, discipline, and Olympics year(s).

#### Pinks Recipients Section
A collapsible section titled "DUCAC Pinks Recipients." Static content table (hardcoded from Wikipedia data) listing all recipients and dates. Collapsed by default.

---

### 7.4 Members Page (`/members`)

**ISR revalidation:** 21600s (6 hours)

#### Hero
Heading: `"The Club"`. Subtext: `"Meet the people who make DUFC what it is."`

#### Current Committee Section
Data from `Committee` tab in the Google Sheet. Display as a responsive grid (3 columns desktop, 2 tablet, 1 mobile).

**Person card:**
- Headshot photo (circular, from Drive URL — see image URL helper in Section 8.3)
- Name (`font-heading text-lg`)
- Role (e.g. Club Captain, Treasurer, PRO)
- Short bio (optional, from Sheet)

If no photo URL is provided, show a placeholder with the person's initials on a red background.

Roles to include (populated from Sheet): Club Captain, Women's/Men's Captain, Secretary, Treasurer, PRO (Public Relations Officer), Equipment Officer, Social Secretary, Safety Officer, Fresher's Rep.

#### Coach Section
A highlighted full-width card for the Head Coach. Different visual treatment — larger, with a quote or bio. Current coach: **Dr. Colm Nouvian-Flynn** (data from Sheet, coach can be updated via Sheet).

#### Honorary Members
A simple list (not cards) of honorary members. From `Honorary Members` tab of the Sheet. Columns: Name, Year Awarded, Note.

#### Alumni Captains
A collapsible "Club Captains (2000–present)" section showing the full captains table. Static content hardcoded from Wikipedia — the full table is in Section 9 of the Wikipedia article. Two columns: Year, Club Captain, Women's/Men's Captain. Collapsed by default.

---

### 7.5 Membership Page (`/membership`)

**Fully static — no API calls.**

#### Hero
Heading: `"Join Dublin University Fencing Club"`. Subtext: `"No experience needed. Equipment provided for beginners."`

#### Two-column sign-up options

**Left card — Student Membership:**
- Icon: Trinity crest or graduation cap
- Title: "Trinity Students"
- Description: "Register through Clubforce, the official Trinity Sport membership portal. Annual membership includes full club access, coaching, and kit hire for beginners."
- Button: **"Register via Clubforce"** → opens https://trinityfencing.clubforce.com/products/membership in a new tab
- Note: "You'll need your Trinity student ID to complete registration."

**Right card — External Membership:**
- Icon: fencing mask SVG
- Title: "External Members"
- Description: "Not a Trinity student? We welcome alumni, staff, and external fencers. Contact us to discuss external membership options."
- Button: **"Get in Touch"** → `mailto:dufencing@gmail.com`

#### What to Expect Section
Three icon + text cards:
1. **Beginners Welcome** — "No prior experience is needed. We provide beginner coaching and can lend equipment for your first few sessions."
2. **Training Schedule** — "We train multiple times per week. Check the [Events page](/events) for current training times and locations."
3. **All Three Weapons** — "Members can train in foil, épée, and sabre. Most beginners start with one weapon and branch out over time."

#### FAQ Section
Expandable accordion FAQ. Hard-code the following Q&As (update as needed directly in the code — this content rarely changes):

- *What equipment do I need to start?* — Nothing for your first session. The club lends masks and jackets to beginners. As you progress you'll want to purchase your own kit. See our [Shop page](/shop) for club-branded gear.
- *When and where do training sessions take place?* — Check the [Events calendar](/events) for up-to-date training times. Sessions are held in the Sports Centre on the Trinity campus.
- *I fenced before at another club — can I join?* — Absolutely. Experienced fencers are very welcome. Get in touch via dufencing@gmail.com to discuss.
- *Is there a trial session?* — Yes, you can attend a taster session before committing to membership. Contact us to arrange.
- *What are the membership fees?* — Current fees are listed on the [Clubforce registration page](https://trinityfencing.clubforce.com/products/membership).

---

### 7.6 Shop Page (`/shop`)

**Fully static.**

#### Hero
Heading: `"Club Shop"`. Subtext: `"Official DUFC kit and apparel, powered by McKeever Sports."`

#### Content
A full-width card with the McKeever Sports branding. Explain that club kit is available through the official McKeever club shop and list what's available (tracksuits, hoodies, training tops — generic descriptions; the actual products are on McKeever's site).

**Primary CTA button:** **"Visit the DUFC McKeever Shop"** — this links to the McKeever club shop URL. 

> **Note to builder:** The exact McKeever shop URL for DUFC is not yet confirmed. Use a placeholder URL `https://www.mckeever.com` and add a `TODO` comment. Emma (the site owner) will provide the correct URL before launch. Store this URL as a constant in `/lib/constants.ts` so it is easy to update.

#### Why Buy Club Kit Section
Three short points: wearing club colours at competitions, representing Trinity, and supporting the club financially through kit sales.

---

### 7.7 Friends of DUFC Page (`/friends`)

**Fully static** (Mailchimp embed is a client-side script, not an API call).

#### Hero
Heading: `"Friends of DUFC"`. Subtext: `"Stay connected with the club you helped build."`

#### Alumni Newsletter Section
Two-column layout (text + form).

**Text side:**
- Heading: `"The DUFC Newsletter"`
- Body: "Stay up to date with club news, competition results, and events. We send a newsletter to our alumni and friends community throughout the season."

**Form side:**
- Mailchimp embedded signup form. Inject the Mailchimp embed code here. The embed code will be provided by the site owner from their Mailchimp account. Use a placeholder `{MAILCHIMP_EMBED_CODE}` comment in the template with clear instructions.
- Style the Mailchimp form inputs to match the DUFC design system by wrapping the embed in a container with overriding CSS. Target the standard Mailchimp form classes.

#### Donate / Support the Club Section
`bg-black` dark section.

Heading: `"Support DUFC"` in `text-white`.

Body text: "DUFC is a non-profit student club. Your donations directly fund equipment, competition travel, and hosting the Professor Duffy Memorial Team Épée — one of Ireland's longest-running fencing tournaments. Every contribution makes a difference."

**Donate button:** **"Make a Donation"** — link to a PayPal.me or GoFundMe URL. Use placeholder `{DONATION_URL}` with a TODO comment. Emma will provide the URL.

#### Professor Duffy Memorial Tournament Section
A brief history section highlighting the Prof. Duffy Memorial Team Épée Tournament, inaugurated in 1987 following the death of the club's most decorated coach. Mention that it attracts international teams from Germany, Italy, and the UK. Link to the Events page. This is an important piece of club heritage and a fundraising anchor.

#### Historical Context Box
A subtle `bg-grey-light rounded-lg p-6` box with:

> *"Professor Patrick Duffy coached DUFC from 1952 until his death in 1987, representing Ireland at the 1948 and 1952 Olympic Games. His legacy endures in the annual Professor Duffy Memorial Team Épée Tournament, now in its fourth decade."*

---

## 8. Google Integration Architecture

All Google API calls are made **server-side only** (in Next.js Server Components or `generateStaticParams`/`getStaticProps` equivalents). API credentials are **never** exposed to the browser.

### 8.1 Google Calendar API

**File:** `/lib/google-calendar.ts`

**Authentication:** Use a Google Service Account. The service account's JSON credentials are stored as a Vercel environment variable (`GOOGLE_SERVICE_ACCOUNT_JSON`). The dufencing@gmail.com calendar must be **shared** with the service account email (read-only).

**Public Calendar Alternative:** If sharing with a service account is not feasible, the calendar can be made public (Settings → Share with specific people → Make available to public) and accessed via API key only (`GOOGLE_API_KEY`). This is simpler but less secure. Implement with service account as primary approach, with a comment explaining the public fallback.

**Event Tag Parsing:** Calendar events do not have a native "tag" field. Parse tags from the event in this priority order:
1. Check event `colorId` (Google Calendar event colour) → map to tag
2. Check event `description` field for a line starting with `Tag:` (e.g. `Tag: Competition`)
3. Fall back to `"General"`

Colour-to-tag mapping:
```typescript
const colorTagMap: Record<string, EventTag> = {
  '11': 'Competition', // Tomato
  '9':  'Training',    // Blueberry
  '2':  'Social',      // Sage
  '5':  'Alumni',      // Banana
}
```

Document this colour mapping in the Google Calendar README so the captain knows to use these colours when creating events.

**Return type:**
```typescript
interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  location?: string
  description?: string
  tag: 'Competition' | 'Training' | 'Social' | 'Alumni' | 'General'
  link?: string  // Google Meet URL or first URL in description
}
```

**Function signatures:**
```typescript
export async function getUpcomingEvents(maxResults?: number): Promise<CalendarEvent[]>
export async function getAllEvents(): Promise<CalendarEvent[]>
export async function getPastEvents(maxResults?: number): Promise<CalendarEvent[]>
```

### 8.2 Google Sheets API

**File:** `/lib/google-sheets.ts`

**Authentication:** Same service account as Calendar. The Sheet must be shared with the service account email (viewer role).

**Sheet ID:** Stored as environment variable `GOOGLE_SHEETS_ID`.

The single Google Spreadsheet contains multiple tabs (sheets). Each tab corresponds to a content type.

**Function signatures:**
```typescript
export async function getAchievements(): Promise<Achievement[]>
export async function getCommitteeMembers(): Promise<CommitteeMember[]>
export async function getHonoraryMembers(): Promise<HonoraryMember[]>
export async function getInstagramFeatures(): Promise<InstagramFeature[]>
```

Each function reads a named sheet tab, skips the header row, and maps rows to typed objects.

### 8.3 Google Drive API & Image URL Helper

**File:** `/lib/google-drive.ts`

Google Drive shareable URLs take the form:  
`https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

These cannot be used directly as `<img src>`. Convert to direct image URLs:  
`https://drive.google.com/uc?export=view&id=FILE_ID`

**Helper function:**
```typescript
export function driveUrlToImageSrc(driveUrl: string): string {
  // Accepts both /file/d/ID/view and /uc?id=ID formats
  // Returns https://drive.google.com/uc?export=view&id=FILE_ID
  const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`
  return driveUrl // Return as-is if already in correct format
}
```

For the Gallery page, use the Drive API to list files in a specific folder:
```typescript
export async function getDriveFolderImages(folderId: string): Promise<DriveImage[]>
```

**Important:** Drive direct-link image serving has a daily quota. For a club website with modest traffic this is never an issue, but document it in the README. If traffic ever becomes a concern, images should be migrated to Vercel's `/public` folder or a CDN.

### 8.4 Google Apps Script — Vercel Deploy Hook

This script lives in the Google Spreadsheet (Tools → Script Editor). It watches for edits and triggers a Vercel rebuild.

```javascript
// DUFC Website — Auto-deploy trigger
// Paste your Vercel Deploy Hook URL below
// Get it from: Vercel Dashboard → Project → Settings → Git → Deploy Hooks
const VERCEL_DEPLOY_HOOK = 'https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID_HERE';

function onEdit(e) {
  triggerDeploy();
}

function triggerDeploy() {
  try {
    UrlFetchApp.fetch(VERCEL_DEPLOY_HOOK, { method: 'post' });
    Logger.log('Vercel deploy triggered successfully');
  } catch (err) {
    Logger.log('Deploy trigger failed: ' + err.toString());
  }
}

// You can also run triggerDeploy() manually from the script editor
// to force a rebuild at any time.
```

**Setup instructions** (to be documented in README):
1. Open the DUFC Google Sheet
2. Extensions → Apps Script
3. Paste the script above
4. Replace `YOUR_HOOK_ID_HERE` with the actual deploy hook URL from Vercel
5. Save
6. From the script editor, run `onEdit` once to authorise Google permissions
7. From now on, any edit to the Sheet will trigger a website rebuild (~60 seconds)

---

## 9. Data Schemas

All content is managed through a single Google Spreadsheet shared with the service account. The spreadsheet has the following tabs:

### 9.1 Tab: `Achievements`

| Column | Type | Description | Example |
|---|---|---|---|
| A: `year` | Text | Academic year | `2024/25` |
| B: `date` | Date | Date of the event | `2025-02-15` |
| C: `event_name` | Text | Name of competition | `Intervarsities 2025` |
| D: `level` | Text | Competition level | `Intervarsities` / `National` / `International` |
| E: `weapon` | Text | Weapon category | `Women's Sabre` / `Men's Foil` / `Team Épée` |
| F: `result` | Text | Placement/result | `1st Place` / `Silver Medal` / `Top 8` |
| G: `fencers` | Text | Athlete name(s), comma-separated | `Emma Murphy, Katie Lynch` |
| H: `description` | Text | Free text description of the achievement | Up to 500 chars |
| I: `image_urls` | Text | Comma-separated Google Drive shareable URLs | `https://drive.google.com/...` |
| J: `featured` | Boolean | `TRUE` to show on homepage highlights | `TRUE` / `FALSE` |

**Row 1 is the header row.** Data starts at row 2.  
**Sort:** The website sorts descending by column B (date). The order in the Sheet does not matter.

### 9.2 Tab: `Committee`

| Column | Type | Description | Example |
|---|---|---|---|
| A: `name` | Text | Full name | `Liam Zone` |
| B: `role` | Text | Committee role | `Club Captain` |
| C: `email` | Text | Optional contact email | `lzone@tcd.ie` |
| D: `bio` | Text | Short bio (1–2 sentences) | `Liam has fenced sabre for 4 years...` |
| E: `photo_url` | Text | Google Drive shareable URL for headshot | `https://drive.google.com/...` |
| F: `display_order` | Number | Controls display order (lower = first) | `1` |
| G: `active` | Boolean | `TRUE` to show on site | `TRUE` |

### 9.3 Tab: `Coach`

| Column | Type | Description |
|---|---|---|
| A: `name` | Text | Coach full name |
| B: `title` | Text | e.g. `Head Coach` |
| C: `bio` | Text | Longer bio (up to 300 chars) |
| D: `photo_url` | Text | Google Drive shareable URL |
| E: `qualifications` | Text | e.g. `FIE Level 3 Coach` |

Only one active coach row is expected, but the schema supports multiple.

### 9.4 Tab: `Honorary Members`

| Column | Type | Description |
|---|---|---|
| A: `name` | Text | Full name |
| B: `year_awarded` | Number | Year honorary membership was awarded |
| C: `note` | Text | e.g. `Former Club Captain, National Champion` |

### 9.5 Tab: `Instagram Featured`

| Column | Type | Description |
|---|---|---|
| A: `image_url` | Text | Google Drive shareable URL |
| B: `caption` | Text | Short caption text |
| C: `instagram_link` | Text | Direct link to the Instagram post (optional) |
| D: `display_order` | Number | 1–6, controls grid position |

Maximum 6 rows used on the homepage. Update by replacing rows in this tab.

---

## 10. Mailchimp Integration

The Mailchimp newsletter signup is embedded on the `/friends` page. This is a standard Mailchimp HTML embed, not an API integration.

**How to get the embed code (document in README):**
1. Log into Mailchimp at mailchimp.com with the club account
2. Audience → Signup Forms → Embedded Forms
3. Select "Unstyled" or "Classic" form
4. Copy the embed HTML
5. Paste it into the designated `{MAILCHIMP_EMBED_CODE}` placeholder in `/app/friends/page.tsx`

**Styling override:** Wrap the Mailchimp embed in a `<div className="mailchimp-wrapper">` and add global CSS overrides in `globals.css` to match the form fields to the DUFC design system (red focus rings, DUFC font, border-grey-mid borders).

```css
.mailchimp-wrapper input[type="email"] {
  @apply w-full px-4 py-3 border border-grey-mid rounded-md font-body text-base focus:outline-none focus:ring-2 focus:ring-red;
}
.mailchimp-wrapper input[type="submit"] {
  @apply bg-red text-white px-6 py-3 rounded-md font-body font-medium text-sm uppercase tracking-wide hover:bg-red-dark cursor-pointer transition-colors mt-3;
}
```

---

## 11. Project File & Folder Structure

```
dufc-website/
│
├── README.md                          # Project overview & quick start
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── .env.local.example                 # Template for environment variables
├── .gitignore                         # Include .env.local
│
├── /public
│   ├── /images
│   │   ├── crest.png                  # Club crest (provided by Emma)
│   │   ├── hero.jpg                   # Hero background photo
│   │   ├── about.jpg                  # About section photo
│   │   └── og-image.jpg               # Open Graph / social share image
│   ├── favicon.ico
│   └── robots.txt
│
├── /app                               # Next.js 14 App Router
│   ├── layout.tsx                     # Root layout (Header + Footer)
│   ├── page.tsx                       # Home page (/)
│   ├── globals.css                    # Tailwind base + Mailchimp overrides
│   │
│   ├── /events
│   │   └── page.tsx                   # Events & Calendar
│   │
│   ├── /achievements
│   │   └── page.tsx                   # Achievements Timeline
│   │
│   ├── /members
│   │   └── page.tsx                   # Committee & Members
│   │
│   ├── /membership
│   │   └── page.tsx                   # Join the Club (static)
│   │
│   ├── /shop
│   │   └── page.tsx                   # Club Shop (static)
│   │
│   └── /friends
│       └── page.tsx                   # Friends of DUFC (static + Mailchimp)
│
├── /components
│   ├── /layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   │
│   ├── /ui
│   │   ├── Button.tsx
│   │   ├── Tag.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx                 # Person photo with initials fallback
│   │   ├── Lightbox.tsx               # Image lightbox modal
│   │   └── Accordion.tsx              # FAQ / collapsible sections
│   │
│   ├── /home
│   │   ├── HeroSection.tsx
│   │   ├── StatsStrip.tsx
│   │   ├── AboutSection.tsx
│   │   ├── UpcomingEventsSection.tsx
│   │   ├── LatestAchievementsSection.tsx
│   │   ├── InstagramStrip.tsx
│   │   └── RecruitmentCTA.tsx
│   │
│   ├── /events
│   │   ├── EventCard.tsx
│   │   ├── EventFilterBar.tsx
│   │   └── CalendarEmbed.tsx
│   │
│   ├── /achievements
│   │   ├── AchievementCard.tsx
│   │   ├── YearFilter.tsx
│   │   └── OlympiansSection.tsx
│   │
│   └── /members
│       ├── PersonCard.tsx
│       └── CoachCard.tsx
│
├── /lib
│   ├── google-calendar.ts             # Calendar API wrapper
│   ├── google-sheets.ts               # Sheets API wrapper
│   ├── google-drive.ts                # Drive URL helper
│   ├── google-auth.ts                 # Shared service account auth
│   └── constants.ts                   # McKeever URL, Drive folder IDs, etc.
│
├── /types
│   └── index.ts                       # All shared TypeScript interfaces
│
└── /docs                              # READMEs for content managers
    ├── ADDING_EVENTS.md
    ├── ADDING_ACHIEVEMENTS.md
    ├── UPDATING_COMMITTEE.md
    ├── UPDATING_GALLERY.md
    ├── NEWSLETTER_SETUP.md
    ├── GOOGLE_API_SETUP.md
    └── DEPLOYMENT.md
```

---

## 12. Environment Variables

Store in `.env.local` (never commit to Git). All must also be added to the Vercel project settings under Environment Variables.

```bash
# Google Service Account — the full JSON key file, stringified
# Get from: Google Cloud Console → Service Accounts → Keys → JSON
# Stringify with: JSON.stringify(require('./service-account-key.json'))
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN RSA PRIVATE KEY-----\n...","client_email":"dufc-website@your-project.iam.gserviceaccount.com",...}'

# The ID of the DUFC Google Spreadsheet
# Found in the Sheet URL: docs.google.com/spreadsheets/d/SHEET_ID/edit
GOOGLE_SHEETS_ID=1aBcDeFgHiJkLmNoPqRsTuVwXyZ

# The dufencing@gmail.com Google Calendar ID
# Usually the Gmail address itself for the primary calendar
GOOGLE_CALENDAR_ID=dufencing@gmail.com

# Google Drive folder IDs (get from folder URL)
DRIVE_GALLERY_FOLDER_ID=1aBcDeFgHiJkLmNoPqRsTuVwXyZ
DRIVE_INSTAGRAM_FOLDER_ID=1aBcDeFgHiJkLmNoPqRsTuVwXyZ

# Vercel Deploy Hook URL (from Vercel Dashboard → Settings → Git → Deploy Hooks)
# Paste this into the Google Apps Script (see /docs/GOOGLE_API_SETUP.md)
# This is not used by the Next.js app itself — it's documented here for reference
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID
```

**`.env.local.example`** — commit this file to the repo with all variable names but empty values, so future developers know what's needed.

---

## 13. Deployment Configuration

### `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Drive thumbnails
      },
    ],
  },
}

export default nextConfig
```

### Vercel Configuration

No `vercel.json` is needed. Vercel auto-detects Next.js projects. The only configuration required is:

1. Connect the GitHub repo to Vercel
2. Set environment variables in Vercel Dashboard → Project → Settings → Environment Variables
3. Set the custom domain: `trinityfencing.ie` → Vercel DNS settings
4. Create a Deploy Hook (Settings → Git → Deploy Hooks, name it "Google Sheets Trigger")

### `robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://trinityfencing.ie/sitemap.xml
```

Add a `sitemap.ts` file in `/app` using Next.js's built-in sitemap generation.

### Open Graph / SEO

In `layout.tsx`, define global metadata:

```typescript
export const metadata: Metadata = {
  title: {
    template: '%s | Dublin University Fencing Club',
    default: 'Dublin University Fencing Club',
  },
  description: "Ireland's oldest university fencing club. Founded 1774 at Trinity College Dublin. Foil, épée, and sabre.",
  openGraph: {
    title: 'Dublin University Fencing Club',
    description: "Ireland's oldest university fencing club. Founded 1774.",
    url: 'https://trinityfencing.ie',
    siteName: 'DUFC',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_IE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

Each page should export its own `metadata` object overriding the title and description.

---

## 14. Content Management Workflows

These workflows describe how non-technical club members update the website. Each workflow has a corresponding detailed README in `/docs`.

### 14.1 Adding a New Event

1. Open Google Calendar on dufencing@gmail.com
2. Click the date → "More options"
3. Fill in: Title, Date/Time, Location, Description
4. **Set the event colour** to indicate its type:
   - 🍅 Tomato (red) = Competition
   - 🫐 Blueberry (dark blue) = Training
   - 🌿 Sage (green) = Social
   - 🍌 Banana (yellow) = Alumni
5. Save the event
6. The website automatically updates within 30 minutes (ISR refresh)

> For an immediate update, go to the DUFC Google Sheet → Extensions → Apps Script → Run `triggerDeploy`

### 14.2 Adding an Achievement

1. Open the DUFC Google Sheet → `Achievements` tab
2. Add a new row with all relevant columns filled in
3. For images: upload photos to Google Drive → right-click → "Share" → "Anyone with the link" → copy link → paste into the `image_urls` column (multiple URLs separated by commas)
4. Set `featured` to `TRUE` if this should appear on the homepage
5. Save the Sheet
6. The Apps Script triggers automatically → website rebuilds in ~60 seconds

### 14.3 Updating the Committee

1. Open the DUFC Google Sheet → `Committee` tab
2. Set `active` to `FALSE` for departing members (do not delete rows — this preserves history)
3. Add new rows for incoming committee members
4. For headshots: upload to Google Drive → share publicly → copy link → paste into `photo_url`
5. Set `display_order` (1 = first, 2 = second, etc.) — Club Captain and Women's/Men's Captain should be 1 and 2
6. Save → auto-deploy triggers

### 14.4 Updating Instagram Featured Photos

1. Upload new photos to the `Instagram Featured` Google Drive folder
2. Open the `Instagram Featured` tab in the Google Sheet
3. Replace the `image_url` values with the new Drive links
4. Update `caption` and `instagram_link` fields
5. Save → auto-deploy triggers

### 14.5 Sending the Newsletter (Mailchimp)

This does not affect the website code. The captain logs into Mailchimp and uses the standard Mailchimp campaign tools. New subscribers who sign up via the website form are automatically added to the Mailchimp audience.

---

## 15. README Files to Create

The following README files must be created in `/docs`. They are written for a non-technical reader and should use plain English with numbered steps. Each should open with: *"You do not need to understand the website code to follow these instructions. Everything you need to do is in Google."*

### `/docs/ADDING_EVENTS.md`
How to add, edit, and delete calendar events. Include the colour coding guide with screenshots or emoji representations. Explain how the website automatically picks up changes.

### `/docs/ADDING_ACHIEVEMENTS.md`
How to open the Google Sheet, add a row to the Achievements tab, upload photos to Google Drive and get shareable links, and what each column means. Include example data for every column.

### `/docs/UPDATING_COMMITTEE.md`
How to update the committee at the start of each academic year. Include instructions for uploading headshot photos to Drive and formatting the photo URL. Emphasise setting old members to `active = FALSE` rather than deleting rows.

### `/docs/UPDATING_GALLERY.md`
How to add photos to the Instagram Featured section and general gallery. Explain the folder structure in Google Drive.

### `/docs/NEWSLETTER_SETUP.md`
Where the Mailchimp embed code lives in the codebase, and how to replace it if the Mailchimp form URL changes (e.g. if a new audience is created). Written for someone who may need to ask a developer to make this change.

### `/docs/GOOGLE_API_SETUP.md`
Step-by-step instructions for a developer setting up the Google Cloud project, service account, and API credentials from scratch. Covers: creating a Google Cloud project, enabling Calendar/Sheets/Drive APIs, creating a service account, downloading the JSON key, sharing the Sheet and Calendar with the service account email, and setting up the Apps Script deploy trigger.

### `/docs/DEPLOYMENT.md`
How to deploy the site from scratch: cloning the repo, setting up environment variables locally and on Vercel, connecting the GitHub repo to Vercel, and configuring the custom domain.

### `/README.md` (root)
Project overview, quick start for developers (clone → env vars → `npm run dev`), brief description of the Google-driven content architecture, and links to all docs. Include a "Making Structural Changes" section explaining that non-content changes (new pages, layout changes) require a developer or AI coding agent, and that the `/docs` folder + this design document contain all context needed.

---

## Appendix A: Constants (`/lib/constants.ts`)

```typescript
export const SITE_CONFIG = {
  name: 'Dublin University Fencing Club',
  shortName: 'DUFC',
  tagline: "Ireland's oldest university fencing club. Est. 1774.",
  email: 'dufencing@gmail.com',
  instagramUrl: 'https://www.instagram.com/trinityfencing/',
  instagramHandle: '@trinityfencing',
  fencingIrelandUrl: 'https://irishfencing.net',
  trinitySportUrl: 'https://www.tcd.ie/Sport/',
  clubforceUrl: 'https://trinityfencing.clubforce.com/products/membership',
  // TODO: Replace with actual McKeever DUFC shop URL before launch
  mckeevorShopUrl: 'https://www.mckeever.com',
  // TODO: Replace with actual donation URL (PayPal.me or GoFundMe) before launch
  donationUrl: '#',
  wikipediaUrl: 'https://en.wikipedia.org/wiki/Dublin_University_Fencing_Club',
}

export const GOOGLE_CONFIG = {
  calendarId: process.env.GOOGLE_CALENDAR_ID!,
  sheetsId: process.env.GOOGLE_SHEETS_ID!,
  galleryFolderId: process.env.DRIVE_GALLERY_FOLDER_ID!,
  instagramFolderId: process.env.DRIVE_INSTAGRAM_FOLDER_ID!,
}

// Google Calendar colour ID → event tag mapping
export const CALENDAR_COLOR_TAG_MAP: Record<string, string> = {
  '11': 'Competition',
  '9':  'Training',
  '2':  'Social',
  '5':  'Alumni',
}
```

---

## Appendix B: TypeScript Types (`/types/index.ts`)

```typescript
export type EventTag = 'Competition' | 'Training' | 'Social' | 'Alumni' | 'General'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  location?: string
  description?: string
  tag: EventTag
  link?: string
}

export interface Achievement {
  year: string
  date: string
  eventName: string
  level: string
  weapon: string
  result: string
  fencers: string[]
  description: string
  imageUrls: string[]
  featured: boolean
}

export interface CommitteeMember {
  name: string
  role: string
  email?: string
  bio?: string
  photoUrl?: string
  displayOrder: number
}

export interface Coach {
  name: string
  title: string
  bio: string
  photoUrl?: string
  qualifications?: string
}

export interface HonoraryMember {
  name: string
  yearAwarded: number
  note?: string
}

export interface InstagramFeature {
  imageUrl: string
  caption: string
  instagramLink?: string
  displayOrder: number
}

export interface DriveImage {
  id: string
  name: string
  src: string
  thumbnailSrc: string
}
```

---

*End of Design Document*

*Document version: 1.0 | Created: May 2026 | Club: Dublin University Fencing Club | Contact: dufencing@gmail.com*

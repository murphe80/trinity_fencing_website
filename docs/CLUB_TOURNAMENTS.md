# Club policies and tournaments

The site now has a DUFC crest favicon, a featured-event banner, `/policies`, `/tournaments/poule-tracker`, and `/tournaments/wheel`. These routes use the existing cream, red, black and Garamond design.

## Render setup

1. Keep the existing Google service account environment variable. The results folder `1G1nFs7hbro19OUU2RZbDSlRv_x9gq7i8` was verified against live Drive and is now the default. Set `DRIVE_POULE_RESULTS_FOLDER_ID` only to override it. Policies and photo folder IDs default to the supplied folders and can be overridden with `DRIVE_POLICIES_FOLDER_ID` and `DRIVE_TOURNAMENT_PHOTOS_FOLDER_ID`.
2. Set **GOOGLE_OAUTH_CLIENT_JSON** on the Render website service to the complete downloaded OAuth web-client JSON. Keep it secret. Register the exact deployed callback URL in the Google Cloud OAuth client: `https://www.trinityfencing.ie/api/auth/google/callback`. Local callbacks are `http://localhost:3000/api/auth/google/callback` and `http://127.0.0.1:3000/api/auth/google/callback`. Enable the Google Drive API in that project.
3. Give each organiser’s Google account **Editor** access to both results folders, or sign in using the club account. The service account still needs Viewer access to read the uploaded results. Fencers do not enter IDs, secrets or organiser keys.
4. Deploy and try a completed poule using **Connect Google to save results**. Approve Google’s permission screen, return to the recovered draft, then select **Save results to Drive**. Downloading results remains available without Google sign-in.

### Google sign-in

Each browser connects its own Google account. Uploads use that account’s storage and existing folder permissions. The server verifies the destination folder and permission before each upload; it never uses the service account or a shared club token for writing. Google’s full Drive scope is requested to access this pre-existing folder without a separate Google Picker step. The consent screen therefore describes broad Drive access, although this application only creates results in the configured folder. Complete any Google verification requirements for this scope before a public rollout.

The OAuth secret stays on the server. Tokens are stored in an encrypted, HttpOnly, SameSite cookie, marked Secure on HTTPS; JavaScript cannot read them. The encryption key is derived from the OAuth client secret, so no separate organiser/session secret is required. Connections last up to 30 days in this browser. Short-lived access tokens refresh automatically; revoked or expired connections prompt reconnection. Disconnect Google clears the browser connection; Google Account settings can revoke the grant itself. Rotating the OAuth client secret invalidates browser connections. OAuth uses a short-lived state cookie, PKCE and registered callback validation; uploads and disconnects require a matching Origin.

The Saturday cutoff works automatically when the league is visited. A Render cron is **optional** cache warming, and ordinary committee use requires no cron secret. If desired, use `render-wheel.yaml`, set `SITE_URL` and a private `CRON_SECRET` on the job and web service, and run `node scripts/refresh-wheel.mjs` at `0 9,10 * * 6`. The Dublin-time guard handles daylight saving.

The application creates matching PDF and JSON result revisions. Saving the same poule again writes a new dated revision, and the league selects only its latest eligible revision. Earlier revisions preserve the published scores when a correction is made after the cutoff. It does not modify permissions or unrelated files. Keep a backup before starting a new poule. The latest save wins if multiple organisers edit the same poule; coordinate score entry on one device.

## Featured calendar events

Include the standalone word `Featured` anywhere in the event description (case-insensitive). The closest future start is shown under the home-page navigation. The query is separate from the three-event preview, traverses Calendar pagination, and supports recurring instances. The banner is absent when no future event qualifies. The home page revalidates after 60 seconds; while open, the banner checks once a minute to move past an expired event. Event times display in Europe/Dublin.

## Policies

Add, rename, update or remove files directly in the configured policies folder. The page lists the current immediate children; there is no fixed policy list. Use descriptive filenames such as “Code of Conduct” or “Anti-Doping Policy”. Google Docs are served as PDFs, PDFs open directly, and other files download. Shortcuts and subfolders are not supported. The server verifies folder membership before serving any file; visitors do not need a Google login. Files in this folder are therefore intended for public website distribution. Refreshing the page reads current metadata; downloads cache for at most 60 seconds.

## Poule tracker

Enter 2–20 unique full names, a weapon and date. The tracker uses round-robin scheduling so every pair fences once, with rotating rounds to spread bouts across participants. This is club scheduling, not an official FIE bout-order claim. Score each bout from 0–5; timed bouts may finish below five, but ties must be resolved. Drafts, including scores and names, stay in this browser until replaced or cleared. Download completed results as a PDF containing the bout list, scores and poule grid. Saving to Drive creates both that PDF and a machine-readable JSON revision; the tournament reads only JSON. Incomplete or tied bouts must be resolved before downloading. The tracker automatically recovers the current draft from the same browser. Print sheet includes only the numbered person-vs-person bout list and poule grid, including current scores or blank cells. The grid prints even when its screen disclosure is closed.

Poule ranks use victory ratio, indicator, then touches scored. Exactly tied leaders share the poule win. League ranks use only cumulative indicator, as requested; alphabetical display order does not break equal ranks. The fun prize does not affect league points.

Tick “Count towards The Wheel Tournament” to include a result in the league. Wheel prize and winner entry is not part of the poule tracker. Saving requires a complete valid poule and a connected Google account with permission to upload to the results folder. The server recalculates all totals from the bouts; client-supplied totals are never trusted. Files are named `YYYY-MM-DD_weapon_poule-id_saved-at.json`. Saving the current draft again creates a revision with the same poule ID; new poules get new IDs. Revisions are not counted as additional poules.

## The Wheel Tournament

The season begins Friday **18 September 2026**, spans 12 weeks and ends with Friday **4 December 2026**. Its final scheduled publication is Saturday **5 December**. The season is currently defined in `lib/tournament.ts`; change the season dates there for a later tournament.

Every Saturday at **10:00 Europe/Dublin**, completed Wheel poules saved before the cutoff enter the league and weekly archive. The publication is cached for that weekly cutoff and the scheduled job warms it. A first visit after the cutoff also generates it if the cron was delayed. Open league pages check each minute for the new publication. Corrections saved after the cutoff appear at the following publication. Any eligible result date in a season week contributes; non-Wheel poules do not. Multiple poules per weapon/week each have a weekly winners card.

Place participant PNGs directly in the photo folder as `firstname_lastname.png`, matching the full name used in poules (spaces become underscores, case ignored). Keep spelling consistent; different people with the same name need distinct full names and corresponding filenames. Initials are shown when a photo is missing. The on-page wheel is decorative and does not choose or record the real prize.

## Local development and checks

Set `GOOGLE_APPLICATION_CREDENTIALS` in the git-ignored `.env.local` file to the absolute path of your service-account JSON key, then run `npm run dev`. The key stays outside the repository. Render can keep using `GOOGLE_SERVICE_ACCOUNT_JSON`. The site always reads real sources: sample events, league fixtures and Instagram placeholder tiles have been removed. Empty or unavailable data is shown honestly.

Run `node --import tsx scripts/check-live-site.ts` to exercise the actual Drive and Calendar readers, or `node scripts/check-live-drive.mjs /absolute/path/to/key.json` to inspect the configured club folders. These scripts never print keys or tokens and do not create or modify Drive files.

For local upload testing, set `GOOGLE_OAUTH_CLIENT_FILE` in `.env.local` to the downloaded OAuth client JSON path. A real Google sign-in is required for a live write test; the service-account read checks do not prove uploads work.

Run `npm run test:tournaments`, `npx tsc --noEmit`, and `npm run build`. Manual uploads use the later of the export timestamp and Drive creation timestamp for publication eligibility; a file uploaded after Saturday's cutoff is not published early.

## Personal Gmail and OAuth token lifetime

Direct uploads to personal Gmail's My Drive require user OAuth. A service account cannot own the new files, even when folder capabilities report that it can add children. Create a **Web application** OAuth client in the existing Cloud project: its client ID and client secret are one-time website configuration, not values fencers should type.

Access tokens are short-lived and Google libraries refresh them automatically using a refresh token. Request offline access. An External consent screen left in **Testing** issues Drive refresh tokens that expire after seven days. Moving to **In production**, meeting applicable consent/verification requirements, and obtaining fresh consent avoids that testing limit. No setting makes a refresh token immortal: revocation, prolonged inactivity, token limits and Google security policies can invalidate it. A user-facing “Reconnect Google” action is the appropriate recovery flow. See [Google's OAuth documentation](https://developers.google.com/identity/protocols/oauth2) and [web-server authorisation guide](https://developers.google.com/identity/protocols/oauth2/web-server).

The existing weekly cutoff also works on the first visit after Saturday 10am. The Render cron is optional cache warming; the committee does not need a cron secret for this request-driven publication mode.

[Render cron jobs use UTC](https://render.com/docs/cronjobs); the two UTC runs and Dublin-time guard keep the user-visible schedule stable through daylight saving.

## Separate result folders

- Human-readable PDFs: `1jUq8aNtnFqPnrrgABF2lBU1EmVXQUpln` (`DRIVE_POULE_PDF_FOLDER_ID`).
- JSON used by the tournament: `1G1nFs7hbro19OUU2RZbDSlRv_x9gq7i8` (`DRIVE_POULE_RESULTS_FOLDER_ID`).

These are the new defaults. **Update any existing Render override of DRIVE_POULE_RESULTS_FOLDER_ID** to the new JSON folder; an old environment value takes precedence over the default. The service account needs Viewer access to the JSON folder. Organisers need Editor access to both folders. The OAuth client JSON remains unchanged.

Each save checks both folders first, then uploads PDF followed by JSON, with the same dated revision basename. If the PDF fails, JSON is not published. If JSON fails, the page reports the partial save and retains the draft. Retry may leave an additional PDF; league revision selection prevents duplicate counting. Google Drive does not offer an atomic two-file upload.

The download action generates the PDF on the website server and requires no Google connection. Printing remains the bout list and grid. Downloaded PDFs are for people; only saved JSON updates league results.

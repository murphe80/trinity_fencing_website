# Club policies and tournaments

The site now has a DUFC crest favicon, a featured-event banner, `/policies`, `/tournaments/poule-tracker`, and `/tournaments/wheel`. These routes use the existing cream, red, black and Garamond design.

## Hosting setup (Render or Vercel)

1. Keep `GOOGLE_SERVICE_ACCOUNT_JSON` configured. The service account reads club sources; it never owns or writes uploads. It needs Viewer access to the JSON folder.
2. Set `GOOGLE_OAUTH_CLIENT_JSON` to the downloaded OAuth **web-client** JSON. Register the exact website callback, for example `https://www.trinityfencing.ie/api/auth/google/callback`. Local callbacks are `http://localhost:3000/api/auth/google/callback` and `http://127.0.0.1:3000/api/auth/google/callback`. Enable Drive API. Keep the OAuth app External / In production so public Google accounts can connect, subject to Google account restrictions.
3. For organiser folder selection, enable **Google Picker API** in the same project. Set `GOOGLE_PICKER_API_KEY` and `GOOGLE_CLOUD_PROJECT_NUMBER` (the numeric project number in Google Cloud project settings). Restrict the browser key to Google Picker API and website referrers `https://www.trinityfencing.ie/*`, `https://docs.google.com/*`, and actual additional site origins. Add localhost origins for local tests. See [Google’s Picker setup guide](https://developers.google.com/workspace/drive/picker/guides/web-picker).
4. The club folders now have public editing access; Google must report that the connected account can add files. No website allowlist or organiser key is required; Google’s folder permissions are checked on every save.
5. Declare only `https://www.googleapis.com/auth/drive.file` on the **user OAuth consent screen**. Remove broad Drive, Calendar and Sheets scopes from that screen; retain the service account’s separate read-only scopes and enabled APIs. Existing broad-scope connections must reconnect. If Google returns an old combined grant, remove the app in Google Account connections and reconnect.

PDF folder: `1jUq8aNtnFqPnrrgABF2lBU1EmVXQUpln` (`DRIVE_POULE_PDF_FOLDER_ID`). Approved JSON folder: `1G1nFs7hbro19OUU2RZbDSlRv_x9gq7i8` (`DRIVE_POULE_RESULTS_FOLDER_ID`). These are defaults; update any old environment overrides. The league reads **only this JSON folder**.

### Direct upload workflow

Complete a poule, download a PDF or connect Google and select **Save results to Drive**. On first use, Google Picker asks you to select both club folders. The app checks Editor access, creates the PDF in the human-readable folder, then creates matching JSON in the tournament folder. There is no review queue or approval step. Monitor and manage results directly in Drive. Folders are not made public and their permissions are not changed.

Uploads use the signed-in account’s storage. A failed JSON upload may leave a PDF copy; retrying saves another revision. Re-saving the same poule preserves its ID so the league counts only the latest eligible revision. Existing pending files from the former review workflow are not automatically imported or deleted.

### Google connection security and lifetime

The OAuth secret stays server-side. Access and refresh tokens are stored in an encrypted, HttpOnly, SameSite cookie, Secure on HTTPS, for up to 30 days. Tokens refresh automatically when used. Only a short-lived access token is passed to Picker in browser memory for organiser folder selection. Refresh tokens are not exposed to JavaScript or local storage. OAuth uses PKCE, encrypted state and exact registered callbacks. Mutations require a matching Origin. No token can be guaranteed never to expire: revocation and Google security policies may require reconnecting. Disconnect clears the browser connection; Google Account connections can revoke the grant. Rotating the client secret invalidates browser sessions.

The Saturday cutoff works on the first league visit after 10am Dublin. Cron is optional cache warming; ordinary use needs no `CRON_SECRET` or `TOURNAMENT_ADMIN_KEY`. For optional Render scheduling see `render-wheel.yaml` and `scripts/refresh-wheel.mjs`.

## Featured calendar events

Include the standalone word `Featured` anywhere in the event description (case-insensitive). The closest future start is shown under the home-page navigation. The query is separate from the three-event preview, traverses Calendar pagination, and supports recurring instances. The banner is absent when no future event qualifies. The home page revalidates after 60 seconds; while open, the banner checks once a minute to move past an expired event. Event times display in Europe/Dublin.

## Policies

Add, rename, update or remove files directly in the configured policies folder. The page lists the current immediate children; there is no fixed policy list. Use descriptive filenames such as “Code of Conduct” or “Anti-Doping Policy”. Google Docs are served as PDFs, PDFs open directly, and other files download. Shortcuts and subfolders are not supported. The server verifies folder membership before serving any file; visitors do not need a Google login. Files in this folder are therefore intended for public website distribution. Refreshing the page reads current metadata; downloads cache for at most 60 seconds.

## Poule tracker

Enter 2–20 unique full names, a weapon and date. The tracker uses round-robin scheduling so every pair fences once, with rotating rounds to spread bouts across participants. This is club scheduling, not an official FIE bout-order claim. Score each bout from 0–5; timed bouts may finish below five, but ties must be resolved. Drafts, including scores and names, stay in this browser until replaced or cleared. Download completed results as a PDF containing the bout list, scores and poule grid. Submitting creates both that PDF and a machine-readable JSON for review; only organiser-JSON in the club folder contributes to the tournament. Incomplete or tied bouts must be resolved before downloading. The tracker automatically recovers the current draft from the same browser. Print sheet includes only the numbered person-vs-person bout list and poule grid, including current scores or blank cells. The grid prints even when its screen disclosure is closed.

Poule ranks use victory ratio, indicator, then touches scored. Exactly tied leaders share the poule win. League ranks use only cumulative indicator, as requested; alphabetical display order does not break equal ranks. The fun prize does not affect league points.

Tick “Count towards The Wheel Tournament” to include eligible saved results. Wheel prize and winner entry is not part of the tracker, and upload processing clears this legacy metadata. Submission requires a complete valid poule and a connected Google account. Totals are recalculated from bouts. Files include the date and weapon in their names.

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

## Verification

Automated tests cover narrow OAuth scopes, cookie/origin checks, folder selection, direct PDF/JSON uploads, partial failures and league publication. Google API calls are mocked in upload tests. A real upload check requires Google consent and Editor access to both destination folders. Service-account read checks alone do not verify uploads or Picker.

## Save destinations

Fencers choose **My personal Google Drive**, **Club results folders**, or **Both**. Personal saves create PDF and JSON in the signed-in account’s My Drive with no club sharing or Picker requirement. Club saves use the two configured folders and Picker with `drive.file`. Both creates four files: a personal pair first, then a club pair. Club access is checked before starting; partial failures state what completed. Only club JSON contributes to the league. Destination selection survives Google sign-in and changing it resets the current save confirmation.

The club has enabled public editing on its results folders, so a separate invitation should not be necessary when Google recognises those permissions. The server still checks Google’s `canAddChildren` capability. Sign-in and Picker remain necessary for file-specific OAuth authorisation. The upload page discloses public access before club saves. The website does not change sharing permissions.

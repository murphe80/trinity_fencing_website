# Google API Setup

This guide is for developers setting up the Google API credentials from scratch.

> **Authentication choice:** Use a **Google Service Account** for the website. The site only needs server-side, read-only access to club-owned Calendar, Sheets, and Drive content, so a service account avoids user OAuth refresh tokens expiring.

---

## Prerequisites

- Access to the Google Cloud Console for the existing project
- Access to dufencing@gmail.com
- Permission to create a service account in the Google Cloud project

---

## Step 1 — Enable the Required APIs

In [Google Cloud Console](https://console.cloud.google.com):

1. Navigate to **APIs & Services → Library**
2. Enable the following APIs:
   - **Google Calendar API**
   - **Google Sheets API**
   - **Google Drive API**

---

## Step 2 — Create a Service Account

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → Service account**
3. Give it a clear name, for example `dufc-website`
4. After it is created, open the service account and go to **Keys**
5. Click **Add key → Create new key → JSON**
6. Download the JSON file and keep it private
7. Copy the service account email. It looks like:
   ```text
   dufc-website@your-project-id.iam.gserviceaccount.com
   ```

Do not commit this JSON file to Git.

---

## Step 3 — Share Google Resources with the Service Account

The service account is a separate identity. It cannot read dufencing@gmail.com content until each resource is shared with its service account email.

### Calendar

1. Open Google Calendar as `dufencing@gmail.com`
2. Go to **Settings → Settings for my calendars → dufencing@gmail.com**
3. Under **Share with specific people or groups**, add the service account email
4. Give it **See all event details** access

### Google Sheet

1. Open the DUFC Google Sheet
2. Click **Share**
3. Add the service account email with **Viewer** access

### Drive folders and images

For any private Drive folders or images used by the site:

1. Open the folder or file in Drive
2. Click **Share**
3. Add the service account email with **Viewer** access

---

## Step 4 — Set Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"dufc-website@your-project-id.iam.gserviceaccount.com",...}'
GOOGLE_SHEETS_ID=the-spreadsheet-id-from-the-sheet-url
GOOGLE_CALENDAR_ID=dufencing@gmail.com
DRIVE_GALLERY_FOLDER_ID=folder-id-from-drive-url
DRIVE_INSTAGRAM_FOLDER_ID=folder-id-from-drive-url
```

**Finding IDs:**
- Sheet ID: from the URL `docs.google.com/spreadsheets/d/**SHEET_ID**/edit`
- Drive folder ID: from the URL `drive.google.com/drive/folders/**FOLDER_ID**`

The old OAuth variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`) still work as a fallback, but they are no longer the recommended production setup.

---

## Step 5 — Set Up the Google Sheet

Create a Google Spreadsheet and create the following tabs (exact names matter):
- `Achievements`
- `Committee`
- `Coach`
- `Honorary Members`
- `Instagram Featured`

Populate each tab with the column structure described in the design document (`DUFC_Website_Design_Document.md`, Section 9).

---

## Step 6 — Set Up the Apps Script Deploy Trigger

1. Open the DUFC Google Sheet
2. Click **Extensions → Apps Script**
3. Paste the following script:

```javascript
const VERCEL_DEPLOY_HOOK = 'YOUR_VERCEL_DEPLOY_HOOK_URL';

function onEdit(e) {
  triggerDeploy();
}

function triggerDeploy() {
  try {
    UrlFetchApp.fetch(VERCEL_DEPLOY_HOOK, { method: 'post' });
    Logger.log('Vercel deploy triggered');
  } catch (err) {
    Logger.log('Deploy trigger failed: ' + err);
  }
}
```

4. Replace `YOUR_VERCEL_DEPLOY_HOOK_URL` with the URL from Vercel → Project → Settings → Git → Deploy Hooks
5. Click **Save**
6. Run `onEdit` once manually to authorise Google permissions

---

## Step 7 — Add Credentials to Vercel

In the Vercel dashboard → Project → Settings → Environment Variables, add all variables from your `.env.local` file. These are required for the production build to work.

For `GOOGLE_SERVICE_ACCOUNT_JSON`, paste the full JSON as a single environment variable value. If Vercel preserves `\n` escapes in the private key, the app will normalise them at runtime.

---

## Implementing the Google API Calls

The lib files in `/lib/` contain the Google API calls. Once credentials are configured:

1. `getGoogleAuthClient()` in `/lib/google-auth.ts` reads `GOOGLE_SERVICE_ACCOUNT_JSON`
2. `/lib/google-calendar.ts` reads events from Google Calendar
3. `/lib/google-sheets.ts` reads committee, achievements, coach, honorary members, and featured Instagram rows
4. `/lib/google-drive.ts` reads shared Drive image folders

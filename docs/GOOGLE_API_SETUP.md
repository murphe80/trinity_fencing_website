# Google API Setup

This guide is for developers setting up the Google API credentials from scratch.

> **Note on authentication:** This project uses **Google OAuth** credentials rather than a Service Account. Emma has an existing Google Cloud project with OAuth credentials configured.

---

## Prerequisites

- Access to the Google Cloud Console for the existing project
- Access to dufencing@gmail.com

---

## Step 1 — Enable the Required APIs

In [Google Cloud Console](https://console.cloud.google.com):

1. Navigate to **APIs & Services → Library**
2. Enable the following APIs:
   - **Google Calendar API**
   - **Google Sheets API**
   - **Google Drive API**

---

## Step 2 — Get OAuth Credentials

The project uses OAuth 2.0 with a refresh token (offline access) so the server can make API calls without user interaction.

1. Go to **APIs & Services → Credentials**
2. Find or create an **OAuth 2.0 Client ID** (type: Web application or Desktop)
3. Note the **Client ID** and **Client Secret**

### Getting a Refresh Token

To get a refresh token for dufencing@gmail.com:

1. Use the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) or a local script
2. Authorise these scopes:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/spreadsheets.readonly`
   - `https://www.googleapis.com/auth/drive.readonly`
3. Exchange the authorisation code for tokens
4. Save the **refresh token** — this does not expire unless access is revoked

---

## Step 3 — Share Resources with the OAuth Account

Since the OAuth credentials are for dufencing@gmail.com itself, the account already has access to its own Calendar and Drive. For the Google Sheet:

1. Open the DUFC Google Sheet
2. Click **Share**
3. Ensure dufencing@gmail.com has at least **Viewer** access

---

## Step 4 — Set Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_SHEETS_ID=the-spreadsheet-id-from-the-sheet-url
GOOGLE_CALENDAR_ID=dufencing@gmail.com
DRIVE_GALLERY_FOLDER_ID=folder-id-from-drive-url
DRIVE_INSTAGRAM_FOLDER_ID=folder-id-from-drive-url
```

**Finding IDs:**
- Sheet ID: from the URL `docs.google.com/spreadsheets/d/**SHEET_ID**/edit`
- Drive folder ID: from the URL `drive.google.com/drive/folders/**FOLDER_ID**`

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

---

## Implementing the Google API Calls

The lib files in `/lib/` contain stub functions with `// TODO` comments marking where the real API calls should go. Once credentials are configured:

1. Implement `getGoogleAuthClient()` in `/lib/google-auth.ts` — done
2. Replace mock data in `/lib/google-calendar.ts` with real Calendar API calls
3. Replace mock data in `/lib/google-sheets.ts` with real Sheets API calls
4. Implement `getDriveFolderImages()` in `/lib/google-drive.ts`

Each function has the correct TypeScript signature and comments explaining the intended implementation. The mock data is structured identically to real data, so the UI will work unchanged once the API calls are swapped in.

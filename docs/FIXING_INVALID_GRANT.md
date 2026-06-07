# Fixing "invalid_grant" Error

## Problem

You're seeing this error in build logs or when data isn't displaying:
```
Failed to fetch ... invalid_grant
```

This means your Google OAuth **refresh token has expired**.

## Why This Happens

Google refresh tokens can expire due to:
- Token hasn't been used in 6+ months
- OAuth consent screen configuration changed
- Credentials were regenerated
- Too many tokens issued for same client

## How to Fix

### Option 1: Use the Automated Script (Recommended)

1. **Run the token refresh script:**
   ```bash
   node scripts/refresh-google-token.js
   ```

2. **Follow the prompts:**
   - It will show you a Google authorization URL
   - Open the URL in your browser
   - Log in with `dufencing@gmail.com`
   - Grant all permissions
   - Copy the authorization code from the redirect URL
   - Paste it back into the terminal

3. **The script will:**
   - Generate a new refresh token
   - Optionally update your `.env.local` file
   - Show you what to add to Vercel

### Option 2: Manual OAuth Playground Method

1. **Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)**

2. **Click the gear icon (⚙️) in top right** and:
   - Check "Use your own OAuth credentials"
   - Enter your `GOOGLE_CLIENT_ID`
   - Enter your `GOOGLE_CLIENT_SECRET`

3. **In "Step 1 - Select & authorize APIs":**
   - Scroll down or search for these scopes:
     - `https://www.googleapis.com/auth/calendar.readonly`
     - `https://www.googleapis.com/auth/spreadsheets.readonly`
     - `https://www.googleapis.com/auth/drive.readonly`
   - Click "Authorize APIs"
   - Log in with `dufencing@gmail.com`
   - Grant all permissions

4. **In "Step 2 - Exchange authorization code for tokens":**
   - Click "Exchange authorization code for tokens"
   - Copy the **Refresh token** (not the access token!)

5. **Update your environment variables:**
   
   Local (`.env.local`):
   ```bash
   GOOGLE_REFRESH_TOKEN=1//04new-refresh-token-here
   ```
   
   Vercel:
   - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `GOOGLE_REFRESH_TOKEN` with the new value
   - Redeploy

### Option 3: Check OAuth Consent Screen

If you're still getting `invalid_grant` after refreshing:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services → OAuth consent screen**
3. Make sure:
   - Publishing status is **"In Production"** or **"Testing"** with your email added
   - All required scopes are listed
   - Test users include `dufencing@gmail.com` (if in Testing mode)

## After Fixing

1. **Test locally:**
   ```bash
   npm run build
   ```
   You should NOT see any `invalid_grant` errors

2. **Deploy to Vercel:**
   - Make sure the new `GOOGLE_REFRESH_TOKEN` is set in Vercel environment variables
   - Trigger a new deployment (push to git or manual redeploy)

3. **Verify the fix:**
   - Visit your live site
   - Check that Achievements, Members, and Events pages show data
   - Calendar events should appear as cards, not just the iframe

## Prevention

To prevent this from happening again:

- **Keep the site active** - the token stays valid as long as it's being used regularly
- **Don't revoke access** at https://myaccount.google.com/permissions
- **Monitor build logs** for `invalid_grant` warnings

## Troubleshooting

**"No refresh token received"**
- The OAuth app may have already been authorized
- Revoke access at: https://myaccount.google.com/permissions
- Run the script again with `prompt: 'consent'` to force re-authorization

**"Redirect URI mismatch"**
- Go to Google Cloud Console → APIs & Services → Credentials
- Edit your OAuth 2.0 Client ID
- Add `http://localhost` to Authorized redirect URIs
- Wait a few minutes for changes to propagate

**"Access blocked: Authorization Error"**
- Your OAuth consent screen might be in Review
- Check Google Cloud Console → APIs & Services → OAuth consent screen
- Either publish the app or add test users

## Need Help?

If you're still stuck:
1. Check build logs for specific error messages
2. Verify all environment variables are set correctly
3. Make sure the Google Calendar, Sheets, and Drive APIs are enabled
4. Confirm `dufencing@gmail.com` has access to the Sheet and Calendar

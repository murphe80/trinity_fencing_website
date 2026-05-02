# Updating the Instagram Featured Photos

> You do not need to understand the website code to follow these instructions. Everything you need to do is in Google Drive and the Google Sheet.

The homepage shows a grid of 6 featured photos that link to the club's Instagram. These are managed manually through Google Drive and the **Instagram Featured** tab of the DUFC Google Sheet.

---

## How to Update the Featured Photos

### Step 1 — Upload new photos to Google Drive

1. Open **Google Drive** (drive.google.com, signed in as dufencing@gmail.com)
2. Navigate to the **Instagram Featured** folder (create it if it doesn't exist — ask a developer to update the folder ID)
3. Upload your new photos

### Step 2 — Make the photos publicly accessible

For each new photo:
1. Right-click the photo → **Share**
2. Under "General access", change "Restricted" to **"Anyone with the link"**
3. Click **Copy link**
4. Keep this link — you'll need it in step 3

### Step 3 — Update the Google Sheet

1. Open the **DUFC Google Sheet → Instagram Featured tab**
2. You'll see 6 rows (positions 1–6). Update each row:
   - **A — image_url**: Paste the Google Drive shareable link from step 2
   - **B — caption**: A short caption for the photo (shows on hover)
   - **C — instagram_link**: Optional — the direct link to the Instagram post (e.g. `https://www.instagram.com/p/XXXXXX/`)
   - **D — display_order**: A number 1–6 controlling the grid position (1 = top-left)
3. Save the sheet (it saves automatically)

The website will rebuild automatically in approximately 60 seconds.

---

## Tips

- **Square photos look best** — the grid uses square cells, so portrait or landscape photos will be cropped. Instagram photos are already square by default.
- **File size** — Google Drive can serve large files but smaller images (under 2MB) will load faster for website visitors.
- **Captions** — Keep them short (under 80 characters). They only appear when a user hovers over the photo on desktop.
- **Max 6 photos** — Only the first 6 rows (by display_order) are shown on the homepage. You can have more rows in the sheet but only 6 will appear.

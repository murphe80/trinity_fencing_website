# Adding Achievements to the DUFC Website

> You do not need to understand the website code to follow these instructions. Everything you need to do is in the Google Sheet.

Achievements are stored in the **DUFC Google Sheet**, in the tab called **Achievements**. Adding a row to this sheet automatically triggers a website rebuild.

---

## How to Add an Achievement

1. Open the **DUFC Google Sheet** (find it in your Google Drive)
2. Click the **Achievements** tab at the bottom
3. Scroll to the first empty row below the existing data
4. Fill in each column (see the column guide below)
5. Press **Enter** or click another cell to save
6. The website will rebuild automatically in approximately 60 seconds

---

## Column Guide

| Column | What to enter | Example |
|---|---|---|
| **A — year** | Academic year in `YYYY/YY` format | `2024/25` |
| **B — date** | Date of the event in `YYYY-MM-DD` format | `2025-02-15` |
| **C — event_name** | Full name of the competition | `Intervarsities 2025` |
| **D — level** | Competition level | `Intervarsities` / `National` / `International` |
| **E — weapon** | Weapon and category | `Women's Sabre` / `Men's Foil` / `Team Épée` |
| **F — result** | Placement or result | `1st Place` / `Silver Medal` / `Top 8` |
| **G — fencers** | Name(s) of the fencer(s), comma-separated | `Emma Murphy, Katie Lynch` |
| **H — description** | A short description (up to 500 characters) | `DUFC Women's Sabre team took gold at...` |
| **I — image_urls** | Google Drive links to photos (comma-separated for multiple) | `https://drive.google.com/file/d/...` |
| **J — featured** | `TRUE` to show this on the homepage, `FALSE` otherwise | `TRUE` |

---

## Adding Photos to an Achievement

1. Upload the photo(s) to **Google Drive**
2. Right-click the photo → **Share** → change "Restricted" to **"Anyone with the link"**
3. Click **Copy link**
4. Paste the link(s) into column **I** of the achievement row
5. For multiple photos, separate them with a comma: `https://drive.google.com/..., https://drive.google.com/...`

Photos appear as thumbnails on the achievements page and can be clicked to open a full-size view.

---

## Example Row

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| 2024/25 | 2025-02-15 | Intervarsities 2025 | Intervarsities | Women's Sabre | 1st Place | Emma Murphy, Katie Lynch | DUFC Women's Sabre took gold... | https://drive.google.com/... | TRUE |

---

## Notes

- **Do not delete old rows** — the full history of achievements is kept in the sheet. Old entries are archived and can be filtered by year on the website.
- **The order in the sheet doesn't matter** — the website sorts by date automatically.
- **The `featured` column controls the homepage** — only achievements with `TRUE` in column J appear in the "Recent Highlights" section on the homepage. Limit to 3–5 featured achievements at a time.

# Adding Events to the DUFC Website

> You do not need to understand the website code to follow these instructions. Everything you need to do is in Google Calendar.

The website automatically reads events from the **dufencing@gmail.com Google Calendar**. Any event you add there will appear on the website within 30 minutes.

---

## How to Add an Event

1. Open [Google Calendar](https://calendar.google.com) and sign in as **dufencing@gmail.com**
2. Click the date of your event → click **"More options"** (not just "Save")
3. Fill in the following fields:
   - **Title** — e.g. `Intervarsities 2025`
   - **Date and time** — set the correct start and end times
   - **Location** — e.g. `UCD Sports Centre, Dublin` *(shows on the website)*
   - **Description** — a short summary of the event *(first 150 characters show on the website)*
     - **To add a clickable link:**
       1. Type your link text (e.g., "Register here")
       2. Highlight the text
       3. Click the link icon (🔗) in the description toolbar
       4. Paste your URL and click OK
     - You can also use plain URLs: `https://example.com`
     - Links will be automatically clickable on the website
     - Line breaks are supported and will display correctly
4. **Set the event label** to indicate the type (see label guide below)
5. Click **Save**

The website will update automatically within 30 minutes. For an immediate update, see the section below.

---

## Event Label Guide

The label you choose determines the tag shown on the website:

| Calendar Label | Tag Shown | Use For |
|---|---|---|
| `competition` | **Competition** | Intervarsities, national competitions, tournaments |
| `training` | **Training** | Regular weekly training sessions |
| `social` | **Social** | Club socials, non-competitive events |
| `alumni` | **Alumni** | Alumni days, reunion events |
| *(no matching label)* | General | Miscellaneous |

To set the label: when editing an event, choose the matching event label. The label names should be lowercase exactly as shown above. The label colours in Google Calendar can still match the old colour guide, but the website reads the label name, not the colour.

---

## How to Edit or Delete an Event

- **Edit:** Click the event in Google Calendar → click the pencil icon → make your changes → Save
- **Delete:** Click the event → click the bin icon

Changes appear on the website within 30 minutes.

---

## Forcing an Immediate Update

If you need the website to update right away (e.g. before a competition):

1. Open the [DUFC Google Sheet](https://docs.google.com/spreadsheets) in your Drive
2. Click **Extensions → Apps Script**
3. In the script editor, click **Run** next to the `triggerDeploy` function
4. The website will rebuild in approximately 60 seconds

---

## Troubleshooting

- **The event isn't showing up** — Check that the event is in the future and that the dufencing@gmail.com calendar is the one shown (not a personal calendar). Wait 30 minutes for the automatic refresh.
- **The tag shows "General" instead of "Competition"** — Make sure the event has the `competition` label, and that the label name is spelled exactly as shown in the guide.

# Link Support in Event Descriptions

## Overview

Event descriptions now support clickable links in three formats:

1. **HTML links**: `<a href="https://example.com">Link text</a>` (Google Calendar's default)
2. **Markdown-style links**: `[Link text](https://example.com)`
3. **Plain URLs**: `https://example.com`

Links are automatically parsed and rendered as clickable elements in the event cards on the website. Line breaks (`<br>` tags) are also properly rendered.

---

## How It Works

### Adding Links in Google Calendar

When creating or editing an event in Google Calendar, you can include links in the description field. Google Calendar automatically converts URLs into HTML links when you use its link insertion tool (the link icon in the toolbar).

**Example 1: Using Google Calendar's link tool (recommended)**
1. In the description field, type your text: "Sign up here"
2. Highlight the text
3. Click the link icon in the toolbar
4. Paste the URL: `https://forms.google.com/registration`
5. Google Calendar will create: `<a href="https://forms.google.com/registration">Sign up here</a>`

**Example 2: Markdown-style link**
```
Join us for training! [Register here](https://forms.google.com/registration)
```

**Example 3: Plain URL**
```
Join us for training! Registration: https://forms.google.com/registration
```

**Example 4: Multiple links and line breaks**
```
Sign up here: <a href="https://forms.gle/example">https://forms.gle/example</a><br>
7-7:45pm: S&C with Coach<br>
7:45-9:30pm: Free fencing
```

### On the Website

- Links appear in **red color** (matching the site's theme)
- They are **underlined** for clarity
- Clicking a link opens it in a **new tab**
- The `rel="noopener noreferrer"` attribute is added for security

---

## Technical Implementation

### Files Modified

1. **`/lib/parse-description-links.tsx`** (new file)
   - Contains the `parseDescriptionWithLinks()` function
   - Parses description text and returns an array of React elements
   - Handles both markdown-style links `[text](url)` and plain URLs
   - Preserves existing behavior of removing the `Tag:` prefix

2. **`/components/events/EventCard.tsx`** (modified)
   - Imports and uses `parseDescriptionWithLinks()`
   - Changed line 44 from plain text rendering to link-aware rendering
   - Maintains the 2-line truncation (`line-clamp-2`) behavior

3. **`/docs/ADDING_EVENTS.md`** (updated)
   - Added documentation about link formats
   - Provides examples for event creators

### Link Parsing Logic

The parser processes the description string sequentially:

1. **Check for HTML links** `<a href="url">text</a>` first (Google Calendar's format)
2. **Check for markdown links** `[text](url)` second
3. **Check for plain URLs** `https://...` or `http://...`
4. **Parse `<br>` tags** in text segments and convert them to React line breaks
5. **Decode HTML entities** like `&amp;`, `&lt;`, `&gt;`, etc.
6. **Add text between links** as `<span>` elements
7. **Repeat** until the entire string is processed

### Styling

Links use the following classes:
```tsx
className="text-red hover:text-red-dark underline transition-colors"
```

This ensures:
- Links match the site's red accent color
- Hover state provides visual feedback
- Underline makes them clearly identifiable as links
- Smooth color transitions on hover

---

## Examples

### Input (Google Calendar Description)
```
Training session this Thursday! [Sign up here](https://forms.google.com/signup)

Location details: https://maps.google.com/location
```

### Output (Rendered on Website)
```
Training session this Thursday! Sign up here

Location details: https://maps.google.com/location
```
*(where "Sign up here" and the URL are clickable, styled links)*

---

## Testing

Unit tests are available in `/lib/__tests__/parse-description-links.test.tsx` covering:
- Plain text without links
- Markdown-style links
- Plain URLs
- Multiple links in one description
- Mixed markdown and plain URLs
- Removal of `Tag:` prefix

---

## Security Considerations

All links include:
- `target="_blank"` — opens in a new tab
- `rel="noopener noreferrer"` — prevents the new page from accessing the `window.opener` property and ensures no referrer information is leaked

This is important for user security when linking to external sites.

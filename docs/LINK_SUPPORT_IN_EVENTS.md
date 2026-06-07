# Link Support in Event Descriptions

## Overview

Event descriptions now support clickable links in two formats:

1. **Markdown-style links**: `[Link text](https://example.com)`
2. **Plain URLs**: `https://example.com`

Links are automatically parsed and rendered as clickable elements in the event cards on the website.

---

## How It Works

### Adding Links in Google Calendar

When creating or editing an event in Google Calendar, you can include links in the description field:

**Example 1: Markdown-style link**
```
Join us for training! [Register here](https://forms.google.com/registration)
```

**Example 2: Plain URL**
```
Join us for training! Registration: https://forms.google.com/registration
```

**Example 3: Multiple links**
```
[Competition details](https://example.com/details) | [Register](https://forms.google.com/register)
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

1. **Check for markdown links** `[text](url)` first (to avoid breaking these patterns)
2. **Check for plain URLs** `https://...` or `http://...`
3. **Add text between links** as plain `<span>` elements
4. **Repeat** until the entire string is processed

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

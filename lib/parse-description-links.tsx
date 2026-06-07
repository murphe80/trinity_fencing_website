import React from 'react'

/**
 * Parses event descriptions that may contain:
 * - HTML markup: <a href="url">text</a>, <br>, etc.
 * - Markdown-style links: [text](url)
 * - Plain URLs: https://example.com
 *
 * Returns an array of React elements with clickable links and proper formatting.
 */
export function parseDescriptionWithLinks(description: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = description
  let key = 0

  // Remove the "Tag:" line if present
  remaining = remaining.replace(/^Tag:.*$/m, '').trim()

  while (remaining.length > 0) {
    // Try to match HTML anchor tags <a href="url">text</a>
    const htmlLinkMatch = remaining.match(/<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i)

    if (htmlLinkMatch) {
      const beforeLink = remaining.substring(0, htmlLinkMatch.index)
      const linkUrl = htmlLinkMatch[1]
      const linkText = htmlLinkMatch[2]

      // Add text before the link (parsing any <br> tags)
      if (beforeLink) {
        parts.push(...parseTextWithBreaks(beforeLink, key))
        key += 100 // Increment by a larger amount to avoid key collisions
      }

      // Add the link
      parts.push(
        <a
          key={`link-${key++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red hover:text-red-dark underline transition-colors"
        >
          {linkText}
        </a>
      )

      // Continue with the rest
      remaining = remaining.substring((htmlLinkMatch.index ?? 0) + htmlLinkMatch[0].length)
      continue
    }

    // Try to match markdown-style link [text](url)
    const markdownMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)

    if (markdownMatch) {
      const beforeLink = remaining.substring(0, markdownMatch.index)
      const linkText = markdownMatch[1]
      const linkUrl = markdownMatch[2]

      // Add text before the link
      if (beforeLink) {
        parts.push(...parseTextWithBreaks(beforeLink, key))
        key += 100
      }

      // Add the link
      parts.push(
        <a
          key={`link-${key++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red hover:text-red-dark underline transition-colors"
        >
          {linkText}
        </a>
      )

      // Continue with the rest
      remaining = remaining.substring((markdownMatch.index ?? 0) + markdownMatch[0].length)
      continue
    }

    // Try to match plain URL
    const urlMatch = remaining.match(/(https?:\/\/[^\s<]+)/)

    if (urlMatch) {
      const beforeLink = remaining.substring(0, urlMatch.index)
      const url = urlMatch[1]

      // Add text before the link
      if (beforeLink) {
        parts.push(...parseTextWithBreaks(beforeLink, key))
        key += 100
      }

      // Add the link (use the URL as both href and text)
      parts.push(
        <a
          key={`link-${key++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red hover:text-red-dark underline transition-colors"
        >
          {url}
        </a>
      )

      // Continue with the rest
      remaining = remaining.substring((urlMatch.index ?? 0) + urlMatch[0].length)
      continue
    }

    // No more links found, add the remaining text (parsing <br> tags)
    parts.push(...parseTextWithBreaks(remaining, key))
    break
  }

  return parts
}

/**
 * Helper function to parse text containing <br> or <br/> tags
 * and convert them to line breaks in React
 */
function parseTextWithBreaks(text: string, startKey: number): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const segments = text.split(/<br\s*\/?>/i)

  segments.forEach((segment, index) => {
    if (segment) {
      // Decode HTML entities
      const decoded = segment
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")

      parts.push(<span key={`text-${startKey}-${index}`}>{decoded}</span>)
    }

    // Add line break after each segment except the last
    if (index < segments.length - 1) {
      parts.push(<br key={`br-${startKey}-${index}`} />)
    }
  })

  return parts
}

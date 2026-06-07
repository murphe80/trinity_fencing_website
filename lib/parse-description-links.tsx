import React from 'react'

/**
 * Parses event descriptions that may contain:
 * - Markdown-style links: [text](url)
 * - Plain URLs: https://example.com
 *
 * Returns an array of React elements with clickable links.
 */
export function parseDescriptionWithLinks(description: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = description
  let key = 0

  // Remove the "Tag:" line if present
  remaining = remaining.replace(/^Tag:.*$/m, '').trim()

  while (remaining.length > 0) {
    // Try to match markdown-style link [text](url)
    const markdownMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)

    if (markdownMatch) {
      const beforeLink = remaining.substring(0, markdownMatch.index)
      const linkText = markdownMatch[1]
      const linkUrl = markdownMatch[2]

      // Add text before the link
      if (beforeLink) {
        parts.push(<span key={`text-${key++}`}>{beforeLink}</span>)
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
    const urlMatch = remaining.match(/(https?:\/\/[^\s]+)/)

    if (urlMatch) {
      const beforeLink = remaining.substring(0, urlMatch.index)
      const url = urlMatch[1]

      // Add text before the link
      if (beforeLink) {
        parts.push(<span key={`text-${key++}`}>{beforeLink}</span>)
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

    // No more links found, add the remaining text
    parts.push(<span key={`text-${key++}`}>{remaining}</span>)
    break
  }

  return parts
}

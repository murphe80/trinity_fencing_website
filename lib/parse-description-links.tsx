import React from 'react'
import {
  decodeHtmlEntities,
  extractFirstDescriptionLink,
  findNextLinkMatch,
} from './description-links'

const LINK_CLASS = 'text-red hover:text-red-dark underline transition-colors'

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
    const linkMatch = findNextLinkMatch(remaining)

    if (linkMatch) {
      const beforeLink = remaining.substring(0, linkMatch.index)
      if (beforeLink) {
        parts.push(...parseTextWithBreaks(beforeLink, key))
        key += 100
      }

      parts.push(
        <a
          key={`link-${key++}`}
          href={linkMatch.href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {linkMatch.text}
        </a>
      )

      remaining = remaining.substring(linkMatch.index + linkMatch.raw.length)
      continue
    }

    // No more links found, add the remaining text (parsing <br> tags)
    parts.push(...parseTextWithBreaks(remaining, key))
    break
  }

  return parts
}

export { extractFirstDescriptionLink }

/**
 * Helper function to parse text containing <br> or <br/> tags
 * and convert them to line breaks in React
 */
function parseTextWithBreaks(text: string, startKey: number): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const cleanText = text
    .replace(/<br\s*\/?>/gi, '<br>')
    .replace(/<\/(p|div|li)>/gi, '<br>')
    .replace(/<[^>]*>/g, '')
  const segments = cleanText.split(/<br>/i)

  segments.forEach((segment, index) => {
    if (segment) {
      parts.push(<span key={`text-${startKey}-${index}`}>{decodeHtmlEntities(segment)}</span>)
    }

    // Add line break after each segment except the last
    if (index < segments.length - 1) {
      parts.push(<br key={`br-${startKey}-${index}`} />)
    }
  })

  return parts
}

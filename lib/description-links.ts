export type DescriptionLinkMatch = {
  index: number
  raw: string
  href: string
  text: string
}

export function extractFirstDescriptionLink(description?: string | null): string | undefined {
  if (!description) return undefined
  return findNextLinkMatch(description)?.href
}

export function findNextLinkMatch(text: string): DescriptionLinkMatch | undefined {
  const matches = [
    findHtmlLinkMatch(text),
    findMarkdownLinkMatch(text),
    findPlainUrlMatch(text),
  ].filter((match): match is DescriptionLinkMatch => Boolean(match))

  return matches.sort((a, b) => a.index - b.index)[0]
}

function findHtmlLinkMatch(text: string): DescriptionLinkMatch | undefined {
  const match = text.match(
    /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/i
  )
  if (!match || match.index === undefined) return undefined

  const href = normalizeHref(match[1] ?? match[2] ?? match[3] ?? '')
  if (!href) return undefined

  return {
    index: match.index,
    raw: match[0],
    href,
    text: plainTextFromHtml(match[4]) || href,
  }
}

function findMarkdownLinkMatch(text: string): DescriptionLinkMatch | undefined {
  const match = text.match(/\[([^\]]+)\]\(([^)\s]+)\)/)
  if (!match || match.index === undefined) return undefined

  const href = normalizeHref(match[2])
  if (!href) return undefined

  return {
    index: match.index,
    raw: match[0],
    href,
    text: decodeHtmlEntities(match[1]),
  }
}

function findPlainUrlMatch(text: string): DescriptionLinkMatch | undefined {
  const match = text.match(/https?:\/\/[^\s<>"']+/i)
  if (!match || match.index === undefined) return undefined

  const href = normalizeHref(trimTrailingUrlPunctuation(match[0]))
  if (!href) return undefined

  return {
    index: match.index,
    raw: match[0],
    href,
    text: href,
  }
}

function normalizeHref(href: string): string | undefined {
  const decoded = decodeHtmlEntities(href).trim()
  if (/^(https?:\/\/|mailto:)/i.test(decoded)) return decoded
  return undefined
}

function trimTrailingUrlPunctuation(url: string): string {
  return url.replace(/[)\].,!?;:]+$/, '')
}

function plainTextFromHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li)>/gi, '\n')
      .replace(/<[^>]*>/g, '')
  ).trim()
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

/** Pure URL transforms for Drive links — safe for client bundles (no googleapis). */

export function driveUrlToImageSrc(driveUrl: string): string {
  const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`
  return driveUrl
}

/** `next/image` only accepts absolute http(s) URLs or site-relative paths starting with `/`. */
export function isNextImageSrc(src: string): boolean {
  const t = src.trim()
  return t.startsWith('/') || t.startsWith('https://') || t.startsWith('http://')
}

/** Drive transform then drop sheet placeholders (e.g. "test") that are not real URLs. */
export function safeDriveImageUrl(cell: string | undefined | null): string | undefined {
  if (!cell?.trim()) return undefined
  const u = driveUrlToImageSrc(cell.trim())
  return isNextImageSrc(u) ? u : undefined
}

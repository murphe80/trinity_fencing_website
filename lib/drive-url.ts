/** Pure URL transforms for Drive links — safe for client bundles (no googleapis). */

function extractDriveFileId(driveUrl: string): string | undefined {
  const filePathMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (filePathMatch) return filePathMatch[1]

  try {
    const url = new URL(driveUrl)
    const id = url.searchParams.get('id')
    return id ?? undefined
  } catch {
    return undefined
  }
}

export function driveUrlToImageSrc(driveUrl: string): string {
  const fileId = extractDriveFileId(driveUrl)
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
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

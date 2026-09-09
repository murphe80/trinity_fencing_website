export function hasFeaturedMarker(description?: string | null) {
  return /\bFeatured\b/i.test((description ?? '').replace(/<[^>]*>/g, ' '))
}
export function selectFeaturedEvents<
  T extends { description?: string | null; start: Date },
>(events: T[], now = new Date()) {
  return events
    .filter(
      (e) =>
        hasFeaturedMarker(e.description) && e.start.getTime() > now.getTime(),
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

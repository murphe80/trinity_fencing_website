'use client'
import { useEffect, useState } from 'react'
export type FeaturedEvent = {
  id: string
  title: string
  start: string
  allDay: boolean
  location?: string
}
export default function FeaturedEventBanner({
  events,
}: {
  events: FeaturedEvent[]
}) {
  const [now, setNow] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    setNow(new Date().toISOString())
    const timer = setInterval(() => setNow(new Date().toISOString()), 60000)
    return () => clearInterval(timer)
  }, [])
  const event = events.find((e) => !now || e.start > now)
  if (!event) return null
  const date = new Intl.DateTimeFormat('en-IE', {
    timeZone: 'Europe/Dublin',
    day: 'numeric',
    month: 'short',
    ...(!event.allDay ? ({ hour: '2-digit', minute: '2-digit' } as const) : {}),
  }).format(new Date(event.start))
  const details = `${date}${event.location ? ` · ${event.location}` : ''}`
  return (
    <aside
      aria-label="Featured event"
      className="featured-banner absolute inset-x-0 top-16 z-20 bg-transparent text-white border-b border-white/20"
      data-paused={paused}
    >
      <a
        href="/events"
        className="featured-window block min-w-0 overflow-hidden hover:text-white/80 transition-colors"
      >
        <span className="sr-only">
          Featured event: {event.title}. {details}. View events.
        </span>
        {/* Equal-width copies make the loop seamless; only one link is announced. */}
        <div className="featured-track" key={event.id} aria-hidden="true">
          {[0, 1].map((group) => (
            <div className="featured-group" key={group}>
              {[0, 1].map((copy) => (
                <div className="featured-item" key={copy}>
                  <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">
                   Up next!
                  </span>
                  <span className="featured-divider" />
                  <span className="font-heading text-xl sm:text-2xl leading-none">
                    {event.title}
                  </span>
                  <span className="text-xs sm:text-sm leading-none text-white/90">
                    {details}
                  </span>
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                  <span className="featured-divider" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </a>
      <button
        type="button"
        className="featured-pause flex items-center justify-center w-14 shrink-0 border-l border-white/25 hover:text-white/70"
        aria-label={
          paused
            ? 'Resume featured event scrolling'
            : 'Pause featured event scrolling'
        }
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="m5 2 9 6-9 6z" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M4 3h3v10H4zm5 0h3v10H9z" />
          </svg>
        )}
      </button>
    </aside>
  )
}

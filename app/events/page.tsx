import type { Metadata } from 'next'
import EventsClient from '@/components/events/EventsClient'
import { getUpcomingEvents, getPastEvents } from '@/lib/google-calendar'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Events & Calendar',
  description: 'Upcoming DUFC competitions, training sessions, and social events.',
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(50),
    getPastEvents(20),
  ])

  return (
    <div className="bg-cream min-h-screen">
      {/* Page hero */}
      <div className="bg-black relative overflow-hidden">
        {/* Crest watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-5 pointer-events-none select-none">
          <span className="font-heading text-white text-[20rem] font-bold leading-none">D</span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
            Events & Calendar
          </h1>
          <p className="font-body text-white/60 mt-3 text-lg">
            Competitions, training sessions, social events, and alumni days.
          </p>
        </div>
      </div>

      <EventsClient upcoming={upcoming} past={past} />
    </div>
  )
}

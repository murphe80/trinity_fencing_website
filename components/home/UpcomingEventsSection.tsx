import Link from 'next/link'
import { format } from 'date-fns'
import Tag from '@/components/ui/Tag'
import type { CalendarEvent } from '@/types'

function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        {/* Date badge */}
        <div className="text-center flex-shrink-0 w-14">
          <div className="font-heading text-red text-3xl font-semibold leading-none">
            {format(event.start, 'd')}
          </div>
          <div className="font-body text-grey-mid text-xs uppercase tracking-wide mt-0.5">
            {format(event.start, 'MMM')}
          </div>
        </div>
        <Tag label={event.tag} />
      </div>

      <div>
        <h3 className="font-heading text-xl font-medium text-black">{event.title}</h3>
        {event.location && (
          <p className="font-body text-sm text-grey-mid mt-1">{event.location}</p>
        )}
      </div>
    </div>
  )
}

interface Props {
  events: CalendarEvent[]
}

export default function UpcomingEventsSection({ events }: Props) {
  return (
    <section className="bg-grey-light py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-black">
            Upcoming Events
          </h2>
          <Link
            href="/events"
            className="font-body text-sm text-red font-medium hover:text-red-dark transition-colors hidden sm:block"
          >
            View all events →
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="font-body text-grey-mid">
            No upcoming events scheduled. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <div className="mt-8 sm:hidden">
          <Link
            href="/events"
            className="font-body text-sm text-red font-medium hover:text-red-dark transition-colors"
          >
            View all events →
          </Link>
        </div>
      </div>
    </section>
  )
}

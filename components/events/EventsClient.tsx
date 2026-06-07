'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import EventCard from './EventCard'
import EventFilterBar from './EventFilterBar'
import CalendarEmbed from './CalendarEmbed'
import type { CalendarEvent, EventTag } from '@/types'

function groupByMonth(events: CalendarEvent[]) {
  return events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const key = format(event.start, 'MMMM yyyy')
    if (!acc[key]) acc[key] = []
    acc[key].push(event)
    return acc
  }, {})
}

interface Props {
  upcoming: CalendarEvent[]
  past: CalendarEvent[]
}

export default function EventsClient({ upcoming, past }: Props) {
  const [activeFilter, setActiveFilter] = useState<EventTag | 'All'>('All')
  const [showCalendar, setShowCalendar] = useState(false)
  const [showPast, setShowPast] = useState(false)

  const filtered = activeFilter === 'All'
    ? upcoming
    : upcoming.filter(e => e.tag === activeFilter)

  const grouped = groupByMonth(filtered)

  return (
    <div>
      {/* Filter bar + calendar toggle */}
      <div className="sticky top-16 z-20 bg-cream py-4 border-b border-grey-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <EventFilterBar active={activeFilter} onChange={setActiveFilter} />
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex w-fit shrink-0 items-center gap-2 self-start rounded-md border border-grey-light px-4 py-2 font-body text-sm font-medium text-grey-dark transition-colors hover:text-red sm:self-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {showCalendar ? 'Hide Calendar View' : 'View as Calendar'}
            </button>
          </div>
        </div>
      </div>

      {showCalendar && (
        <div className="border-b border-grey-light bg-cream">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <CalendarEmbed />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Upcoming events grouped by month */}
        {Object.keys(grouped).length === 0 ? (
          <p className="font-body text-grey-mid py-8">
            No upcoming events{activeFilter !== 'All' ? ` tagged "${activeFilter}"` : ''}. Check back soon.
          </p>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([month, events]) => (
              <div key={month}>
                <h2 className="font-heading text-2xl text-black border-b border-grey-light pb-2 mb-4">
                  {month}
                </h2>
                <div>
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

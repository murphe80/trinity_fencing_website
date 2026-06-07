import { format } from 'date-fns'
import Tag from '@/components/ui/Tag'
import type { CalendarEvent } from '@/types'
import { parseDescriptionWithLinks } from '@/lib/parse-description-links'

interface Props {
  event: CalendarEvent
}

export default function EventCard({ event }: Props) {
  const timeStr = event.allDay ? 'All day' : format(event.start, 'h:mm a')

  return (
    <div className="flex gap-5 py-5 border-b border-grey-light last:border-0">
      {/* Date block */}
      <div className="flex-shrink-0 w-16 text-center">
        <div className="font-heading text-red text-3xl font-semibold leading-none">
          {format(event.start, 'd')}
        </div>
        <div className="font-body text-grey-mid text-xs uppercase tracking-wide mt-0.5">
          {format(event.start, 'MMM')}
        </div>
        <div className="font-body text-grey-mid text-xs mt-0.5">
          {format(event.start, 'yyyy')}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3 mb-1.5">
          <h3 className="font-heading text-xl font-medium text-black flex-1">{event.title}</h3>
          <Tag label={event.tag} className="flex-shrink-0 hidden sm:inline-block" />
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 font-body text-sm text-grey-mid mb-2">
          {event.location && <span>{event.location}</span>}
          {event.location && <span>·</span>}
          <span>{timeStr}</span>
          <Tag label={event.tag} className="sm:hidden" />
        </div>

        {event.description && (
          <p className="font-body text-sm text-grey-dark leading-relaxed line-clamp-2">
            {parseDescriptionWithLinks(event.description)}
          </p>
        )}

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 font-body text-sm text-red font-medium hover:text-red-dark transition-colors"
          >
            Details →
          </a>
        )}
      </div>
    </div>
  )
}

import { google } from 'googleapis'
import type { CalendarEvent, EventTag } from '@/types'
import { CALENDAR_COLOR_TAG_MAP, GOOGLE_CONFIG } from './constants'
import { getGoogleAuthClient } from './google-auth'
import { extractFirstDescriptionLink } from './description-links'

function parseTagFromEvent(colorId?: string, description?: string): EventTag {
  if (colorId && CALENDAR_COLOR_TAG_MAP[colorId]) {
    return CALENDAR_COLOR_TAG_MAP[colorId] as EventTag
  }
  const tagMatch = description?.match(/^Tag:\s*(\w+)/m)
  if (tagMatch) {
    const tag = tagMatch[1] as EventTag
    const validTags: EventTag[] = ['Competition', 'Training', 'Social', 'Alumni', 'General']
    if (validTags.includes(tag)) return tag
  }
  return 'General'
}

function extractLink(event: {
  hangoutLink?: string | null
  description?: string | null
  htmlLink?: string | null
}): string | undefined {
  if (event.hangoutLink) return event.hangoutLink
  return extractFirstDescriptionLink(event.description) ?? event.htmlLink ?? undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGoogleEvent(event: any): CalendarEvent {
  const start = event.start?.dateTime
    ? new Date(event.start.dateTime)
    : new Date(event.start?.date ?? '')
  const end = event.end?.dateTime
    ? new Date(event.end.dateTime)
    : new Date(event.end?.date ?? '')

  return {
    id: event.id ?? '',
    title: event.summary ?? 'Untitled Event',
    start,
    end,
    allDay: !event.start?.dateTime,
    location: event.location ?? undefined,
    description: event.description ?? undefined,
    tag: parseTagFromEvent(event.colorId, event.description),
    link: extractLink(event),
  }
}

export async function getUpcomingEvents(maxResults = 50): Promise<CalendarEvent[]> {
  try {
    const auth = getGoogleAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })
    const res = await calendar.events.list({
      calendarId: GOOGLE_CONFIG.calendarId,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })
    return (res.data.items ?? []).map(mapGoogleEvent)
  } catch (err) {
    console.error('Failed to fetch upcoming calendar events:', err)
    return []
  }
}

export async function getAllEvents(): Promise<CalendarEvent[]> {
  try {
    const auth = getGoogleAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })

    // Fetch from the start of the current academic year (Sept 1)
    const now = new Date()
    const academicYearStart = new Date(
      now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1,
      8, 1
    )

    const res = await calendar.events.list({
      calendarId: GOOGLE_CONFIG.calendarId,
      timeMin: academicYearStart.toISOString(),
      maxResults: 200,
      singleEvents: true,
      orderBy: 'startTime',
    })
    return (res.data.items ?? []).map(mapGoogleEvent)
  } catch (err) {
    console.error('Failed to fetch all calendar events:', err)
    return []
  }
}

export async function getPastEvents(maxResults = 20): Promise<CalendarEvent[]> {
  try {
    const auth = getGoogleAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })
    const res = await calendar.events.list({
      calendarId: GOOGLE_CONFIG.calendarId,
      timeMax: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })
    return (res.data.items ?? [])
      .map(mapGoogleEvent)
      .sort((a, b) => b.start.getTime() - a.start.getTime())
  } catch (err) {
    console.error('Failed to fetch past calendar events:', err)
    return []
  }
}

export { parseTagFromEvent }

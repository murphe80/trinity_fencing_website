import { google } from 'googleapis'
import type { CalendarEvent, EventTag } from '@/types'
import { GOOGLE_CONFIG } from './constants'
import { getGoogleAuthClient } from './google-auth'
import { extractFirstDescriptionLink } from './description-links'

type GoogleCalendarClient = ReturnType<typeof google.calendar>

type GoogleCalendarEvent = {
  id?: string | null
  summary?: string | null
  start?: { dateTime?: string | null; date?: string | null } | null
  end?: { dateTime?: string | null; date?: string | null } | null
  location?: string | null
  description?: string | null
  eventLabelId?: string | null
  hangoutLink?: string | null
  htmlLink?: string | null
}

type GoogleCalendarLabel = {
  id?: string | null
  name?: string | null
}

const EVENT_LABEL_VERSION = 1

const LABEL_NAME_TAG_MAP: Record<string, EventTag> = {
  competition: 'Competition',
  training: 'Training',
  social: 'Social',
  alumni: 'Alumni',
}

function parseTagFromEvent(
  eventLabelId?: string | null,
  eventLabelTagMap: Record<string, EventTag> = {}
): EventTag {
  if (eventLabelId && eventLabelTagMap[eventLabelId]) {
    return eventLabelTagMap[eventLabelId]
  }
  return 'General'
}

function normalizeLabelName(name: string | null | undefined): string | undefined {
  return name?.trim().toLowerCase()
}

async function getEventLabelTagMap(calendar: GoogleCalendarClient): Promise<Record<string, EventTag>> {
  try {
    const calendarRes = await calendar.calendars.get({ calendarId: GOOGLE_CONFIG.calendarId })

    const labels = (
      (calendarRes.data as {
        labelProperties?: { eventLabels?: GoogleCalendarLabel[] }
      }).labelProperties?.eventLabels ?? []
    )

    return labels.reduce<Record<string, EventTag>>((acc, label) => {
      if (!label.id) return acc

      const tag = LABEL_NAME_TAG_MAP[normalizeLabelName(label.name) ?? '']
      if (tag) acc[label.id] = tag
      return acc
    }, {})
  } catch (err) {
    console.error('Failed to fetch calendar event labels:', err)
    return {}
  }
}

function extractLink(event: {
  hangoutLink?: string | null
  description?: string | null
  htmlLink?: string | null
}): string | undefined {
  if (event.hangoutLink) return event.hangoutLink
  return extractFirstDescriptionLink(event.description) ?? event.htmlLink ?? undefined
}

function mapGoogleEvent(
  event: GoogleCalendarEvent,
  eventLabelTagMap: Record<string, EventTag> = {}
): CalendarEvent {
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
    tag: parseTagFromEvent(event.eventLabelId, eventLabelTagMap),
    link: extractLink(event),
  }
}

function withEventLabelVersion<T extends Record<string, unknown>>(params: T): T & {
  eventLabelVersion: number
} {
  return {
    ...params,
    eventLabelVersion: EVENT_LABEL_VERSION,
  }
}

export async function getUpcomingEvents(maxResults = 50): Promise<CalendarEvent[]> {
  try {
    const auth = getGoogleAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })
    const eventLabelTagMap = await getEventLabelTagMap(calendar)
    const res = await calendar.events.list(withEventLabelVersion({
      calendarId: GOOGLE_CONFIG.calendarId,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    }) as any)
    return (res.data.items ?? []).map(event =>
      mapGoogleEvent(event as GoogleCalendarEvent, eventLabelTagMap)
    )
  } catch (err) {
    console.error('Failed to fetch upcoming calendar events:', err)
    return []
  }
}

export async function getAllEvents(): Promise<CalendarEvent[]> {
  try {
    const auth = getGoogleAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })
    const eventLabelTagMap = await getEventLabelTagMap(calendar)

    // Fetch from the start of the current academic year (Sept 1)
    const now = new Date()
    const academicYearStart = new Date(
      now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1,
      8, 1
    )

    const res = await calendar.events.list(withEventLabelVersion({
      calendarId: GOOGLE_CONFIG.calendarId,
      timeMin: academicYearStart.toISOString(),
      maxResults: 200,
      singleEvents: true,
      orderBy: 'startTime',
    }) as any)
    return (res.data.items ?? []).map(event =>
      mapGoogleEvent(event as GoogleCalendarEvent, eventLabelTagMap)
    )
  } catch (err) {
    console.error('Failed to fetch all calendar events:', err)
    return []
  }
}

export async function getPastEvents(maxResults = 20): Promise<CalendarEvent[]> {
  try {
    const auth = getGoogleAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })
    const eventLabelTagMap = await getEventLabelTagMap(calendar)
    const res = await calendar.events.list(withEventLabelVersion({
      calendarId: GOOGLE_CONFIG.calendarId,
      timeMax: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    }) as any)
    return (res.data.items ?? [])
      .map(event => mapGoogleEvent(event as GoogleCalendarEvent, eventLabelTagMap))
      .sort((a, b) => b.start.getTime() - a.start.getTime())
  } catch (err) {
    console.error('Failed to fetch past calendar events:', err)
    return []
  }
}

export { parseTagFromEvent }

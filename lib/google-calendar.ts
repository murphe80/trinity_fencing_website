import type { CalendarEvent, EventTag } from '@/types'
import { GOOGLE_CONFIG } from './constants'
import { getGoogleAuthClient } from './google-auth'
import { extractFirstDescriptionLink } from './description-links'

type GoogleCalendarEvent = {
  id?: string | null
  summary?: string | null
  start?: { dateTime?: string | null; date?: string | null } | null
  end?: { dateTime?: string | null; date?: string | null } | null
  location?: string | null
  description?: string | null
  eventLabelId?: string | null
  colorId?: string | null
  hangoutLink?: string | null
  htmlLink?: string | null
}

type GoogleCalendarLabel = {
  id?: string | null
  name?: string | null
}

type GoogleCalendarMetadata = {
  labelProperties?: { eventLabels?: GoogleCalendarLabel[] }
}

const EVENT_LABEL_VERSION = 1
const CALENDAR_API_BASE_URL = 'https://www.googleapis.com/calendar/v3'

const LABEL_NAME_TAG_MAP: Record<string, EventTag> = {
  competition: 'Competition',
  training: 'Training',
  social: 'Social',
  alumni: 'Alumni',
}

const COLOR_TAG_MAP: Record<string, EventTag> = {
  '11': 'Competition',
  '9': 'Training',
  '2': 'Social',
  '5': 'Alumni',
}

type CalendarEventsResponse = {
  items?: GoogleCalendarEvent[]
}

function parseTagFromEvent(
  eventLabelId?: string | null,
  eventLabelTagMap: Record<string, EventTag> = {},
  colorId?: string | null,
  description?: string | null,
  summary?: string | null
): EventTag {
  if (eventLabelId && eventLabelTagMap[eventLabelId]) {
    return eventLabelTagMap[eventLabelId]
  }

  const labelNameTag = LABEL_NAME_TAG_MAP[normalizeLabelName(eventLabelId) ?? '']
  if (labelNameTag) return labelNameTag

  if (colorId && COLOR_TAG_MAP[colorId]) {
    return COLOR_TAG_MAP[colorId]
  }

  const descriptionTag = parseTagFromDescription(description)
  if (descriptionTag) return descriptionTag

  const textTag = parseTagFromText(summary, description)
  if (textTag) return textTag

  return 'General'
}

function normalizeLabelName(name: string | null | undefined): string | undefined {
  return name?.trim().toLowerCase()
}

function parseTagFromDescription(description: string | null | undefined): EventTag | undefined {
  const tagLine = description
    ?.replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .find(line => /^\s*tag\s*:/i.test(line))

  const tagName = tagLine?.replace(/^\s*tag\s*:\s*/i, '')
  return LABEL_NAME_TAG_MAP[normalizeLabelName(tagName) ?? '']
}

function normalizeSearchText(...parts: Array<string | null | undefined>): string {
  return parts
    .filter(Boolean)
    .join(' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function parseTagFromText(
  summary: string | null | undefined,
  description: string | null | undefined
): EventTag | undefined {
  const text = normalizeSearchText(summary, description)
  if (!text) return undefined

  if (/\balumni\b/.test(text)) return 'Alumni'
  if (/\b(social|pub|drinks|dinner|ball|quiz|party|bbq|barbecue)\b/.test(text)) {
    return 'Social'
  }
  if (/\b(intervarsit(?:y|ies)|competition|tournament|championship|championships)\b/.test(text)) {
    return 'Competition'
  }
  if (/\b(training|train|footwork|free fencing|s&c|strength and conditioning|beginner|beginners|taster)\b/.test(text)) {
    return 'Training'
  }

  return undefined
}

async function requestCalendarData<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const auth = getGoogleAuthClient()
  const res = await auth.request<T>({
    url: `${CALENDAR_API_BASE_URL}${path}`,
    method: 'GET',
    params,
  })

  return res.data
}

async function listCalendarEvents(
  params: Record<string, string | number | boolean | undefined>
): Promise<GoogleCalendarEvent[]> {
  const calendarId = encodeURIComponent(GOOGLE_CONFIG.calendarId)
  const data = await requestCalendarData<CalendarEventsResponse>(
    `/calendars/${calendarId}/events`,
    {
      ...params,
      eventLabelVersion: EVENT_LABEL_VERSION,
    }
  )

  return data.items ?? []
}

async function getEventLabelTagMap(): Promise<Record<string, EventTag>> {
  try {
    const calendarId = encodeURIComponent(GOOGLE_CONFIG.calendarId)
    const calendar = await requestCalendarData<GoogleCalendarMetadata>(
      `/calendars/${calendarId}`,
      { eventLabelVersion: EVENT_LABEL_VERSION }
    )
    const labels = calendar.labelProperties?.eventLabels ?? []

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
    tag: parseTagFromEvent(
      event.eventLabelId,
      eventLabelTagMap,
      event.colorId,
      event.description,
      event.summary
    ),
    link: extractLink(event),
  }
}

export async function getUpcomingEvents(maxResults = 50): Promise<CalendarEvent[]> {
  try {
    const eventLabelTagMap = await getEventLabelTagMap()
    const events = await listCalendarEvents({
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })
    return events.map(event => mapGoogleEvent(event, eventLabelTagMap))
  } catch (err) {
    console.error('Failed to fetch upcoming calendar events:', err)
    return []
  }
}

export async function getAllEvents(): Promise<CalendarEvent[]> {
  try {
    const eventLabelTagMap = await getEventLabelTagMap()

    // Fetch from the start of the current academic year (Sept 1)
    const now = new Date()
    const academicYearStart = new Date(
      now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1,
      8, 1
    )

    const events = await listCalendarEvents({
      timeMin: academicYearStart.toISOString(),
      maxResults: 200,
      singleEvents: true,
      orderBy: 'startTime',
    })
    return events.map(event => mapGoogleEvent(event, eventLabelTagMap))
  } catch (err) {
    console.error('Failed to fetch all calendar events:', err)
    return []
  }
}

export async function getPastEvents(maxResults = 20): Promise<CalendarEvent[]> {
  try {
    const eventLabelTagMap = await getEventLabelTagMap()
    const events = await listCalendarEvents({
      timeMax: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })
    return events
      .map(event => mapGoogleEvent(event, eventLabelTagMap))
      .sort((a, b) => b.start.getTime() - a.start.getTime())
  } catch (err) {
    console.error('Failed to fetch past calendar events:', err)
    return []
  }
}

export { parseTagFromEvent }

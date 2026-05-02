export type EventTag = 'Competition' | 'Training' | 'Social' | 'Alumni' | 'General'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  location?: string
  description?: string
  tag: EventTag
  link?: string
}

export interface Achievement {
  year: string
  date: string
  eventName: string
  level: string
  weapon: string
  result: string
  fencers: string[]
  description: string
  imageUrls: string[]
  featured: boolean
}

export interface CommitteeMember {
  name: string
  role: string
  email?: string
  bio?: string
  photoUrl?: string
  displayOrder: number
}

export interface Coach {
  name: string
  title: string
  bio: string
  photoUrl?: string
  qualifications?: string
}

export interface HonoraryMember {
  name: string
  yearAwarded: number
  note?: string
}

export interface InstagramFeature {
  imageUrl: string
  caption: string
  instagramLink?: string
  displayOrder: number
}

export interface DriveImage {
  id: string
  name: string
  src: string
  thumbnailSrc: string
}

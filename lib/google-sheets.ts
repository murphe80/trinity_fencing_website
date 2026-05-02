import { google } from 'googleapis'
import type { Achievement, CommitteeMember, Coach, HonoraryMember, InstagramFeature } from '@/types'
import { GOOGLE_CONFIG } from './constants'
import { getGoogleAuthClient } from './google-auth'
import { driveUrlToImageSrc, isNextImageSrc, safeDriveImageUrl } from './drive-url'

async function getSheetValues(range: string): Promise<string[][]> {
  const auth = getGoogleAuthClient()
  const sheets = google.sheets({ version: 'v4', auth })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_CONFIG.sheetsId,
    range,
  })
  // Skip header row (row 1)
  return (res.data.values ?? []).slice(1) as string[][]
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const rows = await getSheetValues('Achievements!A:J')
    return rows
      .map(row => ({
        year: row[0] ?? '',
        date: row[1] ?? '',
        eventName: row[2] ?? '',
        level: row[3] ?? '',
        weapon: row[4] ?? '',
        result: row[5] ?? '',
        fencers: (row[6] ?? '').split(',').map(s => s.trim()).filter(Boolean),
        description: row[7] ?? '',
        imageUrls: (row[8] ?? '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .map(driveUrlToImageSrc)
          .filter(isNextImageSrc),
        featured: (row[9] ?? '').toUpperCase() === 'TRUE',
      }))
      .filter(a => a.eventName)
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch (err) {
    console.error('Failed to fetch achievements:', err)
    return []
  }
}

export async function getFeaturedAchievements(limit = 3): Promise<Achievement[]> {
  const all = await getAchievements()
  return all.filter(a => a.featured).slice(0, limit)
}

export async function getCommitteeMembers(): Promise<CommitteeMember[]> {
  try {
    const rows = await getSheetValues('Committee!A:G')
    return rows
      .filter(row => (row[6] ?? '').toUpperCase() === 'TRUE') // active column
      .map(row => ({
        name: row[0] ?? '',
        role: row[1] ?? '',
        email: row[2] || undefined,
        bio: row[3] || undefined,
        photoUrl: safeDriveImageUrl(row[4]),
        displayOrder: parseInt(row[5] ?? '99', 10),
      }))
      .filter(m => m.name)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (err) {
    console.error('Failed to fetch committee members:', err)
    return []
  }
}

export async function getCoach(): Promise<Coach | null> {
  try {
    const rows = await getSheetValues('Coach!A:E')
    const row = rows[0]
    if (!row || !row[0]) return null
    return {
      name: row[0] ?? '',
      title: row[1] ?? '',
      bio: row[2] ?? '',
      photoUrl: safeDriveImageUrl(row[3]),
      qualifications: row[4] || undefined,
    }
  } catch (err) {
    console.error('Failed to fetch coach:', err)
    return null
  }
}

export async function getHonoraryMembers(): Promise<HonoraryMember[]> {
  try {
    const rows = await getSheetValues('Honorary Members!A:C')
    return rows
      .map(row => ({
        name: row[0] ?? '',
        yearAwarded: parseInt(row[1] ?? '0', 10),
        note: row[2] || undefined,
      }))
      .filter(m => m.name)
  } catch (err) {
    console.error('Failed to fetch honorary members:', err)
    return []
  }
}

export async function getInstagramFeatures(): Promise<InstagramFeature[]> {
  try {
    const rows = await getSheetValues('Instagram Featured!A:D')
    return rows
      .map(row => ({
        imageUrl: safeDriveImageUrl(row[0]) ?? '',
        caption: row[1] ?? '',
        instagramLink: row[2] || undefined,
        displayOrder: parseInt(row[3] ?? '99', 10),
      }))
      .filter(f => f.imageUrl)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (err) {
    console.error('Failed to fetch Instagram features:', err)
    return []
  }
}

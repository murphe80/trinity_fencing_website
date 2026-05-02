import { google } from 'googleapis'
import type { DriveImage } from '@/types'
import { getGoogleAuthClient } from './google-auth'

export async function getDriveFolderImages(folderId: string): Promise<DriveImage[]> {
  try {
    const auth = getGoogleAuthClient()
    const drive = google.drive({ version: 'v3', auth })
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name, thumbnailLink)',
      orderBy: 'name',
      pageSize: 100,
    })
    return (res.data.files ?? []).map(file => ({
      id: file.id ?? '',
      name: file.name ?? '',
      src: `https://drive.google.com/uc?export=view&id=${file.id}`,
      thumbnailSrc: file.thumbnailLink ?? `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`,
    }))
  } catch (err) {
    console.error('Failed to fetch Drive folder images:', err)
    return []
  }
}

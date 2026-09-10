import { google } from 'googleapis'
import { folders } from './club-drive'
import { googleErrorSummary } from './google-error'

export async function foldersNeedingSelection(
  auth: InstanceType<typeof google.auth.OAuth2>,
) {
  const drive = google.drive({ version: 'v3', auth })
  const missing: string[] = []
  for (const fileId of [folders.pdfResults, folders.results]) {
    try {
      const { data } = await drive.files.get({
        fileId,
        fields: 'mimeType,trashed,capabilities(canAddChildren)',
        supportsAllDrives: true,
      })
      if (
        data.trashed ||
        data.mimeType !== 'application/vnd.google-apps.folder' ||
        !data.capabilities?.canAddChildren
      )
        throw new Error(
          'You need Editor access to both club results folders. Contact the club to request access.',
        )
    } catch (error) {
      // An unselected file is not visible to a drive.file token.
      const status = googleErrorSummary(error).status
      if (status === 404 || status === 403) missing.push(fileId)
      else throw error
    }
  }
  return missing
}

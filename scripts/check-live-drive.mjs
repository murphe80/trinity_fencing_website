import { readFileSync } from 'node:fs'
import { google } from 'googleapis'
const key = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const auth = new google.auth.JWT({ email: key.client_email, key: key.private_key, scopes: ['https://www.googleapis.com/auth/drive.readonly'] })
const drive = google.drive({ version: 'v3', auth })
const folders = { policies: '1AaHpNCpuR9ePUMC2wJQ3PtIh6bGzMilf', photos: '1zo58jI0Rsb4CpHRoecsbBeEERoaBIIgJ', results: '1G1nFs7hbro19OUU2RZbDSlRv_x9gq7i8' }
for (const [kind, id] of Object.entries(folders)) {
  try {
    const info = await drive.files.get({ fileId: id, fields: 'id,name,mimeType,driveId,capabilities(canAddChildren)', supportsAllDrives: true })
    const files = []; let pageToken
    do {
      const res = await drive.files.list({ q: `'${id}' in parents and trashed=false`, fields: 'nextPageToken,files(id,name,mimeType)', pageSize: 100, pageToken, supportsAllDrives: true, includeItemsFromAllDrives: true })
      files.push(...(res.data.files ?? [])); pageToken = res.data.nextPageToken
    } while (pageToken)
    console.log(JSON.stringify({ kind, folder: info.data, files }))
    for (const file of files.filter(f => f.mimeType !== 'application/vnd.google-apps.folder').slice(0, 3)) {
      const native = file.mimeType.startsWith('application/vnd.google-apps.')
      const response = native ? await drive.files.export({ fileId: file.id, mimeType: 'application/pdf' }, { responseType: 'arraybuffer' }) : await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'arraybuffer' })
      console.log(JSON.stringify({ kind, file: file.name, readable: true, bytes: Buffer.byteLength(Buffer.from(response.data)) }))
    }
  } catch (error) {
    // Never print an auth request/config: it can contain the private key or bearer token.
    console.log(JSON.stringify({ kind, status: error.response?.status ?? error.code ?? 'failed', reason: error.response?.data?.error?.message ?? 'Request failed; credentials and request details redacted.' }))
  }
}

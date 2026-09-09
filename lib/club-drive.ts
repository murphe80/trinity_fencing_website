import { google } from 'googleapis'
import { poulePdf } from './poule-pdf'
import { Readable } from 'node:stream'
import { unstable_cache } from 'next/cache'
import { getGoogleAuthClient } from './google-auth'
import {
  publicationCutoff,
  validatePoule,
  selectPublishedPoules,
  type Poule,
} from './tournament'
export const folders = {
  policies:
    process.env.DRIVE_POLICIES_FOLDER_ID || '1AaHpNCpuR9ePUMC2wJQ3PtIh6bGzMilf',
  results:
    process.env.DRIVE_POULE_RESULTS_FOLDER_ID ||
    '1G1nFs7hbro19OUU2RZbDSlRv_x9gq7i8',
  pdfResults:
    process.env.DRIVE_POULE_PDF_FOLDER_ID ||
    '1jUq8aNtnFqPnrrgABF2lBU1EmVXQUpln',
  photos:
    process.env.DRIVE_TOURNAMENT_PHOTOS_FOLDER_ID ||
    '1zo58jI0Rsb4CpHRoecsbBeEERoaBIIgJ',
}
export const driveClient = () =>
  google.drive({ version: 'v3', auth: getGoogleAuthClient() })
export async function listFiles(folder: string) {
  if (!/^[\w-]+$/.test(folder))
    throw new Error('Drive folder is not configured.')
  const drive = driveClient()
  const files: {
    id: string
    name: string
    mimeType: string
    createdTime?: string
    modifiedTime?: string
  }[] = []
  let pageToken: string | undefined
  do {
    const response = await drive.files.list({
      q: `'${folder}' in parents and trashed = false`,
      fields: 'nextPageToken,files(id,name,mimeType,createdTime,modifiedTime)',
      pageSize: 100,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      orderBy: 'name',
    })
    files.push(
      ...(response.data.files ?? []).map((f) => ({
        id: f.id!,
        name: f.name!,
        mimeType: f.mimeType!,
        createdTime: f.createdTime ?? undefined,
        modifiedTime: f.modifiedTime ?? undefined,
      })),
    )
    pageToken = response.data.nextPageToken ?? undefined
  } while (pageToken)
  return files
}
export async function assertUploadFolders(
  auth: InstanceType<typeof google.auth.OAuth2>,
) {
  const drive = google.drive({ version: 'v3', auth })
  for (const fileId of [folders.results, folders.pdfResults]) {
    const folder = await drive.files.get({
      fileId,
      fields: 'mimeType,trashed,capabilities(canAddChildren)',
      supportsAllDrives: true,
    })
    if (
      folder.data.trashed ||
      folder.data.mimeType !== 'application/vnd.google-apps.folder' ||
      !folder.data.capabilities?.canAddChildren
    )
      throw new Error('Editor access to both results folders is required.')
  }
}
export class PartialPouleSaveError extends Error {
  constructor() {
    super(
      'The PDF was saved, but the JSON could not be saved. The tournament has not been updated by this attempt. Retry Save results to Drive; an extra PDF copy may be created.',
    )
  }
}
export async function savePoule(
  poule: Poule,
  auth: InstanceType<typeof google.auth.OAuth2>,
) {
  validatePoule(poule)
  await assertUploadFolders(auth)
  const drive = google.drive({ version: 'v3', auth })
  const saved = { ...poule, savedAt: new Date().toISOString() }
  const revision = saved.savedAt.replace(/[:.]/g, '-')
  const base = `${poule.date}_${poule.weapon}_${poule.id}_${revision}`
  const pdf = await poulePdf(saved)
  // Save the readable copy first; publish JSON only after it succeeds.
  const human = await drive.files.create({
    requestBody: {
      name: base + '.pdf',
      parents: [folders.pdfResults],
      mimeType: 'application/pdf',
    },
    media: { mimeType: 'application/pdf', body: Readable.from([pdf]) },
    fields: 'id',
    supportsAllDrives: true,
  })
  try {
    const result = await drive.files.create({
      requestBody: {
        name: base + '.json',
        parents: [folders.results],
        mimeType: 'application/json',
      },
      media: {
        mimeType: 'application/json',
        body: Readable.from([JSON.stringify(saved, null, 2)]),
      },
      fields: 'id',
      supportsAllDrives: true,
    })
    return {
      id: result.data.id,
      name: base + '.json',
      pdfId: human.data.id,
      pdfName: base + '.pdf',
    }
  } catch {
    throw new PartialPouleSaveError()
  }
}
export async function readPublished(cutoff: string): Promise<Poule[]> {
  const files = (await listFiles(folders.results)).filter((f) =>
    f.name.endsWith('.json'),
  )
  const result: Poule[] = []
  for (const file of files) {
    const response = await driveClient().files.get(
      { fileId: file.id, alt: 'media', supportsAllDrives: true },
      { responseType: 'json' },
    )
    const raw = response.data as unknown as Poule
    // Ignore unrelated JSON, but fail visibly on malformed DUFC result files.
    if (!raw || raw.version !== 1) continue
    const p = validatePoule(raw)
    // Manual uploads become eligible when uploaded, even if downloaded before the cutoff.
    const uploaded = Date.parse(file.createdTime ?? '')
    const exported = Date.parse(raw.savedAt ?? '')
    const savedAt = Number.isFinite(uploaded)
      ? new Date(
          Math.max(uploaded, Number.isFinite(exported) ? exported : uploaded),
        ).toISOString()
      : raw.savedAt
    result.push({ ...p, savedAt })
  }
  return selectPublishedPoules(result, cutoff)
}
export const publishedResults = (cutoff = publicationCutoff()) =>
  unstable_cache(
    () => readPublished(cutoff),
    ['wheel-results', folders.results, cutoff],
    {
      tags: ['wheel-results'],
      revalidate: false,
    },
  )()

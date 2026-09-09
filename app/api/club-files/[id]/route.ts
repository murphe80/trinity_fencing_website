import { googleErrorSummary } from '@/lib/google-error'
import { NextResponse } from 'next/server'
import { driveClient, folders } from '@/lib/club-drive'
export const dynamic = 'force-dynamic'
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!/^[\w-]+$/.test(params.id))
    return new NextResponse('Not found', { status: 404 })
  try {
    const metadata = await driveClient().files.get({
      fileId: params.id,
      fields: 'id,name,mimeType,parents,trashed',
      supportsAllDrives: true,
    })
    const file = metadata.data
    const policy = file.parents?.includes(folders.policies)
    const photo =
      file.parents?.includes(folders.photos) &&
      ['image/png', 'image/jpeg', 'image/webp'].includes(file.mimeType ?? '')
    if (
      (!policy && !photo) ||
      file.trashed ||
      !file.id ||
      !file.mimeType ||
      !file.name ||
      [
        'application/vnd.google-apps.folder',
        'application/vnd.google-apps.shortcut',
      ].includes(file.mimeType)
    )
      return new NextResponse('Not found', { status: 404 })
    const native = file.mimeType.startsWith('application/vnd.google-apps.')
    const drive = driveClient()
    const response = native
      ? await drive.files.export(
          { fileId: file.id, mimeType: 'application/pdf' },
          { responseType: 'arraybuffer' },
        )
      : await drive.files.get(
          { fileId: file.id, alt: 'media', supportsAllDrives: true },
          { responseType: 'arraybuffer' },
        )
    const safeInline =
      Boolean(photo) || native || file.mimeType === 'application/pdf'
    return new NextResponse(Buffer.from(response.data as ArrayBuffer), {
      headers: {
        'Content-Type': native ? 'application/pdf' : file.mimeType,
        'Content-Disposition': `${safeInline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(file.name + (native ? '.pdf' : ''))}`,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': 'sandbox',
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch (error) {
    console.error('Club file unavailable:', googleErrorSummary(error))
    return new NextResponse(
      'This file is temporarily unavailable. Please try again later.',
      { status: 503 },
    )
  }
}

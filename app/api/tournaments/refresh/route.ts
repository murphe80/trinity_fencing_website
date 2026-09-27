import { googleErrorSummary } from '@/lib/google-error'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { authorized } from '@/lib/club-security'
import { publishedResults } from '@/lib/club-drive'
import { dublinParts, publicationCutoff } from '@/lib/tournament'
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  if (!authorized(request, 'CRON_SECRET'))
    return new NextResponse('Unauthorized', { status: 401 })
  const now = new Date(),
    parts = dublinParts(now)
  if (
    new Intl.DateTimeFormat('en', {
      weekday: 'short',
      timeZone: 'Europe/Dublin',
    }).format(now) !== 'Sat' ||
    parts.hour !== '10'
  )
    return NextResponse.json({ skipped: true })
  try {
    revalidateTag('wheel-results')
    const results = await publishedResults(publicationCutoff(now))
    return NextResponse.json({ updated: true, poules: results.length })
  } catch (error) {
    console.error('Poules Tournament refresh failed:', googleErrorSummary(error))
    return NextResponse.json(
      { error: 'Drive refresh failed.' },
      { status: 503 },
    )
  }
}

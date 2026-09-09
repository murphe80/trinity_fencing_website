import { NextResponse } from 'next/server'
import { validatePoule } from '@/lib/tournament'
import { poulePdf } from '@/lib/poule-pdf'
export const runtime = 'nodejs'
export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length') ?? 0) > 50000)
      throw new Error('Poule is too large.')
    const body = await request.text()
    if (body.length > 50000) throw new Error('Poule is too large.')
    const poule = validatePoule(JSON.parse(body))
    const pdf = await poulePdf(poule)
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="' +
          poule.date +
          '_' +
          poule.weapon +
          '_poule-results.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json(
      {
        error:
          'Could not create the PDF. Check that all bouts have valid completed scores, then try again.',
      },
      { status: 400 },
    )
  }
}

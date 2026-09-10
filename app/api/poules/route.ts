import { googleErrorSummary } from '@/lib/google-error'
import { NextRequest, NextResponse } from 'next/server'
import {
  savePouleToDestination,
  PartialPouleSaveError,
  DestinationSaveError,
} from '@/lib/club-drive'
import {
  SAVE_DESTINATIONS,
  type SaveDestination,
} from '@/lib/poule-destination'
import { validatePoule } from '@/lib/tournament'
import {
  sessionFrom,
  sameOrigin,
  oauthClient,
  storeSession,
  setPrivateCookie,
  SESSION_COOKIE,
} from '@/lib/google-upload-session'
export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: 'Please save from the club website.' },
      { status: 403 },
    )
  const session = sessionFrom(request)
  if (!session)
    return NextResponse.json(
      { error: 'Connect Google to save your results.', reconnect: true },
      { status: 401 },
    )
  if (Number(request.headers.get('content-length') ?? 0) > 50000)
    return NextResponse.json({ error: 'Poule is too large.' }, { status: 413 })
  let poule
  let destination: SaveDestination
  try {
    const text = await request.text()
    if (text.length > 50000) throw new Error('Poule is too large.')
    const raw = JSON.parse(text)
    destination = raw.destination ?? 'club'
    if (!SAVE_DESTINATIONS.includes(destination))
      throw new Error('Choose a valid save destination.')
    poule = validatePoule(raw)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid poule.' },
      { status: 400 },
    )
  }
  const client = oauthClient()
  client.setCredentials(session.tokens)
  try {
    // Google's client automatically refreshes expired access tokens during these requests.
    const result = await savePouleToDestination(
      { ...poule, prize: '', prizeWinner: '' },
      client,
      destination,
    )
    const response = NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
    // Upload success must not become an apparent failure if refreshing the cookie fails.
    try {
      storeSession(response, request, {
        ...session,
        tokens: { ...session.tokens, ...client.credentials },
      })
    } catch {
      setPrivateCookie(response, request, SESSION_COOKIE, '', 0)
    }
    return response
  } catch (error) {
    const status = googleErrorSummary(error).status
    const code = (error as { response?: { data?: { error?: string } } })
      .response?.data?.error
    const reconnect = status === 401 || code === 'invalid_grant'
    console.error('Poule save failed:', googleErrorSummary(error))
    const response = NextResponse.json(
      {
        reconnect,
        error:
          error instanceof PartialPouleSaveError ||
          error instanceof DestinationSaveError
            ? error.message
            : reconnect
              ? 'Your Google connection expired. Please reconnect and save again.'
              : 'Could not save. Check available Google Drive storage. Your draft is retained and you can download it.',
      },
      { status: reconnect ? 401 : 503 },
    )
    if (reconnect) setPrivateCookie(response, request, SESSION_COOKIE, '', 0)
    return response
  }
}

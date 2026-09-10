import { NextRequest, NextResponse } from 'next/server'
import { foldersNeedingSelection } from '@/lib/google-picker-access'
import {
  sessionFrom,
  sameOrigin,
  oauthClient,
  pickerConfig,
  storeSession,
  setPrivateCookie,
  SESSION_COOKIE,
} from '@/lib/google-upload-session'
import { googleErrorSummary } from '@/lib/google-error'
export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {
  const json = (value: object, status = 200) =>
    NextResponse.json(value, {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
      },
    })
  if (!sameOrigin(request))
    return json({ error: 'Please connect from the club website.' }, 403)
  const session = sessionFrom(request)
  if (!session)
    return json(
      {
        error: 'Reconnect Google to authorise individual result folders.',
        reconnect: true,
      },
      401,
    )
  try {
    const config = pickerConfig()
    const client = oauthClient()
    client.setCredentials(session.tokens)
    const missing = await foldersNeedingSelection(client)
    // Only expose a short-lived access token when Picker needs it. Never expose refresh tokens.
    const accessToken = missing.length
      ? (await client.getAccessToken()).token
      : undefined
    if (missing.length && !accessToken)
      throw new Error('Google could not provide access.')
    const response = json(
      missing.length
        ? { ready: false, ...config, accessToken, folderIds: missing }
        : { ready: true },
    )
    storeSession(response, request, {
      ...session,
      tokens: { ...session.tokens, ...client.credentials },
    })
    return response
  } catch (error) {
    const summary = googleErrorSummary(error)
    const code = (error as { response?: { data?: { error?: string } } })
      .response?.data?.error
    const reconnect = summary.status === 401 || code === 'invalid_grant'
    const response = json(
      {
        reconnect,
        error: reconnect
          ? 'Your Google connection expired. Reconnect and try again.'
          : 'Could not prepare Google folder selection. Check the Picker configuration and your Editor access to both results folders, then try again.',
      },
      reconnect ? 401 : 503,
    )
    if (reconnect) setPrivateCookie(response, request, SESSION_COOKIE, '', 0)
    return response
  }
}

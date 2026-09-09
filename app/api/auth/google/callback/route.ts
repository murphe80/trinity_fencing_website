import { NextRequest, NextResponse } from 'next/server'
import { assertUploadFolders } from '@/lib/club-drive'
import {
  oauthClient,
  redirectFor,
  unseal,
  setPrivateCookie,
  storeSession,
  STATE_COOKIE,
  DRIVE_SCOPE,
  TRACKER,
  type AuthState,
} from '@/lib/google-upload-session'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const finish = (status: string) => {
    const response = NextResponse.redirect(
      new URL(
        `${TRACKER}?google=${status}`,
        (() => {
          try {
            return redirectFor(request)
          } catch {
            return request.url
          }
        })(),
      ),
    )
    setPrivateCookie(response, request, STATE_COOKIE, '', 0)
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  }
  const state = unseal<AuthState>(
    request.cookies.get(STATE_COOKIE)?.value,
    STATE_COOKIE,
  )
  if (!state || state.nonce !== request.nextUrl.searchParams.get('state'))
    return finish('invalid')
  try {
    if (redirectFor(request) !== state.redirectUri) return finish('invalid')
  } catch {
    return finish('invalid')
  }
  if (request.nextUrl.searchParams.has('error')) return finish('cancelled')
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return finish('invalid')
  try {
    const client = oauthClient(state.redirectUri)
    const { tokens } = await client.getToken({
      code,
      codeVerifier: state.verifier,
    })
    if (!tokens.access_token || !tokens.scope?.split(' ').includes(DRIVE_SCOPE))
      return finish('permission')
    client.setCredentials(tokens)
    // The signed-in account must already be able to upload into this exact club folder.
    await assertUploadFolders(client)
    const response = finish('connected')
    storeSession(response, request, {
      tokens,
      expires: Date.now() + 30 * 86400000,
    })
    return response
  } catch {
    return finish('failed')
  }
}

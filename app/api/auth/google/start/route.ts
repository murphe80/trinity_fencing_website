import { CodeChallengeMethod } from 'google-auth-library'
import { randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import {
  oauthClient,
  redirectFor,
  seal,
  setPrivateCookie,
  STATE_COOKIE,
  DRIVE_SCOPE,
} from '@/lib/google-upload-session'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const redirectUri = redirectFor(request),
      client = oauthClient(redirectUri)
    const { codeVerifier, codeChallenge } =
      await client.generateCodeVerifierAsync()
    const nonce = randomBytes(32).toString('base64url')
    const response = NextResponse.redirect(
      client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [DRIVE_SCOPE],
        state: nonce,
        code_challenge: codeChallenge,
        code_challenge_method: CodeChallengeMethod.S256,
      }),
    )
    setPrivateCookie(
      response,
      request,
      STATE_COOKIE,
      seal(
        {
          nonce,
          verifier: codeVerifier,
          redirectUri,
          expires: Date.now() + 600000,
        },
        STATE_COOKIE,
      ),
      600,
    )
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  } catch {
    return NextResponse.json(
      {
        error:
          'Google uploads are not configured for this website address. You can still download your results.',
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}

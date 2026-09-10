import { readFileSync } from 'node:fs'
import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from 'node:crypto'
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

export const SESSION_COOKIE = 'dufc_drive_session'
export const STATE_COOKIE = 'dufc_drive_state'
export const TRACKER = '/tournaments/poule-tracker'
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file'
type Tokens = {
  access_token?: string | null
  refresh_token?: string | null
  expiry_date?: number | null
  scope?: string
  token_type?: string | null
}
export type UploadSession = { tokens: Tokens; expires: number }
export type AuthState = {
  nonce: string
  verifier: string
  redirectUri: string
  expires: number
}

export function oauthConfig() {
  const raw =
    process.env.GOOGLE_OAUTH_CLIENT_JSON ||
    (process.env.GOOGLE_OAUTH_CLIENT_FILE
      ? readFileSync(process.env.GOOGLE_OAUTH_CLIENT_FILE, 'utf8')
      : '')
  const web = raw ? JSON.parse(raw).web : undefined
  const clientId = web?.client_id || process.env.GOOGLE_CLIENT_ID
  const clientSecret = web?.client_secret || process.env.GOOGLE_CLIENT_SECRET
  const redirects: string[] =
    web?.redirect_uris ||
    [process.env.GOOGLE_OAUTH_REDIRECT_URI].filter(Boolean)
  if (!clientId || !clientSecret || !redirects.length)
    throw new Error('Google upload connection is not configured.')
  return { clientId, clientSecret, redirects }
}
export function redirectFor(request: Request) {
  // Next.js may expose its internal hostname in request.url. Match the browser's
  // Host against the registered callbacks; never accept an arbitrary return URL.
  const url = new URL(request.url)
  const host = request.headers.get('host') || url.host
  const forwardedProtocol = request.headers.get('x-forwarded-proto')
  const protocol =
    forwardedProtocol === 'https' || forwardedProtocol === 'http'
      ? forwardedProtocol + ':'
      : url.protocol
  const origin = protocol + '//' + host
  const redirect = oauthConfig().redirects.find(
    (uri) => uri === `${origin}/api/auth/google/callback`,
  )
  if (!redirect)
    throw new Error(
      'This website address is not registered for Google sign-in.',
    )
  return redirect
}
export function sameOrigin(request: Request) {
  try {
    return (
      request.headers.get('origin') === new URL(redirectFor(request)).origin
    )
  } catch {
    return false
  }
}
export function oauthClient(redirectUri?: string) {
  const { clientId, clientSecret } = oauthConfig()
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}
// A purpose-specific key derived from the OAuth secret avoids another secret for organisers.
function encryptionKey() {
  return Buffer.from(
    hkdfSync(
      'sha256',
      oauthConfig().clientSecret,
      'dufc',
      'drive-session-v1',
      32,
    ),
  )
}
export function seal(value: object, purpose: string) {
  const iv = randomBytes(12),
    cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  cipher.setAAD(Buffer.from(purpose))
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ])
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString(
    'base64url',
  )
}
export function unseal<T extends { expires: number }>(
  value: string | undefined,
  purpose: string,
): T | null {
  if (!value || value.length > 4000) return null
  try {
    const bytes = Buffer.from(value, 'base64url')
    const decipher = createDecipheriv(
      'aes-256-gcm',
      encryptionKey(),
      bytes.subarray(0, 12),
    )
    decipher.setAAD(Buffer.from(purpose))
    decipher.setAuthTag(bytes.subarray(12, 28))
    const result = JSON.parse(
      Buffer.concat([
        decipher.update(bytes.subarray(28)),
        decipher.final(),
      ]).toString('utf8'),
    )
    return Number.isFinite(result.expires) && result.expires > Date.now()
      ? result
      : null
  } catch {
    return null
  }
}
export function hasUploadScope(scope?: string) {
  const scopes = scope?.trim().split(/\s+/) ?? []
  return scopes.length === 1 && scopes[0] === DRIVE_SCOPE
}
export function sessionFrom(request: NextRequest) {
  const session = unseal<UploadSession>(
    request.cookies.get(SESSION_COOKIE)?.value,
    SESSION_COOKIE,
  )
  // Reject existing broad-scope sessions, including when they also contain drive.file.
  return session && hasUploadScope(session.tokens.scope) ? session : null
}
export function pickerConfig() {
  const apiKey = process.env.GOOGLE_PICKER_API_KEY
  const appId = process.env.GOOGLE_CLOUD_PROJECT_NUMBER
  if (!apiKey || !appId || !/^\d+$/.test(appId))
    throw new Error(
      'Google folder selection is not configured. Please contact the club; PDF downloads are still available.',
    )
  return { apiKey, appId }
}
export function setPrivateCookie(
  response: NextResponse,
  request: Request,
  name: string,
  value: string,
  maxAge: number,
) {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: (() => {
      try {
        return redirectFor(request).startsWith('https:')
      } catch {
        return new URL(request.url).protocol === 'https:'
      }
    })(),
    sameSite: 'lax',
    path: '/api',
    maxAge,
  })
  response.headers.set('Cache-Control', 'no-store')
}
export function storeSession(
  response: NextResponse,
  request: Request,
  session: UploadSession,
) {
  const value = seal(session, SESSION_COOKIE)
  if (value.length > 3800)
    throw new Error('Google connection is too large to store.')
  setPrivateCookie(
    response,
    request,
    SESSION_COOKIE,
    value,
    Math.max(0, Math.floor((session.expires - Date.now()) / 1000)),
  )
}

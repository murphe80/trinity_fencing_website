import { NextRequest, NextResponse } from 'next/server'
import { redirectFor, sessionFrom } from '@/lib/google-upload-session'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  let configured = false
  try {
    redirectFor(request)
    configured = true
  } catch {
    /* Config remains private. */
  }
  const session = configured ? sessionFrom(request) : null
  return NextResponse.json(
    {
      configured,
      connected: Boolean(
        session &&
        (session.tokens.refresh_token ||
          (session.tokens.expiry_date ?? 0) > Date.now()),
      ),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

import { NextResponse } from 'next/server'
import {
  sameOrigin,
  setPrivateCookie,
  SESSION_COOKIE,
} from '@/lib/google-upload-session'
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return new NextResponse('Forbidden', { status: 403 })
  const response = NextResponse.json({ disconnected: true })
  setPrivateCookie(response, request, SESSION_COOKIE, '', 0)
  return response
}

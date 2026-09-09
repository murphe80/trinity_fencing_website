import { timingSafeEqual } from 'node:crypto'
export function authorized(request: Request, variable: 'CRON_SECRET') {
  const expected = process.env[variable]
  const supplied =
    request.headers.get('authorization')?.replace(/^Bearer /, '') ?? ''
  if (!expected || expected.length < 24) return false
  const a = Buffer.from(expected),
    b = Buffer.from(supplied)
  return a.length === b.length && timingSafeEqual(a, b)
}

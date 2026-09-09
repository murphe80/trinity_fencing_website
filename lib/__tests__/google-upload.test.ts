import test from 'node:test'
import { PDFDocument } from 'pdf-lib'
import { POST as downloadPdf } from '../../app/api/poules/download/route'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import {
  seal,
  unseal,
  sameOrigin,
  redirectFor,
  SESSION_COOKIE,
  STATE_COOKIE,
} from '../google-upload-session'
import { GET as start } from '../../app/api/auth/google/start/route'
import { GET as callback } from '../../app/api/auth/google/callback/route'
import { POST as upload } from '../../app/api/poules/route'
import { google } from 'googleapis'
import { savePoule, folders, PartialPouleSaveError } from '../club-drive'
import { generateBouts, type Poule } from '../tournament'

process.env.GOOGLE_OAUTH_CLIENT_JSON = JSON.stringify({
  web: {
    client_id: 'test-client',
    client_secret: 'test-only-secret',
    redirect_uris: ['https://club.example/api/auth/google/callback'],
  },
})
const origin = 'https://club.example'

test('encrypted cookies reject tampering, wrong purpose and expired connections', () => {
  const payload = {
    tokens: { refresh_token: 'private-test-token' },
    expires: Date.now() + 60000,
  }
  const cookie = seal(payload, SESSION_COOKIE)
  assert.ok(!cookie.includes('private-test-token'))
  assert.deepEqual(unseal(cookie, SESSION_COOKIE), payload)
  assert.equal(unseal(cookie, STATE_COOKIE), null)
  assert.equal(
    unseal(cookie.slice(0, 12) + 'AA' + cookie.slice(14), SESSION_COOKIE),
    null,
  )
  assert.equal(
    unseal(seal({ expires: 1 }, SESSION_COOKIE), SESSION_COOKIE),
    null,
  )
})

test('uploads require an exact registered origin and a valid Google session', async () => {
  assert.equal(
    redirectFor(new Request(origin)),
    origin + '/api/auth/google/callback',
  )
  assert.throws(() => redirectFor(new Request('https://evil.example')))
  assert.equal(
    sameOrigin(
      new Request(origin, { headers: { origin: 'https://evil.example' } }),
    ),
    false,
  )
  const blocked = await upload(
    new NextRequest(origin + '/api/poules', {
      method: 'POST',
      headers: { origin: 'https://evil.example' },
    }),
  )
  assert.equal(blocked.status, 403)
  const anonymous = await upload(
    new NextRequest(origin + '/api/poules', {
      method: 'POST',
      headers: { origin },
    }),
  )
  assert.equal(anonymous.status, 401)
  const cookie = seal(
    { tokens: { access_token: 'test' }, expires: Date.now() + 60000 },
    SESSION_COOKIE,
  )
  const invalid = await upload(
    new NextRequest(origin + '/api/poules', {
      method: 'POST',
      headers: { origin, cookie: SESSION_COOKIE + '=' + cookie },
      body: '{}',
    }),
  )
  assert.equal(invalid.status, 400)
})

test('OAuth uses offline access, PKCE, encrypted state and secure cookies', async () => {
  const response = await start(new Request(origin + '/api/auth/google/start'))
  assert.equal(response.status, 307)
  const url = new URL(response.headers.get('location')!)
  assert.equal(url.hostname, 'accounts.google.com')
  assert.equal(url.searchParams.get('access_type'), 'offline')
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256')
  assert.ok(url.searchParams.get('code_challenge'))
  assert.ok(!url.toString().includes('test-only-secret'))
  const cookie = response.headers.get('set-cookie')!
  assert.match(cookie, /HttpOnly/)
  assert.match(cookie, /Secure/)
  const invalid = await callback(
    new NextRequest(
      origin + '/api/auth/google/callback?code=untrusted&state=forged',
    ),
  )
  assert.ok(invalid.headers.get('location')?.endsWith('?google=invalid'))
})

test('Drive uploader checks both folders, writes matching PDF/JSON revisions and reports partial failure', async () => {
  const auth = new google.auth.OAuth2()
  const calls: any[] = []
  let allowed = true
  let failUpload = 0
  let writes = 0
  const uploads: string[] = []
  auth.request = (async (options: any) => {
    calls.push(options)
    if (options.method === 'POST') {
      writes++
      if (writes === failUpload) throw new Error('Simulated upload failure')
      const chunks = []
      for await (const chunk of options.data) chunks.push(Buffer.from(chunk))
      uploads.push(Buffer.concat(chunks).toString('latin1'))
    }
    return {
      data:
        options.method === 'POST'
          ? { id: 'created-file' }
          : {
              mimeType: 'application/vnd.google-apps.folder',
              capabilities: { canAddChildren: allowed },
            },
    }
  }) as typeof auth.request
  const poule: Poule = {
    version: 1,
    id: '12345678-1234-4123-8123-123456789012',
    date: '2026-09-18',
    weapon: 'foil',
    fencers: ['Alice One', 'Bob Two'],
    bouts: generateBouts(2).map((b) => ({ ...b, scoreA: 5, scoreB: 2 })),
    wheel: true,
    prize: '',
    prizeWinner: '',
  }
  const saved = await savePoule(poule, auth)
  assert.equal(saved.id, 'created-file')
  assert.match(saved.name, /^2026-09-18_foil_12345678-/)
  assert.ok(calls[0].url.includes(folders.results))
  assert.ok(calls[1].url.includes(folders.pdfResults))
  assert.equal(calls[2].method, 'POST')
  assert.equal(calls[3].method, 'POST')
  assert.ok(uploads[0].includes(folders.pdfResults))
  assert.ok(uploads[0].includes('%PDF-'))
  assert.ok(uploads[1].includes(folders.results))
  assert.ok(uploads[1].includes('"savedAt"'))
  assert.equal(saved.pdfName.replace('.pdf', '.json'), saved.name)
  calls.length = 0
  writes = 0
  failUpload = 1
  await assert.rejects(savePoule(poule, auth))
  assert.equal(writes, 1, 'PDF failure must not publish JSON')
  writes = 0
  failUpload = 2
  await assert.rejects(savePoule(poule, auth), PartialPouleSaveError)
  assert.equal(writes, 2)
  failUpload = 0
  allowed = false
  calls.length = 0
  await assert.rejects(savePoule(poule, auth))
  assert.equal(calls.length, 1)
})

test("proxy internal URLs use only the browser's registered callback host", () => {
  const proxy = new Request('http://localhost:3000/api/poules', {
    headers: {
      host: 'club.example',
      'x-forwarded-proto': 'https',
      origin,
    },
  })
  assert.equal(redirectFor(proxy), origin + '/api/auth/google/callback')
  assert.equal(sameOrigin(proxy), true)
  assert.throws(() =>
    redirectFor(new Request(origin, { headers: { host: 'evil.example' } })),
  )
})

test('PDF download needs no Google connection and rejects incomplete scores', async () => {
  const poule: Poule = {
    version: 1,
    id: '12345678-1234-4123-8123-123456789012',
    date: '2026-09-18',
    weapon: 'epee',
    fencers: ['Élodie O’Connor', 'Seán Murphy'],
    bouts: generateBouts(2).map((b) => ({ ...b, scoreA: 5, scoreB: 3 })),
    wheel: false,
    prize: '',
    prizeWinner: '',
  }
  const response = await downloadPdf(
    new Request('https://club.example/api/poules/download', {
      method: 'POST',
      body: JSON.stringify(poule),
    }),
  )
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'application/pdf')
  assert.match(
    response.headers.get('content-disposition')!,
    /2026-09-18_epee_poule-results.pdf/,
  )
  const pdf = await PDFDocument.load(await response.arrayBuffer())
  assert.equal(pdf.getPageCount(), 1)
  poule.bouts[0].scoreA = null
  const invalid = await downloadPdf(
    new Request('https://club.example/api/poules/download', {
      method: 'POST',
      body: JSON.stringify(poule),
    }),
  )
  assert.equal(invalid.status, 400)
})

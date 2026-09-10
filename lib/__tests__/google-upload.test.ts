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
  DRIVE_SCOPE,
  sessionFrom,
  hasUploadScope,
} from '../google-upload-session'
import { GET as start } from '../../app/api/auth/google/start/route'
import { GET as callback } from '../../app/api/auth/google/callback/route'
import { foldersNeedingSelection } from '../google-picker-access'
import { POST as pickerPreparation } from '../../app/api/auth/google/picker/route'
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
process.env.GOOGLE_PICKER_API_KEY = 'test-picker-key'
process.env.GOOGLE_CLOUD_PROJECT_NUMBER = '123456789'
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
    {
      tokens: { access_token: 'test', scope: DRIVE_SCOPE },
      expires: Date.now() + 60000,
    },
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
  assert.equal(
    url.searchParams.get('scope'),
    'https://www.googleapis.com/auth/drive.file',
  )
  assert.equal(url.searchParams.get('include_granted_scopes'), 'false')
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

test('old broad-scope sessions cannot be used for uploads or Picker', async () => {
  for (const scope of [
    'https://www.googleapis.com/auth/drive',
    DRIVE_SCOPE + ' https://www.googleapis.com/auth/drive',
    '',
  ]) {
    assert.equal(hasUploadScope(scope), false)
    const cookie = seal(
      {
        tokens: { access_token: 'old-token', scope },
        expires: Date.now() + 60000,
      },
      SESSION_COOKIE,
    )
    const request = new NextRequest(origin + '/api/auth/google/picker', {
      method: 'POST',
      headers: { origin, cookie: SESSION_COOKIE + '=' + cookie },
    })
    assert.equal(sessionFrom(request), null)
    assert.equal((await pickerPreparation(request)).status, 401)
  }
  const blocked = await pickerPreparation(
    new NextRequest(origin + '/api/auth/google/picker', {
      method: 'POST',
      headers: { origin: 'https://evil.example' },
    }),
  )
  assert.equal(blocked.status, 403)
})
test('folder authorisation distinguishes unselected folders, missing write access and service failure', async () => {
  const auth = new google.auth.OAuth2()
  let failure = 404
  let allowed = true
  const inspected: string[] = []
  auth.request = (async (options: any) => {
    inspected.push(options.url)
    if (failure) throw { response: { status: failure } }
    return {
      data: {
        mimeType: 'application/vnd.google-apps.folder',
        capabilities: { canAddChildren: allowed },
      },
    }
  }) as typeof auth.request
  assert.deepEqual(await foldersNeedingSelection(auth), [
    folders.pdfResults,
    folders.results,
  ])
  assert.equal(inspected.length, 2)
  failure = 0
  assert.deepEqual(await foldersNeedingSelection(auth), [])
  allowed = false
  await assert.rejects(foldersNeedingSelection(auth), /Editor access/)
  failure = 503
  await assert.rejects(foldersNeedingSelection(auth))
})

test('file-only OAuth callback succeeds before the results folders have been picked', async () => {
  const original = google.auth.OAuth2.prototype.getToken
  google.auth.OAuth2.prototype.getToken = (async () => ({
    res: null,
    tokens: {
      access_token: 'test-access',
      refresh_token: 'test-refresh',
      scope: DRIVE_SCOPE,
      expiry_date: Date.now() + 3600000,
    },
  })) as typeof original
  try {
    const state = seal(
      {
        nonce: 'test-state',
        verifier: 'test-verifier',
        redirectUri: origin + '/api/auth/google/callback',
        expires: Date.now() + 60000,
      },
      STATE_COOKIE,
    )
    const response = await callback(
      new NextRequest(
        origin + '/api/auth/google/callback?state=test-state&code=test-code',
        {
          headers: { cookie: STATE_COOKIE + '=' + state },
        },
      ),
    )
    assert.ok(response.headers.get('location')?.endsWith('?google=connected'))
    assert.ok(response.cookies.get(SESSION_COOKIE)?.value)
  } finally {
    google.auth.OAuth2.prototype.getToken = original
  }
})

test('Picker only accepts the designated folder and handles cancellation', async () => {
  const { selectResultFolders } = await import('../google-folder-picker')
  const oldGoogle = Object.getOwnPropertyDescriptor(globalThis, 'google')
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  let selected = '',
    action = 'picked',
    disposed = 0
  const ids: string[] = []
  class View {
    setIncludeFolders() {
      return this
    }
    setSelectFolderEnabled() {
      return this
    }
    setFileIds(id: string) {
      ids.push(id)
      return this
    }
  }
  class Builder {
    callback: (data: any) => void = () => {}
    setTitle() {
      return this
    }
    setAppId() {
      return this
    }
    setDeveloperKey() {
      return this
    }
    setOAuthToken() {
      return this
    }
    setOrigin() {
      return this
    }
    addView() {
      return this
    }
    setCallback(callback: (data: any) => void) {
      this.callback = callback
      return this
    }
    build() {
      return {
        dispose() {
          disposed++
        },
        setVisible: () =>
          this.callback({
            action,
            docs: [{ id: selected || ids[ids.length - 1] }],
          }),
      }
    }
  }
  Object.defineProperty(globalThis, 'google', {
    configurable: true,
    value: {
      picker: {
        DocsView: View,
        PickerBuilder: Builder,
        ViewId: { FOLDERS: 'folders' },
        Action: { PICKED: 'picked', CANCEL: 'cancel' },
      },
    },
  })
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { location: { origin } },
  })
  try {
    const config = {
      accessToken: 'ephemeral-token',
      apiKey: 'key',
      appId: '123456',
      folderIds: [folders.pdfResults, folders.results],
    }
    await selectResultFolders(config)
    assert.deepEqual(ids, config.folderIds)
    assert.equal(disposed, 2)
    selected = 'unrelated-folder'
    await assert.rejects(selectResultFolders(config), /designated club/)
    action = 'cancel'
    await assert.rejects(selectResultFolders(config), /cancelled/)
  } finally {
    if (oldGoogle) Object.defineProperty(globalThis, 'google', oldGoogle)
    else Reflect.deleteProperty(globalThis, 'google')
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})

test('personal saves skip club access; both saves create four files and report partial destination success', async () => {
  const { savePouleToDestination, DestinationSaveError } =
    await import('../club-drive')
  const auth = new google.auth.OAuth2()
  let folderChecks = 0
  let failClub = false
  const writes: string[] = []
  auth.request = (async (options: any) => {
    if (options.method !== 'POST') {
      folderChecks++
      return {
        data: {
          mimeType: 'application/vnd.google-apps.folder',
          capabilities: { canAddChildren: true },
        },
      }
    }
    const chunks = []
    for await (const chunk of options.data) chunks.push(Buffer.from(chunk))
    const body = Buffer.concat(chunks).toString('latin1')
    if (failClub && body.includes(folders.pdfResults))
      throw new Error('Club unavailable')
    writes.push(body)
    return { data: { id: 'saved' } }
  }) as typeof auth.request
  const poule: Poule = {
    version: 1,
    id: '12345678-1234-4123-8123-123456789012',
    date: '2026-09-18',
    weapon: 'foil',
    fencers: ['One', 'Two'],
    bouts: [{ a: 0, b: 1, scoreA: 5, scoreB: 2 }],
    wheel: true,
    prize: '',
    prizeWinner: '',
  }
  await savePouleToDestination(poule, auth, 'personal')
  assert.equal(folderChecks, 0)
  assert.equal(writes.length, 2)
  assert.ok(writes.every((body) => !body.includes('"parents"')))
  writes.length = 0
  await savePouleToDestination(poule, auth, 'both')
  assert.equal(writes.length, 4)
  assert.ok(!writes[0].includes('"parents"'))
  assert.ok(!writes[1].includes('"parents"'))
  assert.ok(writes[2].includes(folders.pdfResults))
  assert.ok(writes[3].includes(folders.results))
  failClub = true
  await assert.rejects(
    savePouleToDestination(poule, auth, 'both'),
    (error) =>
      error instanceof DestinationSaveError &&
      error.message.includes('saved to your personal Drive'),
  )
})

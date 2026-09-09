import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())
async function main() {
  const { folders, listFiles, readPublished } = await import('../lib/club-drive')
  const { getGoogleAuthClient } = await import('../lib/google-auth')
  const { getFeaturedEvents } = await import('../lib/google-calendar')
  const { googleErrorSummary } = await import('../lib/google-error')
  const { publicationCutoff } = await import('../lib/tournament')
  for (const [kind, folder] of Object.entries(folders)) {
    try { console.log(JSON.stringify({ kind, count: (await listFiles(folder)).length, ok: true })) }
    catch (e) { console.log(JSON.stringify({ kind, ok: false, ...googleErrorSummary(e) })); process.exitCode = 1 }
  }
  const { GET: serveFile } = await import('../app/api/club-files/[id]/route')
  for (const [kind, id] of [['policy', '1ImVBJp79oYiL2AyWjlGkBnNnhgLXAf3N'], ['photo', '14IJtb3QATq5YANxbeS4BVvPpeO4YThdM']]) {
    const response = await serveFile(new Request(`http://localhost/api/club-files/${id}`), { params: { id } })
    console.log(JSON.stringify({ fileProxy: kind, status: response.status, contentType: response.headers.get('content-type'), bytes: (await response.arrayBuffer()).byteLength }))
    if (!response.ok) process.exitCode = 1
  }
  try {
    console.log(JSON.stringify({ publishedPoules: (await readPublished(publicationCutoff())).length }))
    // Check Calendar access explicitly as the public helper intentionally returns [] on failure.
    await getGoogleAuthClient().request({ url: `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || 'dufencing@gmail.com')}/events`, params: { maxResults: 1 } })
    console.log(JSON.stringify({ calendarReadable: true, featuredEvents: (await getFeaturedEvents()).map(e => ({ title: e.title, start: e.start.toISOString() })) }))
  } catch (e) { console.log(JSON.stringify({ ok: false, ...googleErrorSummary(e) })); process.exitCode = 1 }
}
main().catch(() => { console.log('Live check failed; credential details redacted.'); process.exitCode = 1 })

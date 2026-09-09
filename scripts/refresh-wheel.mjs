// Render schedules are UTC. Run at 09:00 and 10:00 UTC; only 10:00 Dublin publishes.
const now = new Date()
const parts = Object.fromEntries(
  new Intl.DateTimeFormat('en-IE', {
    timeZone: 'Europe/Dublin',
    weekday: 'short',
    hour: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(now)
    .map((p) => [p.type, p.value]),
)
if (parts.weekday === 'Sat' && parts.hour === '10') {
  if (!process.env.SITE_URL || !process.env.CRON_SECRET)
    throw new Error('SITE_URL and CRON_SECRET are required')
  const response = await fetch(
    new URL('/api/tournaments/refresh', process.env.SITE_URL),
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      signal: AbortSignal.timeout(120000),
    },
  )
  if (!response.ok)
    throw new Error(`Wheel publication failed: HTTP ${response.status}`)
  console.log(await response.text())
} else console.log('Skipped: outside 10am Dublin publication window.')

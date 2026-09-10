import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  generateBouts,
  standings,
  winners,
  validatePoule,
  publicationCutoff,
  weekFor,
  league,
  nameKey,
  type Poule,
} from '../tournament'
function fixture(): Poule {
  return {
    version: 1,
    id: '12345678-1234-4123-8123-123456789012',
    date: '2026-09-18',
    weapon: 'foil',
    fencers: ['Alex One', 'Sam Two', 'Robin Three'],
    bouts: [
      { a: 0, b: 1, scoreA: 5, scoreB: 2 },
      { a: 0, b: 2, scoreA: 3, scoreB: 5 },
      { a: 1, b: 2, scoreA: 5, scoreB: 4 },
    ],
    wheel: true,
    prize: '',
    prizeWinner: '',
  }
}
test('every pair fences exactly once for odd and even poule sizes', () => {
  for (let n = 2; n <= 20; n++) {
    const bouts = generateBouts(n)
    assert.equal(bouts.length, (n * (n - 1)) / 2)
    assert.equal(
      new Set(bouts.map((b) => [b.a, b.b].sort((a, b) => a - b).join(':')))
        .size,
      bouts.length,
    )
    for (let fencer = 0; fencer < n; fencer++)
      assert.equal(
        bouts.filter((b) => b.a === fencer || b.b === fencer).length,
        n - 1,
      )
  }
})
test('touch totals and indicators are correct and sum to zero', () => {
  const rows = standings(fixture())
  assert.deepEqual(
    rows.map((r) => [r.name, r.wins, r.ts, r.tr, r.indicator]),
    [
      ['Alex One', 1, 8, 7, 1],
      ['Robin Three', 1, 9, 8, 1],
      ['Sam Two', 1, 7, 9, -2],
    ].sort(
      (a, b) => Number(b[4]) - Number(a[4]) || Number(b[2]) - Number(a[2]),
    ),
  )
  assert.equal(
    rows.reduce((sum, r) => sum + r.indicator, 0),
    0,
  )
  assert.deepEqual(winners(fixture()), ['Robin Three'])
})
test('unplayed and tied draft bouts do not affect standings', () => {
  const p = fixture()
  p.bouts = [
    { a: 0, b: 1, scoreA: 0, scoreB: 0 },
    { a: 0, b: 2, scoreA: 5, scoreB: null },
  ]
  assert.ok(standings(p).every((r) => r.played === 0 && r.wins === 0))
})
test('exact ties share a poule win', () => {
  const p = fixture()
  p.bouts = [
    { a: 0, b: 1, scoreA: 5, scoreB: 3 },
    { a: 0, b: 2, scoreA: 3, scoreB: 5 },
    { a: 1, b: 2, scoreA: 5, scoreB: 3 },
  ]
  assert.equal(winners(p).length, 3)
})
test('server validation rejects incomplete, duplicate, out-of-range and tied bouts', () => {
  assert.doesNotThrow(() => validatePoule(fixture()))
  for (const score of [null, 6, -1, 1.5, 2]) {
    const p = fixture()
    p.bouts[0].scoreA = score
    assert.throws(() => validatePoule(p))
  }
  const duplicate = fixture()
  duplicate.bouts[1] = duplicate.bouts[0]
  assert.throws(() => validatePoule(duplicate))
  const names = fixture()
  names.fencers[1] = ' ALEX ONE '
  assert.throws(() => validatePoule(names))
  const date = fixture()
  date.date = '2026-02-30'
  assert.throws(() => validatePoule(date))
  const prize = fixture()
  prize.prize = 'Best salute'
  // Legacy prize metadata does not block a complete poule after prize entry was removed.
  assert.doesNotThrow(() => validatePoule(prize))
  assert.doesNotThrow(() => validatePoule(prize, false))
})
test('incomplete backups can be restored but cannot be published', () => {
  const p = fixture()
  p.bouts[0].scoreA = null
  assert.doesNotThrow(() => validatePoule(p, false))
  assert.throws(() => validatePoule(p))
})
test('league sums indicators within each weapon and merges consistently named fencers', () => {
  const p = fixture(),
    second = fixture()
  second.fencers[0] = 'alex one'
  const foil = league([p, second, { ...p, weapon: 'sabre' }], 'foil')
  assert.equal(foil.length, 3)
  assert.equal(foil.find((r) => nameKey(r.name) === 'alex_one')?.indicator, 2)
})
test('season covers 12 weeks and rejects results outside it', () => {
  assert.equal(weekFor('2026-09-17'), null)
  assert.equal(weekFor('2026-09-18'), 1)
  assert.equal(weekFor('2026-12-04'), 12)
  assert.equal(weekFor('2026-12-11'), null)
})
test('Saturday publication respects 10am Dublin and the October clock change', () => {
  assert.equal(
    publicationCutoff(new Date('2026-09-19T08:59:59Z')),
    '2026-09-12T09:00:00.000Z',
  )
  assert.equal(
    publicationCutoff(new Date('2026-09-19T09:00:00Z')),
    '2026-09-19T09:00:00.000Z',
  )
  assert.equal(
    publicationCutoff(new Date('2026-10-25T12:00:00Z')),
    '2026-10-24T09:00:00.000Z',
  )
  assert.equal(
    publicationCutoff(new Date('2026-10-31T09:59:59Z')),
    '2026-10-24T09:00:00.000Z',
  )
  assert.equal(
    publicationCutoff(new Date('2026-10-31T10:00:00Z')),
    '2026-10-31T10:00:00.000Z',
  )
  assert.equal(
    publicationCutoff(new Date('2026-12-05T10:00:00Z')),
    '2026-12-05T10:00:00.000Z',
  )
})

test('featured selection ignores title markers, expired events and partial words, and chooses closest future start', async () => {
  const { selectFeaturedEvents } = await import('../featured-events')
  const now = new Date('2026-09-08T12:00:00Z')
  const events = [
    {
      id: 'later',
      description: '<b>Featured</b>',
      start: new Date('2026-12-01'),
    },
    {
      id: 'closest',
      description: 'A FEATURED event',
      start: new Date('2026-09-09'),
    },
    { id: 'expired', description: 'Featured', start: new Date('2026-09-01') },
    { id: 'partial', description: 'unfeatured', start: new Date('2026-09-09') },
    { id: 'title-only', title: 'Featured', start: new Date('2026-09-09') },
  ]
  assert.deepEqual(
    selectFeaturedEvents(events, now).map((e) => e.id),
    ['closest', 'later'],
  )
  assert.deepEqual(selectFeaturedEvents([], now), [])
})

test('publication selects one revision per poule and preserves pre-cutoff results', async () => {
  const { selectPublishedPoules } = await import('../tournament')
  const original = { ...fixture(), savedAt: '2026-09-18T20:00:00Z' }
  const correction = {
    ...fixture(),
    savedAt: '2026-09-19T11:00:00Z',
    prize: 'Best salute',
    prizeWinner: 'Alex One',
  }
  const early = selectPublishedPoules(
    [correction, original, original],
    '2026-09-19T09:00:00Z',
  )
  assert.equal(early.length, 1)
  assert.equal(early[0].prize, '')
  assert.equal(
    selectPublishedPoules([original, correction], '2026-09-26T09:00:00Z')[0]
      .prize,
    'Best salute',
  )
  assert.equal(
    selectPublishedPoules(
      [original, { ...correction, wheel: false }],
      '2026-09-26T09:00:00Z',
    ).length,
    0,
  )
  assert.equal(
    selectPublishedPoules(
      [{ ...original, savedAt: 'invalid' }],
      '2026-09-19T09:00:00Z',
    ).length,
    0,
  )
  assert.equal(
    selectPublishedPoules(
      [{ ...original, date: '2026-09-25' }],
      '2026-09-19T09:00:00Z',
    ).length,
    0,
  )
})

test('downloaded results are complete, dated and readable by league ingestion', async () => {
  const { resultDownload } = await import('../tournament')
  const exported = resultDownload(fixture(), new Date('2026-09-18T20:00:00Z'))
  assert.match(exported.filename, /^2026-09-18_foil_/)
  const parsed = JSON.parse(exported.content)
  assert.equal(parsed.savedAt, '2026-09-18T20:00:00.000Z')
  assert.deepEqual(validatePoule(parsed), fixture())
  assert.deepEqual(parsed.standings, standings(fixture()))
  const unfinished = fixture()
  unfinished.bouts[0].scoreA = null
  assert.throws(() => resultDownload(unfinished))
})

test('Google errors do not disclose request credentials', async () => {
  const { googleErrorSummary } = await import('../google-error')
  const error = {
    response: {
      status: 403,
      config: { headers: { Authorization: 'Bearer secret-test-value' } },
      data: {
        error: { message: 'sensitive-details', status: 'PERMISSION_DENIED' },
      },
    },
  }
  assert.deepEqual(googleErrorSummary(error), {
    status: 403,
    reason: 'PERMISSION_DENIED',
  })
})

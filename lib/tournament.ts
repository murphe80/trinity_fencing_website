export const WEAPONS = ['foil', 'epee', 'sabre'] as const
export type Weapon = (typeof WEAPONS)[number]
export const weaponLabel = { foil: 'Foil', epee: 'Épée', sabre: 'Sabre' }
export type Bout = {
  a: number
  b: number
  scoreA: number | null
  scoreB: number | null
}
export type Poule = {
  version: 1
  id: string
  date: string
  weapon: Weapon
  fencers: string[]
  bouts: Bout[]
  wheel: boolean
  prize: string
  prizeWinner: string
  savedAt?: string
}
export const nameKey = (name: string) =>
  name.trim().normalize('NFC').toLowerCase().replace(/\s+/g, '_')
export function generateBouts(count: number): Bout[] {
  const ring = Array.from({ length: count + (count % 2) }, (_, i) =>
    i < count ? i : -1,
  )
  const bouts: Bout[] = []
  for (let round = 0; round < ring.length - 1; round++) {
    for (let i = 0; i < ring.length / 2; i++) {
      const a = ring[i],
        b = ring[ring.length - 1 - i]
      if (a >= 0 && b >= 0) bouts.push({ a, b, scoreA: null, scoreB: null })
    }
    ring.splice(1, 0, ring.pop()!)
  }
  return bouts
}
export function standings(poule: Poule) {
  const rows = poule.fencers.map((name) => ({
    name,
    wins: 0,
    played: 0,
    ts: 0,
    tr: 0,
    indicator: 0,
  }))
  for (const bout of poule.bouts) {
    if (
      bout.scoreA === null ||
      bout.scoreB === null ||
      bout.scoreA === bout.scoreB
    )
      continue
    const a = rows[bout.a],
      b = rows[bout.b]
    a.played++
    b.played++
    a.ts += bout.scoreA
    a.tr += bout.scoreB
    b.ts += bout.scoreB
    b.tr += bout.scoreA
    if (bout.scoreA > bout.scoreB) a.wins++
    else b.wins++
  }
  return rows
    .map((row) => ({ ...row, indicator: row.ts - row.tr }))
    .sort(
      (a, b) =>
        b.wins / (b.played || 1) - a.wins / (a.played || 1) ||
        b.indicator - a.indicator ||
        b.ts - a.ts ||
        a.name.localeCompare(b.name),
    )
}
export function winners(poule: Poule) {
  const rows = standings(poule),
    top = rows[0]
  return rows
    .filter(
      (row) =>
        row.wins === top.wins &&
        row.indicator === top.indicator &&
        row.ts === top.ts,
    )
    .map((row) => row.name)
}
export function weekFor(date: string) {
  const days =
    (Date.parse(date + 'T12:00:00Z') - Date.parse('2026-09-18T12:00:00Z')) /
    86400000
  return days >= 0 && days < 84 ? Math.floor(days / 7) + 1 : null
}
export function dublinParts(now: Date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Dublin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
}
export function publicationCutoff(now = new Date()) {
  const p = dublinParts(now)
  const date = new Date(`${p.year}-${p.month}-${p.day}T12:00:00Z`)
  let days = (date.getUTCDay() + 1) % 7
  if (days === 0 && Number(p.hour) < 10) days = 7
  date.setUTCDate(date.getUTCDate() - days)
  const summer =
    Number(
      new Intl.DateTimeFormat('en', {
        timeZone: 'Europe/Dublin',
        hour: '2-digit',
        hourCycle: 'h23',
      }).format(date),
    ) === 13
  return (
    date.toISOString().slice(0, 10) +
    (summer ? 'T09:00:00.000Z' : 'T10:00:00.000Z')
  )
}
export function validatePoule(value: unknown, complete = true): Poule {
  if (!value || typeof value !== 'object') throw new Error('Invalid poule.')
  const p = value as Poule
  if (
    p.version !== 1 ||
    !/^[a-f0-9-]{36}$/i.test(p.id) ||
    !WEAPONS.includes(p.weapon)
  )
    throw new Error('Invalid poule identity or weapon.')
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(p.date) ||
    !Number.isFinite(Date.parse(p.date)) ||
    new Date(p.date).toISOString().slice(0, 10) !== p.date
  )
    throw new Error('Choose a valid date.')
  if (
    !Array.isArray(p.fencers) ||
    p.fencers.length < 2 ||
    p.fencers.length > 20 ||
    p.fencers.some(
      (n) => typeof n !== 'string' || !n.trim() || n.length > 80,
    ) ||
    new Set(p.fencers.map(nameKey)).size !== p.fencers.length
  )
    throw new Error(
      'Enter 2–20 unique fencers (maximum 80 characters per name).',
    )

  const expected = generateBouts(p.fencers.length)
  if (!Array.isArray(p.bouts) || p.bouts.length !== expected.length)
    throw new Error('The poule must contain every pairing.')
  const pairs = new Set<string>()
  for (const b of p.bouts) {
    if (
      !Number.isInteger(b.a) ||
      !Number.isInteger(b.b) ||
      b.a < 0 ||
      b.b < 0 ||
      b.a >= p.fencers.length ||
      b.b >= p.fencers.length ||
      b.a === b.b
    )
      throw new Error('Invalid pairing.')
    const key = [b.a, b.b].sort((a, b) => a - b).join(':')
    if (pairs.has(key)) throw new Error('Duplicate pairing.')
    pairs.add(key)
    if (
      ![b.scoreA, b.scoreB].every(
        (s) =>
          (!complete && s === null) ||
          (Number.isInteger(s) && s !== null && s >= 0 && s <= 5),
      ) ||
      (complete && b.scoreA === b.scoreB)
    )
      throw new Error(
        'Complete every bout with unequal scores from 0–5. Timed bouts may finish below 5.',
      )
  }
  return {
    version: 1,
    id: p.id,
    date: p.date,
    weapon: p.weapon,
    fencers: p.fencers.map((n) => n.trim()),
    bouts: p.bouts.map((b) => ({
      a: b.a,
      b: b.b,
      scoreA: b.scoreA,
      scoreB: b.scoreB,
    })),
    wheel: p.wheel,
    prize: p.prize.trim(),
    prizeWinner: p.prizeWinner.trim(),
  }
}
export function league(poules: Poule[], weapon: Weapon) {
  const entries = new Map<
    string,
    { name: string; indicator: number; played: number; wins: number }
  >()
  for (const poule of poules.filter((p) => p.weapon === weapon))
    for (const row of standings(poule)) {
      const key = nameKey(row.name),
        entry = entries.get(key) ?? {
          name: row.name,
          indicator: 0,
          played: 0,
          wins: 0,
        }
      entry.indicator += row.indicator
      entry.played += row.played
      entry.wins += row.wins
      entries.set(key, entry)
    }
  return [...entries.values()].sort(
    (a, b) => b.indicator - a.indicator || a.name.localeCompare(b.name),
  )
}

/** Select the newest revision available at publication time, then apply league eligibility. */
export function selectPublishedPoules(poules: Poule[], cutoff: string) {
  const latest = new Map<string, Poule>()
  for (const poule of poules) {
    const saved = Date.parse(poule.savedAt ?? '')
    if (!Number.isFinite(saved) || saved > Date.parse(cutoff)) continue
    const previous = latest.get(poule.id)
    if (!previous || saved > Date.parse(previous.savedAt!))
      latest.set(poule.id, poule)
  }
  return [...latest.values()].filter(
    (p) => p.wheel && p.date < cutoff.slice(0, 10) && weekFor(p.date) !== null,
  )
}

export function resultDownload(value: unknown, now = new Date()) {
  const poule = validatePoule(value)
  const savedAt = now.toISOString()
  return {
    filename: `${poule.date}_${poule.weapon}_${poule.id}_${savedAt.replace(/[:.]/g, '-')}.json`,
    content: JSON.stringify(
      { ...poule, savedAt, standings: standings(poule) },
      null,
      2,
    ),
  }
}

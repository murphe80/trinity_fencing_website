'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  league,
  publicationCutoff,
  nameKey,
  WEAPONS,
  weaponLabel,
  weekFor,
  winners,
  type Poule,
  type Weapon,
} from '@/lib/tournament'
export default function WheelLeague({
  poules,
  photos,
  cutoff,
  unavailable,
}: {
  poules: Poule[]
  photos: Record<string, string>
  cutoff: string
  unavailable: boolean
}) {
  const [weapon, setWeapon] = useState<Weapon>('foil'),
    [week, setWeek] = useState('all'),
    [rotation, setRotation] = useState(0)
  const router = useRouter()
  useEffect(() => {
    const timer = setInterval(() => {
      if (publicationCutoff() !== cutoff) router.refresh()
    }, 60000)
    return () => clearInterval(timer)
  }, [cutoff, router])
  const rows = league(poules, weapon)
  const archive = poules
    .filter(
      (p) =>
        p.weapon === weapon &&
        (week === 'all' || weekFor(p.date) === Number(week)),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
  function portrait(name: string, size = 44) {
    const src = photos[nameKey(name)]
    return src ? (
      <Image
        unoptimized
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover aspect-square bg-cream"
      />
    ) : (
      <span
        style={{ width: size, height: size }}
        className="rounded-full bg-red-light text-red flex shrink-0 items-center justify-center font-heading text-xl"
        aria-hidden="true"
      >
        {name
          .split(/\s+/)
          .map((n) => n[0])
          .slice(0, 2)
          .join('')}
      </span>
    )
  }
  return (
    <>
      <section className="relative bg-black text-white pt-28 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.5fr_1fr] gap-10 items-center">
          <div>
            <h1 className="font-heading text-6xl md:text-8xl mt-5">
              The Wheel
              <br />
              <span className="italic text-gold">Tournament</span>
            </h1>
            <p className="text-white/70 text-lg mt-6 max-w-xl">
              Fun weekly tournaments with weekly and end-of-season prizes!
            </p>
            <p className="mt-6 text-sm text-white/70">
              Fridays 5-7pm, Ancillary Hall
            </p>
            <a
              href="/tournaments/poule-tracker"
              className="club-button inline-block mt-8"
            >
              Start a poule ↗
            </a>
          </div>
          <div className="text-center">
            <button
              onClick={() =>
                setRotation((r) => r + 180 + Math.floor(Math.random() * 360))
              }
              aria-label="Spin the decorative wheel"
              className="relative rounded-full w-56 h-56 sm:w-72 sm:h-72 border-8 border-gold shadow-2xl mx-auto transition-transform duration-1000"
              style={{
                transform: `rotate(${rotation}deg)`,
                background:
                  'conic-gradient(#C8102E 0deg 60deg,#F9F6F1 60deg 120deg,#1A1A1A 120deg 180deg,#C8102E 180deg 240deg,#F9F6F1 240deg 300deg,#1A1A1A 300deg 360deg)',
              }}
            >
              <span className="absolute inset-0 m-auto w-24 h-24 rounded-full border-4 border-gold bg-black flex items-center justify-center font-heading text-2xl">
                DUFC
              </span>
            </button>
            <p className="mt-6 text-xs text-white/60">
              Give it a spin! The real wheel decides Friday’s challenge
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {unavailable && (
          <p role="status" className="club-notice mb-8">
            Tournament results are temporarily unavailable. Please try again
            later.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-5 border-b border-black/10 pb-6">
          <div className="flex gap-2" aria-label="Weapon league">
            {WEAPONS.map((w) => (
              <button
                key={w}
                aria-pressed={weapon === w}
                className={weapon === w ? 'club-button' : 'club-secondary'}
                onClick={() => setWeapon(w)}
              >
                {weaponLabel[w]}
              </button>
            ))}
          </div>
        </div>
        <section className="mt-10">
          <p className="eyebrow">The overall league</p>
          <h2 className="font-heading text-4xl mt-3">
            {weaponLabel[weapon]} standings
          </h2>
          <p className="text-grey-dark mt-3">
            League points = total touches scored − total touches received
          </p>
          {!unavailable && rows.length > 0 && (
            <div className="grid md:grid-cols-3 gap-5 my-8">
              {rows.slice(0, 3).map((r, i) => (
                <div
                  key={r.name}
                  className={`club-card ${i === 0 ? '!border-gold !bg-black text-white' : ''}`}
                >
                  <p className="eyebrow !text-gold">
                    Rank{' '}
                    {rows.findIndex(
                      (other) => other.indicator === r.indicator,
                    ) + 1}
                  </p>
                  <div className="flex items-center gap-4 mt-5">
                    {portrait(r.name, 60)}
                    <h3 className="font-heading text-2xl">{r.name}</h3>
                  </div>
                  <p className="font-heading text-5xl mt-5">
                    {r.indicator > 0 ? '+' : ''}
                    {r.indicator}
                    <span className="font-body text-sm ml-3 opacity-60">
                      points
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
          {!unavailable &&
            (rows.length ? (
              <div className="club-card overflow-x-auto mt-8">
                <table className="club-table">
                  <caption className="sr-only">
                    {weaponLabel[weapon]} league table
                  </caption>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Fencer</th>
                      <th>Bouts</th>
                      <th>Victories</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.name}>
                        <td>
                          {rows.findIndex(
                            (other) => other.indicator === r.indicator,
                          ) + 1}
                        </td>
                        <th scope="row">
                          <div className="flex items-center gap-3">
                            {portrait(r.name)}
                            {r.name}
                          </div>
                        </th>
                        <td>{r.played}</td>
                        <td>{r.wins}</td>
                        <td className="font-bold text-red">
                          {r.indicator > 0 ? '+' : ''}
                          {r.indicator}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="club-card mt-8">
                <h3 className="font-heading text-3xl">No published results yet</h3>
                <p className="mt-3 text-grey-dark">
                  No published {weaponLabel[weapon].toLowerCase()} results yet.
                  The first update is Saturday 19 September at 10am.
                </p>
              </div>
            ))}
        </section>
        <section className="mt-16">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div>
              <h2 className="font-heading text-4xl mt-3">Weekly winners</h2>
            </div>
            <label className="text-sm">
              Show week
              <select
                className="club-input"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
              >
                <option value="all">All 12 weeks</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    Week {i + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            {archive.map((p) => (
              <article key={p.id} className="club-card">
                <p className="eyebrow">
                  Week {weekFor(p.date)} · {p.date}
                </p>
                <h3 className="font-heading text-3xl mt-4">
                  {weaponLabel[p.weapon]} poule
                </h3>
                <p className="text-xs uppercase tracking-widest text-grey-dark mt-6">
                  Poule {winners(p).length > 1 ? 'winners' : 'winner'}
                </p>
                <p className="font-heading text-2xl mt-2">
                  {winners(p).join(' & ')}
                </p>
                <div className="border-t border-black/10 mt-5 pt-5">
                  <p className="text-xs uppercase tracking-widest text-red">
                    The wheel’s choice
                  </p>
                  <p className="font-heading text-2xl mt-2">
                    {p.prize || 'Prize not recorded'}
                  </p>
                  {p.prizeWinner && (
                    <p className="mt-2 text-grey-dark">
                      Awarded to {p.prizeWinner}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!unavailable && !archive.length && (
            <p className="mt-6 text-grey-dark">
              No weekly winners published for this selection yet.
            </p>
          )}
        </section>
      </div>
    </>
  )
}

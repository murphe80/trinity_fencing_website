'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import PoulePrint from './PoulePrint'
import {
  generateBouts,
  standings,
  validatePoule,
  WEAPONS,
  weaponLabel,
  dublinParts,
  type Poule,
  type Weapon,
} from '@/lib/tournament'
const STORAGE = 'dufc-poule-draft-v1'
export default function PouleTracker() {
  const [names, setNames] = useState(''),
    [weapon, setWeapon] = useState<Weapon>('foil'),
    [date, setDate] = useState('')
  const [poule, setPoule] = useState<Poule | null>(null),
    [connected, setConnected] = useState(false),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false)
  useEffect(() => {
    const p = dublinParts(new Date())
    setDate(`${p.year}-${p.month}-${p.day}`)
    try {
      const saved = localStorage.getItem(STORAGE)
      if (saved) {
        const draft = JSON.parse(saved)
        validatePoule(draft, false)
        setPoule({ ...draft, prize: '', prizeWinner: '' })
        setMessage('Your previous poule draft has been restored.')
      }
    } catch {
      setMessage('The saved draft could not be restored. Start a new poule.')
    }
    const outcome = new URLSearchParams(window.location.search).get('google')
    if (outcome) {
      const messages: Record<string, string> = {
        connected:
          'Google connected. Your draft is ready: select Save results to Drive.',
        cancelled:
          'Google sign-in cancelled. You can still download your results.',
        permission:
          'Use a Google account with Editor access to the club’s PDF and JSON results folders.',
        scope:
          'Drive permission is needed to upload results. Try connecting again.',
      }
      setMessage(
        messages[outcome] || 'Google could not connect. Please try again.',
      )
      window.history.replaceState(null, '', window.location.pathname)
    }
    fetch('/api/auth/google/status')
      .then((r) => r.json())
      .then((s) => setConnected(s.connected))
      .catch(() => {})
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    try {
      if (poule) localStorage.setItem(STORAGE, JSON.stringify(poule))
      else localStorage.removeItem(STORAGE)
    } catch {
      setMessage(
        'Browser storage is unavailable. Complete the poule and download the results before leaving this page.',
      )
    }
  }, [poule, ready])
  function create() {
    const fencers = names
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean)
    if (fencers.length < 2 || fencers.length > 20) {
      setMessage('Enter 2–20 fencers.')
      return
    }
    const draft: Poule = {
      version: 1,
      id: crypto.randomUUID(),
      date,
      weapon,
      fencers,
      bouts: generateBouts(fencers.length),
      wheel: false,
      prize: '',
      prizeWinner: '',
    }
    try {
      validatePoule({
        ...draft,
        bouts: draft.bouts.map((b) => ({ ...b, scoreA: 5, scoreB: 0 })),
      })
      setPoule(draft)
      setMessage('Poule ready. Enter scores as each bout finishes.')
    } catch (error) {
      setMessage((error as Error).message)
    }
  }
  async function download() {
    setBusy(true)
    try {
      validatePoule(poule)
      const response = await fetch('/api/poules/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poule),
      })
      if (!response.ok) throw new Error((await response.json()).error)
      const url = URL.createObjectURL(await response.blob())
      const a = document.createElement('a')
      a.href = url
      a.download = `${poule!.date}_${poule!.weapon}_poule-results.pdf`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMessage('PDF downloaded with the bout list and poule grid.')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy(false)
    }
  }
  async function save() {
    setBusy(true)
    try {
      validatePoule(poule)
      if (!connected) {
        const status = await fetch('/api/auth/google/status').then((response) =>
          response.json(),
        )
        if (!status.configured)
          throw new Error(
            'Google uploads are not configured on this website yet. You can download your results instead.',
          )
        localStorage.setItem(STORAGE, JSON.stringify(poule))
        window.location.assign('/api/auth/google/start')
        return
      }
      const response = await fetch('/api/poules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(poule),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.reconnect) setConnected(false)
        throw new Error(result.error)
      }
      setMessage(
        `Saved PDF and JSON to their Drive folders. Wheel standings publish on Saturday at 10am.`,
      )
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy(false)
    }
  }
  const rows = poule ? standings(poule) : [],
    complete =
      poule?.bouts.filter(
        (b) => b.scoreA !== null && b.scoreB !== null && b.scoreA !== b.scoreB,
      ).length ?? 0
  return (
    <div>
      <p
        role="status"
        aria-live="polite"
        className={message ? 'club-notice mb-6' : 'sr-only'}
      >
        {message}
      </p>
      {ready &&
        poule &&
        createPortal(<PoulePrint poule={poule} />, document.body)}
      {!poule ? (
        <section className="club-card max-w-3xl">
          <h2 className="font-heading text-3xl">Set up your poule</h2>
          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            <label>
              Weapon
              <select
                className="club-input"
                value={weapon}
                onChange={(e) => setWeapon(e.target.value as Weapon)}
              >
                {WEAPONS.map((w) => (
                  <option key={w} value={w}>
                    {weaponLabel[w]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                className="club-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>
          <label className="block mt-6">
            Fencers{' '}
            <span className="text-grey-dark text-sm">
              — one full name per line, 2–20 fencers
            </span>
            <textarea
              className="club-input min-h-52"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder={'First name Last name\nFirst name Last name'}
            />
          </label>
          <p className="text-sm text-grey-dark mt-3">
            Use the same full name every week so league points and profile
            photos stay connected. Names and scores are saved in this browser
            until you start a new poule.
          </p>
          <button
            className="club-button mt-6"
            onClick={create}
            disabled={!ready}
          >
            Generate bouts →
          </button>
        </section>
      ) : (
        <>
          <div className="club-card mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">
                {weaponLabel[poule.weapon]} · {poule.date}
              </p>
              <h2 className="font-heading text-3xl mt-2">
                {complete} / {poule.bouts.length} bouts complete
              </h2>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                className="club-secondary"
                onClick={download}
                disabled={busy}
              >
                Download results (PDF)
              </button>
              <button className="club-secondary" onClick={() => window.print()}>
                Print sheet
              </button>
              <button
                className="club-secondary"
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      'Start a new poule? Download the completed results first if you need to keep this poule.',
                    )
                  ) {
                    setPoule(null)
                    setMessage('')
                  }
                }}
              >
                New poule
              </button>
            </div>
            <progress
              className="w-full accent-red"
              value={complete}
              max={poule.bouts.length}
              aria-label="Completed bouts"
            />
          </div>
          <div className="grid xl:grid-cols-[1.15fr_1fr] gap-6 items-start">
            <section className="club-card">
              <h2 className="font-heading text-3xl">On the piste</h2>
              <p className="text-sm text-grey-dark mt-2 mb-6">
                Scores are out of 5. For a timed bout, enter the final
                score.
              </p>
              <div className="space-y-3">
                {poule.bouts.map((b, i) => (
                  <fieldset
                    key={`${b.a}-${b.b}`}
                    disabled={busy}
                    className="border border-black/10 rounded-lg p-3"
                  >
                    <legend className="px-1 text-xs text-grey-dark">
                      Bout {i + 1}
                      {b.scoreA !== null && b.scoreA === b.scoreB
                        ? ' · Resolve the tie'
                        : ''}
                    </legend>
                    <div className="grid grid-cols-[1fr_4rem_1rem_4rem_1fr] gap-2 items-center text-sm">
                      <span className="break-words">{poule.fencers[b.a]}</span>
                      {(['scoreA', 'scoreB'] as const).map((side, index) => (
                        <span key={side} className="contents">
                          {index === 1 && <span aria-hidden="true">:</span>}
                          <input
                            className="club-input !mt-0 text-center !px-1"
                            aria-label={`Bout ${i + 1}, ${poule.fencers[side === 'scoreA' ? b.a : b.b]} score`}
                            type="number"
                            min={0}
                            max={5}
                            step={1}
                            value={b[side] ?? ''}
                            onChange={(e) => {
                              const value =
                                e.target.value === ''
                                  ? null
                                  : Number(e.target.value)
                              if (
                                value !== null &&
                                (!Number.isInteger(value) ||
                                  value < 0 ||
                                  value > 5)
                              )
                                return
                              setPoule({
                                ...poule,
                                bouts: poule.bouts.map((bout, j) =>
                                  j === i ? { ...bout, [side]: value } : bout,
                                ),
                              })
                            }}
                          />
                        </span>
                      ))}
                      <span className="text-right break-words">
                        {poule.fencers[b.b]}
                      </span>
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>
            <div className="space-y-6">
              <section className="club-card overflow-hidden">
                <h2 className="font-heading text-3xl">Live standings</h2>
                <div className="overflow-x-auto mt-6">
                  <table className="club-table">
                    <caption className="sr-only">Poule standings</caption>
                    <thead>
                      <tr>
                        {['Fencer', 'V', 'B', 'TS', 'TR', 'Ind'].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.name}>
                          <th scope="row">{r.name}</th>
                          <td>{r.wins}</td>
                          <td>{r.played}</td>
                          <td>{r.ts}</td>
                          <td>{r.tr}</td>
                          <td className="font-bold text-red">
                            {r.indicator > 0 ? '+' : ''}
                            {r.indicator}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-grey-dark mt-4">
                  V: victories · B: bouts · TS/TR: touches scored/received.
                  Ranked by victories, then indicator.
           
                </p>
              </section>
              <details className="club-card">
                <summary className="font-heading text-2xl cursor-pointer">
                  Poule sheet grid
                </summary>
                <div className="overflow-auto mt-4">
                  <table className="club-table">
                    <thead>
                      <tr>
                        <th>Fencer</th>
                        {poule.fencers.map((n, i) => (
                          <th key={n} title={n}>
                            {i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {poule.fencers.map((n, i) => (
                        <tr key={n}>
                          <th>
                            {i + 1}. {n}
                          </th>
                          {poule.fencers.map((_, j) => {
                            const b = poule.bouts.find(
                              (b) =>
                                (b.a === i && b.b === j) ||
                                (b.a === j && b.b === i),
                            )
                            return (
                              <td
                                key={j}
                                className={i === j ? 'bg-black text-white' : ''}
                              >
                                {i === j
                                  ? '—'
                                  : ((b?.a === i ? b.scoreA : b?.scoreB) ??
                                    '·')}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
              <section className="club-card">
                <h2 className="font-heading text-3xl">Finish & save</h2>
                <fieldset disabled={busy}>
                  <label className="flex gap-3 mt-5 items-center">
                    <input
                      type="checkbox"
                      checked={poule.wheel}
                      onChange={(e) =>
                        setPoule({ ...poule, wheel: e.target.checked })
                      }
                      className="accent-red w-5 h-5"
                    />
                    Count towards The Wheel Tournament
                  </label>
                  <p className="text-sm text-grey-dark mt-5">
                    Save using a Google account with permission to edit the club's poule results folder. To request access, please contact murphe80@tcd.ie
                  </p>
                  {connected && (
                    <button
                      className="underline text-sm mt-3"
                      type="button"
                      onClick={async () => {
                        const response = await fetch(
                          '/api/auth/google/disconnect',
                          { method: 'POST' },
                        )
                        if (response.ok) {
                          setConnected(false)
                          setMessage('Google disconnected from this browser.')
                        } else
                          setMessage('Could not disconnect. Please try again.')
                      }}
                    >
                      Disconnect Google
                    </button>
                  )}
                  <button
                    className="club-button mt-6 w-full"
                    disabled={busy || complete !== poule.bouts.length}
                    onClick={save}
                  >
                    {busy
                      ? 'Saving…'
                      : connected
                        ? 'Save results to Drive'
                        : 'Connect Google to save results'}
                  </button>
                </fieldset>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

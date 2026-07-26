import type { Metadata } from 'next'
import PageHeroWatermark from '@/components/layout/PageHeroWatermark'
import AchievementsClient from '@/components/achievements/AchievementsClient'
import OlympiansSection from '@/components/achievements/OlympiansSection'
import { getAchievements } from '@/lib/google-sheets'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Achievements',
  description: "A record of DUFC's competitive highlights, season by season.",
}

const PINKS_RECIPIENTS: { name: string; year: number; note?: string }[] = [
  { name: 'J. M. Stubbs', year: 1952 },
  { name: 'M. A. H. McCausland', year: 1953 },
  { name: 'Alistair Gordon Taylor', year: 1954 },
  { name: 'John Howard English', year: 1957 },
  { name: 'Malcom Richard Boyd', year: 1959 },
  { name: 'Brian Michael Carew Hamilton', year: 1960 },
  { name: 'Christopher Francis Rye', year: 1961 },
  { name: 'John James Michael Laud Robinson', year: 1963 },
  { name: 'Vernon Walter Fowler Armstrong', year: 1964 },
  { name: 'Penelope Mary Johnston Greene', year: 1965 },
  { name: "Colm Murrough Vere O'Brien", year: 1966 },
  { name: 'Paul Nicholson', year: 1967 },
  { name: 'William Andrew Lambert Heaton', year: 1970 },
  { name: 'Sean Gillespie', year: 1972 },
  { name: 'Richard George Booth', year: 1976 },
  { name: 'Nial Charles Ferguson', year: 1980 },
  { name: 'Marcus Joseph Austin', year: 1980 },
  { name: 'Catherine Patricia Ridge', year: 1983 },
  { name: 'Richard John Mitchell', year: 1984 },
  { name: 'Mark Davis', year: 1984 },
  { name: 'Richard John Mulkeen', year: 1988 },
  { name: "Síle O'Connor", year: 1990 },
  { name: 'Paul John Thomas Bouchier-Hayes', year: 1998 },
  { name: 'Kate Harvey', year: 2006 },
  { name: 'David DelanyCahill', year: 2008 },
  { name: 'Colm Nouvian-Flynn', year: 2008 },
  { name: 'Kate Harvey', year: 2008 },
  { name: 'Lachlan Sykes', year: 2008 },
  { name: 'Louis Arron', year: 2010 },
  { name: 'Maria Treacy', year: 2010 },
  { name: "Hannah Lowry-O'Reilly", year: 2011 },
  { name: 'Maxton Milner', year: 2015 },
  { name: 'Phillip Cripwell', year: 2016 },
  { name: 'Lucy Johnson', year: 2016 },
  { name: 'Camille Boelt Hindsgaul', year: 2018 },
  { name: 'Tadhg Garton', year: 2018 },
  { name: 'Sam Mitchell', year: 2019 },
  { name: 'Ross Byrne', year: 2019 },
  { name: 'Manon Nouvian-Flynn', year: 2020 },
  { name: 'William Silvain Michael Mac Donald Hughes', year: 2024 },
  { name: 'Liam John Davidson Zone', year: 2025 },
  { name: 'Katie Lynch', year: 2025 },
  { name: 'Eoghan O hAnluain Fay', year: 2026 },
]

export default async function AchievementsPage() {
  const achievements = await getAchievements()

  return (
    <div className="bg-cream min-h-screen">
      {/* Page hero */}
      <div className="bg-black relative overflow-hidden">
        <PageHeroWatermark />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
            Achievements
          </h1>
          <p className="font-body text-white/60 mt-3 text-lg">
            A record of DUFC&apos;s competitive highlights
          </p>
        </div>
      </div>

      <AchievementsClient achievements={achievements} />
        {/* Pinks Recipients */}
        <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PinksSection />
        </div>
      </section>

      <OlympiansSection />

    </div>
  )
}

// Uses native HTML <details> — no JS needed, works as a server component
function PinksSection() {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none flex items-center gap-3 font-heading text-xl text-black hover:text-red transition-colors">
        <span>DUCAC Pinks Recipients</span>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          className="transition-transform duration-200 group-open:rotate-180"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>

      <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-grey-light">
            <tr>
              <th className="text-left px-5 py-3 text-grey-dark font-medium">Name</th>
              <th className="text-left px-5 py-3 text-grey-dark font-medium">Year</th>
              <th className="text-left px-5 py-3 text-grey-dark font-medium hidden sm:table-cell">Note</th>
            </tr>
          </thead>
          <tbody>
            {PINKS_RECIPIENTS.map((r, i) => (
              <tr key={r.name} className={i % 2 === 0 ? 'bg-white' : 'bg-grey-light/50'}>
                <td className="px-5 py-3 font-medium text-black">{r.name}</td>
                <td className="px-5 py-3 text-grey-dark">{r.year}</td>
                <td className="px-5 py-3 text-grey-mid hidden sm:table-cell">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

import type { Metadata } from 'next'
import PersonCard from '@/components/members/PersonCard'
import CoachCard from '@/components/members/CoachCard'
import { getCommitteeMembers, getCoach, getHonoraryMembers } from '@/lib/google-sheets'

export const revalidate = 21600

export const metadata: Metadata = {
  title: 'The Club',
  description: 'Meet the DUFC committee, coach, and honorary members.',
}

const ALUMNI_CAPTAINS = [
  { year: '2024/25', captain: 'Liam Zone', womensCaptain: 'Aoife Ryan' },
  { year: '2023/24', captain: 'Ciarán Walsh', womensCaptain: 'Emma Murphy' },
  { year: '2022/23', captain: 'Tom Keane', womensCaptain: 'Sophie Brennan' },
  { year: '2021/22', captain: 'Ben Murray', womensCaptain: 'Katie Lynch' },
  { year: '2020/21', captain: 'Jack Doyle', womensCaptain: 'Niamh Burke' },
  { year: '2019/20', captain: 'Roisín Forde', womensCaptain: 'Sarah Healy' },
  { year: '2018/19', captain: 'Michael Stafford', womensCaptain: 'Orla Quinn' },
  { year: '2017/18', captain: 'Declan Hayes', womensCaptain: 'Ciara Byrne' },
]

export default async function MembersPage() {
  const [committee, coach, honorary] = await Promise.all([
    getCommitteeMembers(),
    getCoach(),
    getHonoraryMembers(),
  ])

  return (
    <div className="bg-cream min-h-screen">
      {/* Page hero */}
      <div className="bg-black relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-5 pointer-events-none select-none">
          <span className="font-heading text-white text-[20rem] font-bold leading-none">D</span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
            The Club
          </h1>
          <p className="font-body text-white/60 mt-3 text-lg">
            Meet the people who make DUFC what it is.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Coach */}
        {coach && (
          <section>
            <h2 className="font-heading text-3xl font-semibold text-black mb-6">Coaching Staff</h2>
            <CoachCard coach={coach} />
          </section>
        )}

        {/* Committee */}
        {committee.length > 0 && (
          <section>
            <h2 className="font-heading text-3xl font-semibold text-black mb-6">
              Current Committee
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {committee.map(member => (
                <PersonCard key={member.name} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Honorary Members */}
        {honorary.length > 0 && (
          <section>
            <h2 className="font-heading text-3xl font-semibold text-black mb-4">
              Honorary Members
            </h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm font-body">
                <thead className="bg-grey-light">
                  <tr>
                    <th className="text-left px-5 py-3 text-grey-dark font-medium">Name</th>
                    <th className="text-left px-5 py-3 text-grey-dark font-medium">Year Awarded</th>
                    <th className="text-left px-5 py-3 text-grey-dark font-medium hidden sm:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {honorary.map((m, i) => (
                    <tr key={m.name} className={i % 2 === 0 ? 'bg-white' : 'bg-grey-light/50'}>
                      <td className="px-5 py-3 font-medium text-black">{m.name}</td>
                      <td className="px-5 py-3 text-grey-dark">{m.yearAwarded}</td>
                      <td className="px-5 py-3 text-grey-mid hidden sm:table-cell">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Alumni Captains */}
        <section>
          <details className="group">
            <summary className="cursor-pointer list-none flex items-center gap-3 font-heading text-xl text-black hover:text-red transition-colors">
              <span>Club Captains (2018–present)</span>
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
                    <th className="text-left px-5 py-3 text-grey-dark font-medium">Year</th>
                    <th className="text-left px-5 py-3 text-grey-dark font-medium">Club Captain</th>
                    <th className="text-left px-5 py-3 text-grey-dark font-medium">Women&apos;s Captain</th>
                  </tr>
                </thead>
                <tbody>
                  {ALUMNI_CAPTAINS.map((row, i) => (
                    <tr key={row.year} className={i % 2 === 0 ? 'bg-white' : 'bg-grey-light/50'}>
                      <td className="px-5 py-3 font-medium text-black">{row.year}</td>
                      <td className="px-5 py-3 text-grey-dark">{row.captain}</td>
                      <td className="px-5 py-3 text-grey-dark">{row.womensCaptain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

      </div>
    </div>
  )
}

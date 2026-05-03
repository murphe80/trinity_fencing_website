'use client'

import { useState } from 'react'
import AchievementCard from './AchievementCard'
import YearFilter from './YearFilter'
import ScrollReveal from '@/components/ui/ScrollReveal'
import type { Achievement } from '@/types'

function groupByYear(achievements: Achievement[]) {
  return achievements.reduce<Record<string, Achievement[]>>((acc, a) => {
    if (!acc[a.year]) acc[a.year] = []
    acc[a.year].push(a)
    return acc
  }, {})
}

interface Props {
  achievements: Achievement[]
}

export default function AchievementsClient({ achievements }: Props) {
  const years = [...new Set(achievements.map(a => a.year))].sort((a, b) => b.localeCompare(a))
  const [activeYear, setActiveYear] = useState('All')

  const counts = Object.fromEntries(
    years.map(y => [y, achievements.filter(a => a.year === y).length])
  )

  const filtered = activeYear === 'All' ? achievements : achievements.filter(a => a.year === activeYear)
  const grouped = groupByYear(filtered)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <YearFilter years={years} active={activeYear} onChange={setActiveYear} counts={counts} />
      </div>

      <div className="space-y-16">
        {Object.entries(grouped).map(([year, items]) => (
          <div key={year}>
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-black">{year}</h2>
                <div className="flex-1 h-px bg-grey-light" />
                <span className="font-body text-sm text-grey-mid">{items.length} result{items.length !== 1 ? 's' : ''}</span>
              </div>
            </ScrollReveal>

            <div className="relative">
              {/* Line runs through the center of the dot column (w-5 = 20px, center = 10px) */}
              <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-red/25" />
              <div className="space-y-5">
                {items.map((achievement, i) => (
                  <ScrollReveal
                    key={`${achievement.eventName}-${achievement.date}`}
                    delay={Math.min(i * 80, 320)}
                  >
                    <AchievementCard achievement={achievement} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="font-body text-grey-mid text-center py-16">No achievements found for this year.</p>
        )}
      </div>
    </div>
  )
}

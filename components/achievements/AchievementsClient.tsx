'use client'

import { useState } from 'react'
import AchievementCard from './AchievementCard'
import YearFilter from './YearFilter'
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

  const filtered = activeYear === 'All' ? achievements : achievements.filter(a => a.year === activeYear)
  const grouped = groupByYear(filtered)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <YearFilter years={years} active={activeYear} onChange={setActiveYear} />
      </div>

      <div className="space-y-16">
        {Object.entries(grouped).map(([year, items]) => (
          <div key={year} className="relative">
            {/* Year label */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-black">{year}</h2>
              <div className="flex-1 h-px bg-grey-light" />
            </div>

            {/* Vertical timeline line */}
            <div className="relative">
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-red/30 md:left-2" />
              <div className="space-y-6">
                {items.map((achievement, i) => (
                  <AchievementCard key={i} achievement={achievement} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

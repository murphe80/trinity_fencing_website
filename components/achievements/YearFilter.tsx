'use client'

import { clsx } from 'clsx'

interface Props {
  years: string[]
  active: string
  onChange: (year: string) => void
}

export default function YearFilter({ years, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {['All', ...years].map(year => (
        <button
          key={year}
          onClick={() => onChange(year)}
          className={clsx(
            'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-body font-medium uppercase tracking-wide transition-colors',
            active === year
              ? 'bg-red text-white'
              : 'border border-grey-mid text-grey-dark hover:border-red hover:text-red'
          )}
        >
          {year}
        </button>
      ))}
    </div>
  )
}

'use client'

import { clsx } from 'clsx'

interface Props {
  years: string[]
  active: string
  onChange: (year: string) => void
  counts?: Record<string, number>
}

export default function YearFilter({ years, active, onChange, counts }: Props) {
  const total = counts ? Object.values(counts).reduce((s, n) => s + n, 0) : null

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {[{ label: 'All', value: 'All', count: total }, ...years.map(y => ({ label: y, value: y, count: counts?.[y] ?? null }))].map(({ label, value, count }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={clsx(
            'flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-body font-medium uppercase tracking-wide transition-colors',
            active === value
              ? 'bg-red text-white'
              : 'border border-grey-mid text-grey-dark hover:border-red hover:text-red'
          )}
        >
          {label}
          {count !== null && (
            <span className={clsx(
              'text-[10px] font-body font-semibold rounded-full px-1.5 py-0.5 leading-none',
              active === value ? 'bg-white/20 text-white' : 'bg-grey-light text-grey-mid'
            )}>
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

'use client'

import { clsx } from 'clsx'
import type { EventTag } from '@/types'

const FILTERS: Array<EventTag | 'All'> = ['All', 'Competition', 'Training', 'Social', 'Alumni']

interface Props {
  active: EventTag | 'All'
  onChange: (filter: EventTag | 'All') => void
}

export default function EventFilterBar({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(filter => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={clsx(
            'px-4 py-1.5 rounded-full text-xs font-body font-medium uppercase tracking-wide transition-colors',
            active === filter
              ? 'bg-red text-white'
              : 'border border-grey-mid text-grey-dark hover:border-red hover:text-red'
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

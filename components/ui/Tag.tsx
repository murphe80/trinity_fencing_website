import { clsx } from 'clsx'
import type { EventTag } from '@/types'

const TAG_CLASSES: Record<EventTag, string> = {
  Competition: 'bg-red-light text-red',
  Training: 'bg-blue-50 text-blue-700',
  Social: 'bg-green-50 text-green-700',
  Alumni: 'bg-yellow-50 text-yellow-700',
  General: 'bg-grey-light text-grey-dark',
}

interface TagProps {
  label: EventTag | string
  className?: string
}

export default function Tag({ label, className }: TagProps) {
  const colourClass = TAG_CLASSES[label as EventTag] ?? 'bg-grey-light text-grey-dark'

  return (
    <span
      className={clsx(
        'inline-block text-xs font-body font-medium px-2.5 py-1 rounded-full uppercase tracking-wide',
        colourClass,
        className
      )}
    >
      {label}
    </span>
  )
}

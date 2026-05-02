'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

interface AccordionItem {
  question: string
  answer: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
}

function AccordionEntry({ item, isOpen, onToggle }: {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-grey-light last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-body font-medium text-black pr-8">{item.question}</span>
        <span
          className={clsx(
            'flex-shrink-0 w-5 h-5 rounded-full border-2 border-red flex items-center justify-center transition-transform duration-200',
            isOpen && 'rotate-45'
          )}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-red" fill="currentColor">
            <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        )}
      >
        <div className="font-body text-grey-dark leading-relaxed">{item.answer}</div>
      </div>
    </div>
  )
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-grey-light">
      {items.map((item, i) => (
        <AccordionEntry
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  )
}

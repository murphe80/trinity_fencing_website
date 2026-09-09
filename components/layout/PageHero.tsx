import type { ReactNode } from 'react'
import PageHeroWatermark from './PageHeroWatermark'

export default function PageHero({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="bg-black relative overflow-hidden">
      <PageHeroWatermark />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
          {title}
        </h1>
        <p className="font-body text-white/60 mt-3 text-lg max-w-3xl">
          {description}
        </p>
        {children}
      </div>
    </div>
  )
}

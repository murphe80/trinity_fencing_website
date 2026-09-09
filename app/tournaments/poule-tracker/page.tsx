import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/layout/PageHero'
import PouleTracker from '@/components/tournaments/PouleTracker'
export const metadata: Metadata = { title: 'Poule Tracker' }
export default function Page() {
  return (
    <div className="bg-cream min-h-screen">
      <PageHero
        title="Poule tracker"
        description="Use our poule tracker to keep track and save your tournament results."
      >
        <Link
          href="/tournaments/wheel"
          className="inline-block mt-5 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          The Wheel Tournament ↗
        </Link>
      </PageHero>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PouleTracker />
      </div>
    </div>
  )
}

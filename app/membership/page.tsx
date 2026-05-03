import type { Metadata } from 'next'
import PageHeroWatermark from '@/components/layout/PageHeroWatermark'
import Link from 'next/link'
import Accordion from '@/components/ui/Accordion'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Join the Club',
  description: 'Join Dublin University Fencing Club. No experience needed. Equipment provided for beginners.',
}

const FAQ_ITEMS = [
  {
    question: 'What equipment do I need to start?',
    answer: (
      <span>
        Nothing for your first session. The club lends masks and jackets to beginners.
        As you progress you&apos;ll want to purchase your own kit. See our{' '}
        <Link href="/shop" className="text-red hover:underline">Shop page</Link>{' '}
        for club-branded gear.
      </span>
    ),
  },
  {
    question: 'When and where do training sessions take place?',
    answer: (
      <span>
        Check the <Link href="/events" className="text-red hover:underline">Events calendar</Link>{' '}
        for up-to-date training times. Sessions are held in the Sports Centre on the Trinity campus.
      </span>
    ),
  },
  {
    question: 'I fenced before at another club — can I join?',
    answer: `Absolutely. Experienced fencers are very welcome. Get in touch via ${SITE_CONFIG.email} to discuss.`,
  },
  {
    question: 'Is there a trial session?',
    answer: 'Yes, you can attend a taster session before committing to membership. Contact us to arrange.',
  },
  {
    question: 'What are the membership fees?',
    answer: (
      <span>
        Current fees are listed on the{' '}
        <a href={SITE_CONFIG.clubforceUrl} target="_blank" rel="noopener noreferrer" className="text-red hover:underline">
          Clubforce registration page
        </a>.
      </span>
    ),
  },
]

const WHAT_TO_EXPECT = [
  {
    title: 'Beginners Welcome',
    body: 'No prior experience is needed. We provide beginner coaching and can lend equipment for your first few sessions.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Training Schedule',
    body: (
      <span>
        We train multiple times per week. Check the{' '}
        <Link href="/events" className="text-red hover:underline">Events page</Link>{' '}
        for current training times and locations.
      </span>
    ),
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: 'All Three Weapons',
    body: 'Members can train in foil, épée, and sabre. Most beginners start with one weapon and branch out over time.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="5" y1="19" x2="19" y2="5" />
        <polyline points="15 5 19 5 19 9" />
        <line x1="5" y1="19" x2="9" y2="15" />
      </svg>
    ),
  },
]

export default function MembershipPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="bg-black relative overflow-hidden">
        <PageHeroWatermark />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
            Join Dublin University<br className="hidden sm:block" /> Fencing Club
          </h1>
          <p className="font-body text-white/60 mt-3 text-lg">
            No experience needed. Equipment provided for beginners.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Sign-up options */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Trinity Students */}
            <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col gap-5 border-t-4 border-red">
              <div className="w-12 h-12 rounded-full bg-red-light flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-semibold text-black">Trinity Students</h2>
                <p className="font-body text-grey-dark leading-relaxed mt-3">
                  Register through Clubforce, the official Trinity Sport membership portal.
                  Annual membership includes full club access, coaching, and kit hire for beginners.
                </p>
                <p className="font-body text-sm text-grey-mid mt-3">
                  You&apos;ll need your Trinity student ID to complete registration.
                </p>
              </div>
              <a
                href={SITE_CONFIG.clubforceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start bg-red text-white px-6 py-3 rounded-md font-body font-medium text-sm uppercase tracking-wide hover:bg-red-dark transition-colors duration-200 mt-auto"
              >
                Register via Clubforce
              </a>
            </div>

            {/* External Members */}
            <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col gap-5 border-t-4 border-grey-mid">
              <div className="w-12 h-12 rounded-full bg-grey-light flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-semibold text-black">External Members</h2>
                <p className="font-body text-grey-dark leading-relaxed mt-3">
                  Not a Trinity student? We welcome alumni, staff, and external fencers.
                  Contact us to discuss external membership options.
                </p>
              </div>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="self-start border-2 border-grey-dark text-grey-dark px-6 py-3 rounded-md font-body font-medium text-sm uppercase tracking-wide hover:bg-grey-dark hover:text-white transition-colors duration-200 mt-auto"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section>
          <h2 className="font-heading text-3xl font-semibold text-black mb-8">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {WHAT_TO_EXPECT.map(item => (
              <div key={item.title} className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-red-light flex items-center justify-center flex-shrink-0 text-red">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-black">{item.title}</h3>
                  <p className="font-body text-sm text-grey-dark leading-relaxed mt-1">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-heading text-3xl font-semibold text-black mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl bg-white rounded-lg shadow-sm px-6 py-2">
            <Accordion items={FAQ_ITEMS} />
          </div>
        </section>

      </div>
    </div>
  )
}

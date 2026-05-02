import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Friends of DUFC',
  description: 'Stay connected with Dublin University Fencing Club. Newsletter signup, donations, and alumni information.',
}

export default function FriendsPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="bg-black relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-5 pointer-events-none select-none">
          <span className="font-heading text-white text-[20rem] font-bold leading-none">D</span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
            Friends of DUFC
          </h1>
          <p className="font-body text-white/60 mt-3 text-lg">
            Stay connected with the club you helped build.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Newsletter */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-black">
                The DUFC Newsletter
              </h2>
              <p className="font-body text-grey-dark leading-relaxed mt-4">
                Stay up to date with club news, competition results, and events.
                We send a newsletter to our alumni and friends community throughout the season.
              </p>
              <p className="font-body text-sm text-grey-mid mt-4">
                No spam. Unsubscribe at any time.
              </p>
            </div>

            {/* Mailchimp embed placeholder */}
            <div className="mailchimp-wrapper">
              {/*
                MAILCHIMP EMBED CODE GOES HERE
                ───────────────────────────────
                To add the newsletter signup form:
                1. Log in to Mailchimp at mailchimp.com
                2. Go to Audience → Signup Forms → Embedded Forms
                3. Select "Unstyled" or "Classic"
                4. Copy the embed HTML
                5. Replace this comment block with the copied code

                The .mailchimp-wrapper CSS in globals.css will style the form
                to match the DUFC design system automatically.
              */}
              <div className="bg-white rounded-lg border border-grey-light p-8 text-center">
                <p className="font-body text-grey-mid text-sm">
                  Newsletter signup form coming soon.
                </p>
                <p className="font-body text-xs text-grey-mid mt-2">
                  (Mailchimp embed code to be added — see /docs/NEWSLETTER_SETUP.md)
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Newsletter Signup`}
                  className="inline-block mt-4 text-sm text-red font-medium font-body hover:underline"
                >
                  Email us to be added to the list →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Donate */}
        <section className="bg-black rounded-xl p-10 md:p-14 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white">
            Support DUFC
          </h2>
          <p className="font-body text-white/70 leading-relaxed mt-5 max-w-2xl mx-auto">
            DUFC is a non-profit student club. Your donations directly fund equipment, competition
            travel, and hosting the Professor Duffy Memorial Team Épée — one of Ireland&apos;s
            longest-running fencing tournaments. Every contribution makes a difference.
          </p>
          <div className="mt-8">
            <a
              href={`mailto:${SITE_CONFIG.donationEmail}?subject=DUFC Donation`}
              className="inline-block bg-red text-white px-8 py-3 rounded-md font-body font-medium text-sm uppercase tracking-wide hover:bg-red-dark transition-colors duration-200"
            >
              Get in Touch to Donate
            </a>
          </div>
        </section>

        {/* Prof. Duffy Memorial Tournament */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <div className="font-body text-xs text-red uppercase tracking-widest mb-3">
                Est. 1987 · Annual Tournament
              </div>
              <h2 className="font-heading text-3xl font-semibold text-black">
                The Professor Duffy Memorial Team Épée
              </h2>
              <div className="space-y-4 font-body text-grey-dark leading-relaxed mt-5">
                <p>
                  Inaugurated in 1987 following the death of Professor Patrick Duffy — DUFC&apos;s
                  most decorated coach and an Irish Olympian himself — the Prof. Duffy Memorial
                  Team Épée has grown into one of Ireland&apos;s most prestigious fencing tournaments.
                </p>
                <p>
                  Now in its fourth decade, the tournament attracts international teams from Germany,
                  Italy, and the UK, as well as the top Irish university and club teams. It is held
                  annually at Trinity Sports Centre in December.
                </p>
                <p>
                  The tournament is a key fundraising event for the club and a celebration of DUFC&apos;s
                  history and international standing in the sport.
                </p>
              </div>
              <Link
                href="/events"
                className="inline-block mt-6 font-body text-sm text-red font-medium hover:text-red-dark transition-colors"
              >
                View upcoming tournament dates →
              </Link>
            </div>

            {/* Historical context box */}
            <div className="bg-grey-light rounded-lg p-6 md:p-8">
              <blockquote className="font-heading text-lg text-black leading-relaxed italic">
                &ldquo;Professor Patrick Duffy coached DUFC from 1952 until his death in 1987,
                representing Ireland at the 1948 and 1952 Olympic Games. His legacy endures in
                the annual Professor Duffy Memorial Team Épée Tournament, now in its fourth decade.&rdquo;
              </blockquote>
              <div className="mt-4 font-body text-sm text-grey-mid">
                — Dublin University Fencing Club
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

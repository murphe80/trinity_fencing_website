import type { Metadata } from 'next'
import PageHeroWatermark from '@/components/layout/PageHeroWatermark'
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
        <PageHeroWatermark />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
            Friends of DUFC
          </h1>
          <p className="font-body text-white/60 mt-3 text-lg">
            Stay connected with the club
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
                We send a newsletter to our alumni and friends community twice per season.
              </p>
            </div>

            <div className="mailchimp-wrapper">
              <div className="bg-white rounded-lg border border-grey-light p-8 text-center">
                <p className="font-body text-grey-mid text-sm">
                  Join the DUFC alumni and friends mailing list.
                </p>
                <a
                  href="http://eepurl.com/iUqzP2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-red font-medium font-body hover:underline"
                >
                  Sign up for the newsletter →
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
            travel, and hosting competitions like the Professor Duffy Memorial Team Épée. Every contribution makes a difference.
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
              <h2 className="font-heading text-3xl font-semibold text-black">
                The Professor Duffy Memorial Team Épée
              </h2>
              <div className="space-y-4 font-body text-grey-dark leading-relaxed mt-5">
                <p>
                  Inaugurated in 1987 following the death of Professor Patrick Duffy, the Prof. Duffy Memorial
                  Team Épée has grown into one of Ireland&apos;s most prestigious fencing tournaments.
                </p>
                <p>
                  Now in its fourth decade, the tournament attracts international teams from Germany,
                  Italy, and the UK, as well as the top Irish university and club teams. It is held
                  annually in Trinity Sports Centre.
                </p>
                <p>
                  The tournament is a key fundraising event for the club and a celebration of DUFC&apos;s
                  history.
                </p>
              </div>
              <Link
                href="/events"
                className="inline-block mt-6 font-body text-sm text-red font-medium hover:text-red-dark transition-colors"
              >
                View upcoming tournament dates →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

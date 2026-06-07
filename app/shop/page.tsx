import type { Metadata } from 'next'
import PageHeroWatermark from '@/components/layout/PageHeroWatermark'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Club Shop',
  description: 'Official DUFC kit available through McKeever Sports',
}



export default function ShopPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="bg-black relative overflow-hidden">
        <PageHeroWatermark />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
            Club Shop
          </h1>
          <p className="font-body text-white/60 mt-3 text-lg">
            Official DUFC kit available through McKeever Sports.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* McKeever card */}
        <section>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-red h-2" />
            <div className="p-8 md:p-12">
              <div className="max-w-2xl">
                <div className="font-body text-xs text-grey-mid uppercase tracking-widest mb-3">
                  Official Club Kit Supplier
                </div>
                <h2 className="font-heading text-3xl font-semibold text-black">
                  McKeever Sports
                </h2>
                <p className="font-body text-grey-dark leading-relaxed mt-4">
                  DUFC club kit is available through the official McKeever Sports online store.
                  The range includes:
                </p>
                <ul className="font-body text-grey-dark mt-3 space-y-1 list-disc list-inside">
                  <li>Club training tops and polos</li>
                  <li>Jackets and tracksuits</li>
                  <li>Hats and scarves</li>
                </ul>
                <p className="font-body text-sm text-grey-mid mt-4">
                  All items are produced in DUFC colours (red and black) with the club crest.
                </p>
                <div className="mt-8">
                  <a
                    href={SITE_CONFIG.mckeevorShopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-red text-white px-8 py-3 rounded-md font-body font-medium text-sm uppercase tracking-wide hover:bg-red-dark transition-colors duration-200"
                  >
                    Visit the DUFC McKeever Shop
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  )
}

import { SITE_CONFIG } from '@/lib/constants'
import type { InstagramFeature } from '@/types'

function InstagramPlaceholder({ caption, index }: { caption: string; index: number }) {
  const hues = [355, 340, 10, 350, 5, 345]
  const hue = hues[index % hues.length]
  return (
    <a
      href={SITE_CONFIG.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square rounded-lg overflow-hidden block"
      style={{ background: `hsl(${hue}, 70%, 15%)` }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="white" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
        <p className="text-white text-xs font-body leading-tight line-clamp-2">{caption}</p>
      </div>
    </a>
  )
}

interface Props {
  features: InstagramFeature[]
}

export default function InstagramStrip({ features }: Props) {
  return (
    <section className="bg-grey-light py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-black">
            Follow Along
          </h2>
          <p className="font-body text-grey-mid mt-2">{SITE_CONFIG.instagramHandle} on Instagram</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {features.map((feature, i) => (
            <InstagramPlaceholder
              key={i}
              caption={feature.caption}
              index={i}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red text-white px-6 py-3 rounded-md font-body font-medium text-sm uppercase tracking-wide hover:bg-red-dark transition-colors duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

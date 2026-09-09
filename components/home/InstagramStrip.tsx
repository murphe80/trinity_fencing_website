import Image from 'next/image'
import { SITE_CONFIG } from '@/lib/constants'
import type { InstagramFeature } from '@/types'

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
          <p className="font-body text-grey-mid mt-2">
            {SITE_CONFIG.instagramHandle} on Instagram
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {features
            .filter((feature) => feature.imageUrl)
            .map((feature, i) => (
              <a
                key={i}
                href={
                  feature.instagramLink &&
                  /^https?:\/\//i.test(feature.instagramLink)
                    ? feature.instagramLink
                    : SITE_CONFIG.instagramUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-lg overflow-hidden block"
              >
                <Image
                  unoptimized
                  src={feature.imageUrl}
                  alt={feature.caption || 'DUFC on Instagram'}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
                {feature.caption && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-xs leading-tight line-clamp-2">
                      {feature.caption}
                    </p>
                  </div>
                )}
              </a>
            ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red text-white px-6 py-3 rounded-md font-body font-medium text-sm uppercase tracking-wide hover:bg-red-dark transition-colors duration-200"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
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

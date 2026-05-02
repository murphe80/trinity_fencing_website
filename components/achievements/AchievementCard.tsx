'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import Tag from '@/components/ui/Tag'
import Lightbox from '@/components/ui/Lightbox'
import { driveUrlToImageSrc } from '@/lib/drive-url'
import type { Achievement } from '@/types'

interface Props {
  achievement: Achievement
}

export default function AchievementCard({ achievement }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const imageSrcs = achievement.imageUrls.map(driveUrlToImageSrc)
  const shortDesc = achievement.description.slice(0, 100)
  const hasMore = achievement.description.length > 100

  return (
    <>
      <div className="relative pl-8 md:pl-12">
        {/* Timeline dot */}
        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-red border-2 border-cream" />

        <div className="bg-white rounded-lg shadow-sm p-5 md:p-6">
          <div className="flex flex-wrap items-start gap-2 mb-3">
            <Tag label={achievement.level as any} />
            <Tag label={achievement.weapon as any} />
          </div>

          <h3 className="font-heading text-xl font-medium text-black">
            {achievement.eventName}
          </h3>

          <p className="font-body text-sm font-semibold text-red mt-1">{achievement.result}</p>

          {achievement.fencers.length > 0 && (
            <p className="font-body text-sm text-grey-dark mt-1">
              {achievement.fencers.join(', ')}
            </p>
          )}

          <p className="font-body text-sm text-grey-mid mt-0.5">{achievement.date}</p>

          {achievement.description && (
            <div className="mt-3">
              <p className="font-body text-sm text-grey-dark leading-relaxed">
                {expanded ? achievement.description : shortDesc}
                {!expanded && hasMore && '…'}
              </p>
              {hasMore && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="font-body text-xs text-red font-medium mt-1 hover:text-red-dark transition-colors"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          {imageSrcs.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {imageSrcs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                  className="w-16 h-16 rounded overflow-hidden bg-grey-light hover:opacity-90 transition-opacity"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={imageSrcs}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex(i => (i - 1 + imageSrcs.length) % imageSrcs.length)}
          onNext={() => setLightboxIndex(i => (i + 1) % imageSrcs.length)}
        />
      )}
    </>
  )
}

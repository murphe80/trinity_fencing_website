'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import Tag from '@/components/ui/Tag'
import Lightbox from '@/components/ui/Lightbox'
import { driveUrlToImageSrc } from '@/lib/drive-url'
import type { Achievement } from '@/types'

function getResultStyle(result: string): string {
  const r = result.toLowerCase()
  if (r.includes('1st') || r.includes('gold') || r.includes('winner')) return 'text-gold font-bold'
  if (r.includes('2nd') || r.includes('silver')) return 'text-grey-dark font-bold'
  if (r.includes('3rd') || r.includes('bronze')) return 'text-amber-700 font-bold'
  return 'text-red font-semibold'
}

function ResultIcon({ result }: { result: string }) {
  const r = result.toLowerCase()
  if (r.includes('1st') || r.includes('gold') || r.includes('winner')) {
    return <span className="text-gold text-base" aria-hidden>🥇</span>
  }
  if (r.includes('2nd') || r.includes('silver')) {
    return <span className="text-base" aria-hidden>🥈</span>
  }
  if (r.includes('3rd') || r.includes('bronze')) {
    return <span className="text-base" aria-hidden>🥉</span>
  }
  return null
}

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
      {/* Flex layout: dot column (w-5) + card — dot center at 10px matches line at left-[9px] w-0.5 */}
      <div className="flex items-start gap-10">
        {/* Dot column — never moves, sits on the line */}
        <div className="w-5 flex-shrink-0 flex justify-center pt-[25px]">
          <div className={clsx(
            'w-3 h-3 rounded-full border-5 border-cream',
            'bg-red'
          )} />
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-sm p-5 md:p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-2">
              <Tag label={achievement.level as Parameters<typeof Tag>[0]['label']} />
              <Tag label={achievement.weapon as Parameters<typeof Tag>[0]['label']} />
            </div>
            {achievement.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-body font-semibold uppercase tracking-wide text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Featured
              </span>
            )}
          </div>

          <h3 className="font-heading text-xl font-medium text-black">
            {achievement.eventName}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <ResultIcon result={achievement.result} />
            <p className={clsx('font-body text-sm', getResultStyle(achievement.result))}>
              {achievement.result}
            </p>
          </div>

          {achievement.fencers.length > 0 && (
            <p className="font-body text-sm text-grey-dark mt-1">
              {achievement.fencers.join(', ')}
            </p>
          )}

          <p className="font-body text-xs text-grey-mid mt-1">{achievement.date}</p>

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
                  className="w-16 h-16 rounded overflow-hidden bg-grey-light hover:opacity-80 hover:scale-105 transition-all duration-200"
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

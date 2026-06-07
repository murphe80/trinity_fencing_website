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

/** Comma-separated placements (e.g. "1st, 1st, 2nd") → one trimmed segment each. */
function resultSegments(result: string): string[] {
  return result
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
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
  if (r.includes('champions') || r.includes('winners')){
    return <span className="text-gold text-base" aria-hidden>🏆</span>
  }
  return null
}

interface Props {
  achievement: Achievement
}

const FENCER_PREVIEW_COUNT = 5

export default function AchievementCard({ achievement }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [fencersExpanded, setFencersExpanded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const imageSrcs = achievement.imageUrls.map(driveUrlToImageSrc)
  const shortDesc = achievement.description.slice(0, 100)
  const hasMore = achievement.description.length > 100

  const fencers = achievement.fencers
  const needsFencerExpand = fencers.length > FENCER_PREVIEW_COUNT
  const visibleFencers =
    needsFencerExpand && !fencersExpanded ? fencers.slice(0, FENCER_PREVIEW_COUNT) : fencers
  const hiddenFencerCount = fencers.length - FENCER_PREVIEW_COUNT

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
          <div className="flex items-start gap-3 mb-1.5">
            <h3 className="font-heading text-xl font-medium text-black flex-1 min-w-0">
              {achievement.eventName}
            </h3>
            <Tag
              label={achievement.weapon as Parameters<typeof Tag>[0]['label']}
              className="flex-shrink-0 hidden sm:inline-block"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
            <Tag
              label={achievement.weapon as Parameters<typeof Tag>[0]['label']}
              className="sm:hidden flex-shrink-0"
            />
            <div
              className="flex flex-wrap items-center gap-x-1 gap-y-0.5"
              aria-label={achievement.result}
            >
              {resultSegments(achievement.result).map((segment, i) => (
                <ResultIcon key={`${segment}-${i}`} result={segment} />
              ))}
            </div>
          </div>

          {fencers.length > 0 && (
            <div className="mt-1">
              <p className="font-body text-sm text-grey-dark">
                {visibleFencers.join(', ')}
                {needsFencerExpand && !fencersExpanded && '…'}
              </p>
              {needsFencerExpand && (
                <button
                  type="button"
                  onClick={() => setFencersExpanded(!fencersExpanded)}
                  className="font-body text-xs text-red font-medium mt-1 hover:text-red-dark transition-colors"
                >
                  {fencersExpanded
                    ? 'Show fewer fencers'
                    : `Show all ${fencers.length} fencers (${hiddenFencerCount} more)`}
                </button>
              )}
            </div>
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

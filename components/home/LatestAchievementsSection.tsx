import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import type { Achievement } from '@/types'

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span className="font-heading text-4xl font-semibold text-red/20 leading-none select-none">
          {achievement.year.split('/')[0]}
        </span>
        <Tag label={achievement.level as any} className="flex-shrink-0" />
      </div>

      <div>
        <h3 className="font-heading text-xl font-medium text-black">{achievement.eventName}</h3>
        <p className="font-body text-sm font-medium text-red mt-1">{achievement.result}</p>
        <p className="font-body text-sm text-grey-mid mt-0.5">{achievement.weapon}</p>
      </div>

      {achievement.fencers.length > 0 && (
        <p className="font-body text-sm text-grey-dark">
          {achievement.fencers.join(', ')}
        </p>
      )}

      {achievement.description && (
        <p className="font-body text-sm text-grey-mid leading-relaxed line-clamp-2">
          {achievement.description}
        </p>
      )}
    </div>
  )
}

interface Props {
  achievements: Achievement[]
}

export default function LatestAchievementsSection({ achievements }: Props) {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-black">
            Recent Highlights
          </h2>
          <Link
            href="/achievements"
            className="font-body text-sm text-red font-medium hover:text-red-dark transition-colors hidden sm:block"
          >
            View all achievements →
          </Link>
        </div>

        {achievements.length === 0 ? (
          <p className="font-body text-grey-mid">No achievements found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {achievements.map((a, i) => (
              <AchievementCard key={i} achievement={a} />
            ))}
          </div>
        )}

        <div className="mt-8 sm:hidden">
          <Link
            href="/achievements"
            className="font-body text-sm text-red font-medium hover:text-red-dark transition-colors"
          >
            View all achievements →
          </Link>
        </div>
      </div>
    </section>
  )
}

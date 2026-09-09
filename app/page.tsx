import type { Metadata } from 'next'
import FeaturedEventBanner from '@/components/home/FeaturedEventBanner'
import HeroSection from '@/components/home/HeroSection'
import StatsStrip from '@/components/home/StatsStrip'
import AboutSection from '@/components/home/AboutSection'
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection'
import LatestAchievementsSection from '@/components/home/LatestAchievementsSection'
import InstagramStrip from '@/components/home/InstagramStrip'
import RecruitmentCTA from '@/components/home/RecruitmentCTA'
import { getUpcomingEvents, getFeaturedEvents } from '@/lib/google-calendar'
import {
  getFeaturedAchievements,
  getInstagramFeatures,
} from '@/lib/google-sheets'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Dublin University Fencing Club',
  description:
    "Ireland's oldest university fencing club. Founded 1774 at Trinity College Dublin.",
}

export default async function HomePage() {
  const [events, achievements, instagramFeatures, featured] = await Promise.all(
    [
      getUpcomingEvents(3),
      getFeaturedAchievements(3),
      getInstagramFeatures(),
      getFeaturedEvents(),
    ],
  )

  return (
    <>
      <div className="relative -mt-1">
        <FeaturedEventBanner
          events={featured.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.start.toISOString(),
            allDay: e.allDay,
            location: e.location,
          }))}
        />
        <HeroSection />
      </div>
      <StatsStrip />
      <AboutSection />
      <UpcomingEventsSection events={events} />
      <LatestAchievementsSection achievements={achievements} />
      <InstagramStrip features={instagramFeatures} />
      <RecruitmentCTA />
    </>
  )
}

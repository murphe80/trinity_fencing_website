import Avatar from '@/components/ui/Avatar'
import type { Coach } from '@/types'

interface Props {
  coach: Coach
}

export default function CoachCard({ coach }: Props) {
  return (
    <div className="bg-black rounded-xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
      <Avatar name={coach.name} photoUrl={coach.photoUrl} size={100} />

      <div className="text-center md:text-left">
        <div className="font-body text-xs text-gold uppercase tracking-widest mb-2">
          {coach.title}
        </div>
        <h2 className="font-heading text-2xl text-white font-semibold">{coach.name}</h2>
        {coach.qualifications && (
          <p className="font-body text-sm text-white/50 mt-1">{coach.qualifications}</p>
        )}
        <p className="font-body text-white/70 leading-relaxed mt-4 max-w-2xl">{coach.bio}</p>
      </div>
    </div>
  )
}

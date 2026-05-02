import Avatar from '@/components/ui/Avatar'
import type { CommitteeMember } from '@/types'

interface Props {
  member: CommitteeMember
}

export default function PersonCard({ member }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center gap-4">
      <Avatar name={member.name} photoUrl={member.photoUrl} size={80} />

      <div>
        <h3 className="font-heading text-lg font-medium text-black">{member.name}</h3>
        <p className="font-body text-sm font-medium text-red mt-0.5">{member.role}</p>
        {member.bio && (
          <p className="font-body text-sm text-grey-dark leading-relaxed mt-2">{member.bio}</p>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="inline-block font-body text-xs text-grey-mid hover:text-red transition-colors mt-2"
          >
            {member.email}
          </a>
        )}
      </div>
    </div>
  )
}

import Image from 'next/image'
import { driveUrlToImageSrc, isNextImageSrc } from '@/lib/drive-url'

interface AvatarProps {
  name: string
  photoUrl?: string
  size?: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Avatar({ name, photoUrl, size = 80 }: AvatarProps) {
  const initials = getInitials(name)

  if (photoUrl) {
    const src = driveUrlToImageSrc(photoUrl)
    if (isNextImageSrc(src)) {
      return (
        <div
          className="rounded-full overflow-hidden bg-grey-light flex-shrink-0"
          style={{ width: size, height: size }}
        >
          <Image
            src={src}
            alt={name}
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
        </div>
      )
    }
  }

  return (
    <div
      className="rounded-full bg-red flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="text-white font-heading font-semibold select-none"
        style={{ fontSize: size * 0.35 }}
      >
        {initials}
      </span>
    </div>
  )
}

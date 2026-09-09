'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { PRIMARY_LINKS, MORE_LINKS } from '@/lib/navigation'
import { SITE_CONFIG } from '@/lib/constants'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col pt-16 overflow-y-auto">
      <nav className="flex flex-col px-6 py-8 gap-1">
        {PRIMARY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={clsx(
              'font-body text-lg font-medium py-3 border-b border-white/10 transition-colors',
              pathname === link.href
                ? 'text-red'
                : 'text-white/80 hover:text-white',
            )}
          >
            {link.label}
          </Link>
        ))}
        <details
          open={pathname.startsWith('/tournaments')}
          className="py-3 border-b border-white/10 text-white/80"
        >
          <summary className="cursor-pointer text-lg font-medium">
            Club Tournaments
          </summary>
          <Link
            href="/tournaments/poule-tracker"
            onClick={onClose}
            className="block pl-5 py-3 hover:text-white"
          >
            Poule Tracker
          </Link>
          <Link
            href="/tournaments/wheel"
            onClick={onClose}
            className="block pl-5 py-3 hover:text-white"
          >
            The Wheel Tournament
          </Link>
        </details>
        <details
          open={MORE_LINKS.some((link) => link.href === pathname)}
          className="py-3 border-b border-white/10 text-white/80"
        >
          <summary className="cursor-pointer text-lg font-medium">More</summary>
          {MORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={clsx(
                'block pl-5 py-3 hover:text-white',
                pathname === link.href && 'text-red',
              )}
            >
              {link.label}
            </Link>
          ))}
        </details>
        <Link
          href="/membership"
          onClick={onClose}
          className="my-4 self-start border border-red text-red px-5 py-2 rounded-full text-sm font-body font-medium hover:bg-red hover:text-white transition-colors"
        >
          Join the Club
        </Link>
      </nav>

      <div className="mt-auto px-6 pb-8">
        <a
          href={SITE_CONFIG.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 text-sm font-body hover:text-white transition-colors"
        >
          {SITE_CONFIG.instagramHandle}
        </a>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/members', label: 'Members' },
  { href: '/shop', label: 'Shop' },
  { href: '/friends', label: 'Friends of DUFC' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-30 h-16 bg-black transition-shadow duration-200',
          scrolled && 'shadow-md'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/images/crest.png" alt="DUFC crest" width={40} height={40} className="flex-shrink-0" />
            <span className="font-heading text-white text-xl hidden sm:block">
              Dublin University Fencing Club
            </span>
            <span className="font-heading text-white text-xl sm:hidden">DUFC</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'font-body text-sm font-medium uppercase tracking-widest transition-colors pb-0.5',
                  pathname === link.href
                    ? 'text-white border-b-2 border-red'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/membership"
              className={clsx(
                'border border-red text-red px-3 py-1 rounded-full text-xs font-body font-medium uppercase tracking-wide hover:bg-red hover:text-white transition-colors ml-2',
                pathname === '/membership' && 'bg-red text-white'
              )}
            >
              Join the Club
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/members', label: 'Members' },
  { href: '/membership', label: 'Membership' },
  { href: '/shop', label: 'Shop' },
  { href: '/friends', label: 'Friends of DUFC' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Crest placeholder */}
              <div className="w-12 h-12 rounded-full bg-red flex items-center justify-center flex-shrink-0">
                <span className="text-white font-heading font-bold text-lg">D</span>
              </div>
              <span className="font-heading text-white text-lg">Dublin University Fencing Club</span>
            </div>
            <p className="font-body text-sm leading-relaxed text-white/60">
              {SITE_CONFIG.tagline}
            </p>
            <p className="font-body text-xs text-white/40 mt-2">
              Trinity College Dublin
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="font-body text-xs font-medium uppercase tracking-widest text-white/40 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social & External */}
          <div>
            <h3 className="font-body text-xs font-medium uppercase tracking-widest text-white/40 mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-sm hover:text-white transition-colors group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                  {SITE_CONFIG.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.fencingIrelandUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-sm hover:text-white transition-colors"
                >
                  <ExternalLinkIcon />
                  Fencing Ireland
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.trinitySportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-sm hover:text-white transition-colors"
                >
                  <ExternalLinkIcon />
                  Trinity Sport
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-2 font-body text-sm hover:text-white transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-white/40">
            © {year} Dublin University Fencing Club. All rights reserved.
          </p>
          <a
            href={SITE_CONFIG.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            Club History on Wikipedia ↗
          </a>
        </div>
      </div>
    </footer>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

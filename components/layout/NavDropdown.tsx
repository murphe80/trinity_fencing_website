'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

export const navItemClass =
  'h-9 inline-flex items-center gap-2 border-b-2 font-body text-xs leading-none font-medium uppercase tracking-wide whitespace-nowrap transition-colors'

export default function NavDropdown({
  label,
  links,
}: {
  label: string
  links: { href: string; label: string }[]
}) {
  const pathname = usePathname()
  const ref = useRef<HTMLDetailsElement>(null)
  const active = links.some((link) => link.href === pathname)

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !ref.current?.contains(event.target))
        ref.current?.removeAttribute('open')
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  return (
    <details
      ref={ref}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          ref.current?.removeAttribute('open')
          ref.current?.querySelector('summary')?.focus()
        }
      }}
    >
      <summary
        className={clsx(
          navItemClass,
          'nav-dropdown-summary cursor-pointer list-none',
          active
            ? 'text-white border-red'
            : 'text-white/70 hover:text-white border-transparent',
        )}
      >
        {label}
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m3 4.5 3 3 3-3" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full mt-3 w-60 rounded-lg border border-white/20 bg-black p-2 shadow-xl">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? 'page' : undefined}
            className={clsx(
              'block rounded px-4 py-3 text-sm transition-colors hover:bg-white/10',
              pathname === link.href
                ? 'text-white bg-white/10'
                : 'text-white/80',
            )}
            onClick={() => ref.current?.removeAttribute('open')}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  )
}

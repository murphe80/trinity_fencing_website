import { clsx } from 'clsx'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline-white'
  size?: 'sm' | 'md'
  href?: string
  external?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external,
  onClick,
  className,
  type = 'button',
}: ButtonProps) {
  const base = 'inline-block font-body font-medium uppercase tracking-wide rounded-md transition-colors duration-200 text-center'

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
  }

  const variants = {
    primary: 'bg-red text-white hover:bg-red-dark',
    secondary: 'border-2 border-red text-red hover:bg-red hover:text-white',
    'outline-white': 'border-2 border-white text-white hover:bg-white hover:text-black',
  }

  const classes = clsx(base, sizes[size], variants[variant], className)

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return <Link href={href} className={classes}>{children}</Link>
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

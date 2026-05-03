import type { Metadata } from 'next'
import { EB_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://trinityfencing.ie'),
  title: {
    template: '%s | Dublin University Fencing Club',
    default: 'Dublin University Fencing Club',
  },
  description: "Ireland's oldest university fencing club. Founded 1774 at Trinity College Dublin. Foil, épée, and sabre.",
  openGraph: {
    title: 'Dublin University Fencing Club',
    description: "Ireland's oldest university fencing club. Founded 1774.",
    url: 'https://trinityfencing.ie',
    siteName: 'DUFC',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_IE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main className="pt-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

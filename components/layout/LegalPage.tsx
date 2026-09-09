import type { ReactNode } from 'react'
import PageHero from './PageHero'

export default function LegalPage({ title, description, children }: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="bg-cream min-h-screen">
      <PageHero title={title} description={description} />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 font-body text-grey-dark leading-relaxed space-y-8 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:text-black [&_h2]:mb-3 [&_p+p]:mt-3 [&_a]:text-red [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2">
        <p className="text-sm">Last updated: 9 September 2026</p>
        {children}
      </article>
    </div>
  )
}

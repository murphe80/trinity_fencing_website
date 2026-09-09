import type { Metadata } from 'next'
import PageHero from '@/components/layout/PageHero'
import { folders, listFiles } from '@/lib/club-drive'
export const metadata: Metadata = { title: 'Club Policies' }
export const dynamic = 'force-dynamic'
export default async function PoliciesPage() {
  let files: Awaited<ReturnType<typeof listFiles>> = [],
    unavailable = false
  try {
    files = (await listFiles(folders.policies)).filter(
      (f) =>
        ![
          'application/vnd.google-apps.folder',
          'application/vnd.google-apps.shortcut',
        ].includes(f.mimeType),
    )
  } catch {
    unavailable = true
  }
  return (
    <div className="bg-cream min-h-screen">
      <PageHero
        title="Club policies"
        description="Read the latest versions of our policies below."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {unavailable ? (
          <p role="status" className="club-notice">
            Policies are temporarily unavailable. Please try again later or
            contact{' '}
            <a className="underline" href="mailto:dufencing@gmail.com">
              dufencing@gmail.com
            </a>{' '}
            for a copy.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {files.map((f, i) => (
              <a
                key={f.id}
                href={`/api/club-files/${f.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="club-card group hover:border-red transition-colors"
              >
                <span className="eyebrow text-grey-mid">
                  Policy {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-heading text-3xl mt-5 group-hover:text-red">
                  {f.name.replace(/\.(pdf|docx?)$/i, '').replace(/_/g, ' ')}
                </h2>
                {f.modifiedTime && (
                  <p className="text-sm text-grey-dark mt-4">
                    Updated{' '}
                    {new Intl.DateTimeFormat('en-IE', {
                      dateStyle: 'medium',
                      timeZone: 'Europe/Dublin',
                    }).format(new Date(f.modifiedTime))}
                  </p>
                )}
                <p className="text-red mt-6 text-sm font-medium">
                  Read policy ↗
                </p>
              </a>
            ))}
            {!files.length && <p>No policies have been published yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

import { googleErrorSummary } from '@/lib/google-error'
import type { Metadata } from 'next'
import PoulesLeague from '@/components/tournaments/PoulesLeague'
import { folders, listFiles, publishedResults } from '@/lib/club-drive'
import { publicationCutoff, type Poule } from '@/lib/tournament'
export const metadata: Metadata = { title: 'Poules Tournament' }
export const dynamic = 'force-dynamic'
export default async function Page() {
  let poules: Poule[] = [],
    photos: Record<string, string> = {},
    unavailable = false
  const cutoff = publicationCutoff()
  try {
    poules = await publishedResults(cutoff)
  } catch (error) {
    console.error('League unavailable:', googleErrorSummary(error))
    unavailable = true
  }
  try {
    photos = Object.fromEntries(
      (await listFiles(folders.photos))
        .filter((f) =>
          ['image/png', 'image/jpeg', 'image/webp'].includes(f.mimeType),
        )
        .map((f) => [
          f.name
            .replace(/\.(png|jpe?g|webp)$/i, '')
            .normalize('NFC')
            .toLowerCase(),
          `/api/club-files/${f.id}`,
        ]),
    )
  } catch (error) {
    console.error('Profile photos unavailable:', googleErrorSummary(error))
  }
  return (
    <PoulesLeague
      poules={poules}
      photos={photos}
      cutoff={cutoff}
      unavailable={unavailable}
    />
  )
}

import { writeFile, mkdir } from 'node:fs/promises'
import { poulePdf } from '../lib/poule-pdf'
import { generateBouts, type Poule } from '../lib/tournament'
async function main() {
  await mkdir('/tmp/dufc-pdf-check', { recursive: true })
  for (const count of [3, 20]) {
    const poule: Poule = {
      version: 1,
      id: '12345678-1234-4123-8123-123456789012',
      date: '2026-09-18',
      weapon: 'epee',
      fencers: Array.from(
        { length: count },
        (_, i) =>
          ['Élodie O’Connor', 'Seán Murphy', 'Alexandra Montgomery-Wellington'][
            i % 3
          ] +
          ' ' +
          (i + 1),
      ),
      bouts: generateBouts(count).map((b) => ({ ...b, scoreA: 5, scoreB: 3 })),
      wheel: false,
      prize: '',
      prizeWinner: '',
    }
    await writeFile(
      '/tmp/dufc-pdf-check/poule-' + count + '.pdf',
      await poulePdf(poule),
    )
  }
}
main()

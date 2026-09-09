import type { Poule } from '@/lib/tournament'

export default function PoulePrint({ poule }: { poule: Poule }) {
  return (
    <div className="poule-print-only">
      <section>
        <h2>Bouts</h2>
        <ol>
          {poule.bouts.map((bout, index) => (
            <li key={index}>
              {poule.fencers[bout.a]} vs {poule.fencers[bout.b]}
              <span className="print-score">
                {bout.scoreA ?? '___'} – {bout.scoreB ?? '___'}
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="print-grid">
        <h2>Poule grid</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Fencer</th>
              {poule.fencers.map((name, index) => (
                <th scope="col" key={name}>
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {poule.fencers.map((name, index) => (
              <tr key={name}>
                <th scope="row">
                  {index + 1}. {name}
                </th>
                {poule.fencers.map((_, opponent) => {
                  const bout = poule.bouts.find(
                    (b) =>
                      (b.a === index && b.b === opponent) ||
                      (b.b === index && b.a === opponent),
                  )
                  return (
                    <td
                      key={opponent}
                      className={index === opponent ? 'print-diagonal' : ''}
                    >
                      {index === opponent
                        ? '×'
                        : ((bout?.a === index ? bout.scoreA : bout?.scoreB) ??
                          '')}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

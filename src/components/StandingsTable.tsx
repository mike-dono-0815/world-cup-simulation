import type { GroupStanding } from '../types'
import { Flag } from './Flag'

interface Props {
  standings: GroupStanding[]
  advancingThirds: Set<string>
  groupId: string
}

export function StandingsTable({ standings, advancingThirds, groupId }: Props) {
  const playedTotal = standings.reduce((n, s) => n + s.played, 0)
  const matchesPlayed = playedTotal / 2

  return (
    <section className="bs-card">
      <header style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '14px 18px 12px',
      }} className="double-rule">
        <div>
          <div className="smallcaps" style={{ marginBottom: 2 }}>The Table</div>
          <div className="font-didot" style={{ fontSize: 26, lineHeight: 1, letterSpacing: '-0.005em' }}>
            Group {groupId}{matchesPlayed > 0 ? ` (${matchesPlayed}/6)` : ''}
          </div>
        </div>
        <div className="smallcaps" style={{ textAlign: 'right', lineHeight: 1.5 }}>
          <span style={{ color: 'var(--advance)' }}>↑ Top two advance</span><br/>
          <span style={{ color: 'var(--faint)' }}>↗ Best eight 3rd qualify</span>
        </div>
      </header>

      <div style={{ overflowX: 'auto' }}>
        <table className="bs-table">
          <thead>
            <tr>
              <th className="first">Club</th>
              <th>Pld</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
              <th className="last">Status</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => {
              const isAdvance = i < 2
              const isThird = i === 2 && advancingThirds.has(s.team)
              const accent = isAdvance ? 'var(--advance)' : isThird ? 'var(--third)' : 'transparent'
              return (
                <tr key={s.team} className={i % 2 === 1 ? 'alt' : ''}>
                  <td style={{ padding: '10px 0 10px 24px', position: 'relative', textAlign: 'left' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: accent,
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="font-didot tnum" style={{
                        fontSize: 18, lineHeight: 1, color: 'var(--muted)', minWidth: 14,
                      }}>{i + 1}.</span>
                      <Flag code={s.flagCode} size={22} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{s.team}</span>
                    </div>
                  </td>
                  <td>{s.played}</td>
                  <td>{s.won}</td>
                  <td>{s.drawn}</td>
                  <td>{s.lost}</td>
                  <td>{s.gf}</td>
                  <td>{s.ga}</td>
                  <td style={{ color: s.gd > 0 ? 'var(--advance)' : s.gd < 0 ? 'var(--crimson)' : 'var(--muted)', fontWeight: 600 }}>
                    {s.gd > 0 ? `+${s.gd}` : s.gd}
                  </td>
                  <td className="tnum" style={{ fontWeight: 700 }}>{s.points}</td>
                  <td style={{ padding: '10px 24px 10px 4px', textAlign: 'right' }}>
                    <span className="smallcaps" style={{
                      fontSize: 9, letterSpacing: '0.14em', fontWeight: 600,
                      color: isAdvance ? 'var(--advance)' : isThird ? '#8a6e2c' : 'var(--faint)',
                    }}>
                      {isAdvance ? '✓ Advance' : isThird ? '~ Third' : '— Out'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <footer style={{
        padding: '8px 18px', borderTop: '1px solid var(--hairline)',
        fontSize: 10, letterSpacing: '0.06em', color: 'var(--muted)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Tiebreakers · Pts → GD → GF → FIFA rank</span>
        <span>Updated continuously</span>
      </footer>
    </section>
  )
}

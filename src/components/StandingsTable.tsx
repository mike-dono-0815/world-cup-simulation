import type { GroupStanding } from '../types'
import { Flag } from './Flag'

interface Props {
  standings: GroupStanding[]
  advancingThirds: Set<string>  // team names of 3rd-place teams currently in top 8
}

export function StandingsTable({ standings, advancingThirds }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid var(--ink)', color: 'var(--navy)' }}>
            <th style={{ padding: '4px 6px', textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>Team</th>
            <th style={{ padding: '4px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>Pld</th>
            <th style={{ padding: '4px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>W</th>
            <th style={{ padding: '4px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>D</th>
            <th style={{ padding: '4px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>L</th>
            <th style={{ padding: '4px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>GF:GA</th>
            <th style={{ padding: '4px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>GD</th>
            <th style={{ padding: '4px 6px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700 }}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const isAutoAdvance = i < 2
            const isThirdAdvance = i === 2 && advancingThirds.has(s.team)
            const bg = isAutoAdvance
              ? 'rgba(46,107,59,0.10)'
              : isThirdAdvance
              ? 'rgba(46,107,59,0.05)'
              : 'transparent'
            const borderLeft = isAutoAdvance
              ? '3px solid var(--pitch)'
              : isThirdAdvance
              ? '3px dashed var(--pitch)'
              : '3px solid transparent'

            return (
              <tr
                key={s.team}
                style={{ backgroundColor: bg, borderLeft, borderBottom: '1px solid rgba(27,26,20,0.1)' }}
              >
                <td style={{ padding: '5px 6px', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Flag code={s.flagCode} size={18} />
                  <span style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{s.team}</span>
                </td>
                <td style={{ padding: '5px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{s.played}</td>
                <td style={{ padding: '5px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{s.won}</td>
                <td style={{ padding: '5px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{s.drawn}</td>
                <td style={{ padding: '5px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{s.lost}</td>
                <td style={{ padding: '5px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{s.gf}:{s.ga}</td>
                <td style={{ padding: '5px 4px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: s.gd > 0 ? 'var(--pitch)' : s.gd < 0 ? 'var(--crimson)' : 'inherit' }}>
                  {s.gd > 0 ? `+${s.gd}` : s.gd}
                </td>
                <td style={{ padding: '5px 6px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{s.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

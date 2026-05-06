import type { GroupStanding } from '../types'
import { Flag } from './Flag'
import { useLanguage } from '../lib/LanguageContext'
import { rankThirdPlaceTeams } from '../lib/standings'

interface Props {
  allGroupStandings: Map<string, GroupStanding[]>
  advancingThirds: Set<string>
  groupCounts: Record<string, number>
}

export function BestThirdTab({ allGroupStandings, advancingThirds, groupCounts }: Props) {
  const { t } = useLanguage()
  const ranked = rankThirdPlaceTeams(allGroupStandings)
  const groupsDone = Object.values(groupCounts).filter(c => c === 6).length

  return (
    <section className="bs-card">
      <header style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '14px 18px 12px',
      }} className="double-rule">
        <div>
          <div className="smallcaps" style={{ marginBottom: 2 }}>{t.the_table}</div>
          <div className="font-didot" style={{ fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.005em' }}>
            {t.best3rd_title}<br className="mob-br" />{t.best3rd_title_2}
            {groupsDone > 0 && (
              <span style={{ fontSize: 22, whiteSpace: 'nowrap' }}> ({groupsDone}/12)</span>
            )}
          </div>
        </div>
        <div className="smallcaps" style={{ textAlign: 'right', lineHeight: 1.5 }}>
          <span style={{ color: 'var(--third)' }}>{t.best_eight_third}</span>
        </div>
      </header>

      <div style={{ overflowX: 'auto' }}>
        <table className="bs-table">
          <thead>
            <tr>
              <th className="first">{t.col_group}</th>
              <th style={{ textAlign: 'left', paddingLeft: 8 }}>{t.col_club}</th>
              <th>{t.col_pld}</th>
              <th>{t.col_w}</th>
              <th>{t.col_d}</th>
              <th>{t.col_l}</th>
              <th>{t.col_gf}</th>
              <th>{t.col_ga}</th>
              <th>{t.col_gd}</th>
              <th>{t.col_pts}</th>
              <th className="last">{t.col_status}</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map(({ group, standing: s }, i) => {
              const isAdvancing = advancingThirds.has(s.team)
              const accent = isAdvancing ? 'var(--third)' : 'transparent'
              return (
                <tr key={s.team} className={i % 2 === 1 ? 'alt' : ''}>
                  <td style={{ padding: '10px 0 10px 24px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: accent,
                    }} />
                    <span className="font-didot" style={{ fontSize: 15, fontWeight: 700 }}>{group}</span>
                  </td>
                  <td style={{ textAlign: 'left', padding: '10px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="font-didot tnum" style={{
                        fontSize: 16, lineHeight: 1, color: 'var(--muted)', minWidth: 28, textAlign: 'right',
                      }}>{i + 1}.</span>
                      <Flag code={s.flagCode} size={20} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{t.teamName(s.team)}</span>
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
                      color: isAdvancing ? '#8a6e2c' : 'var(--faint)',
                    }}>
                      {isAdvancing ? t.status_third : t.status_out}
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
        <span>{t.tiebreakers}</span>
        <span>{t.updated_continuously}</span>
      </footer>
    </section>
  )
}

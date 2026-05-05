import type { GroupMatch, MatchResult, GroupStanding } from '../types'
import { StandingsTable } from './StandingsTable'
import { MatchCard } from './MatchCard'
import { useLanguage } from '../lib/LanguageContext'

interface Props {
  groupId: string
  matches: GroupMatch[]
  standings: GroupStanding[]
  advancingThirds: Set<string>
  results: Record<number, MatchResult>
  onUpdate: (serial: number, r: MatchResult) => void
  onClear: (serial: number) => void
}

export function GroupTab({ groupId, matches, standings, advancingThirds, results, onUpdate, onClear }: Props) {
  const { t } = useLanguage()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <StandingsTable standings={standings} advancingThirds={advancingThirds} groupId={groupId} />

      <section>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12,
          paddingBottom: 8, borderBottom: '1px solid var(--ink)',
        }}>
          <h3 className="font-didot" style={{ fontSize: 24, margin: 0, lineHeight: 1 }}>
            {t.the_fixtures}
          </h3>
          <span className="smallcaps">{t.six_matches_tagline}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {matches.map(m => (
            <MatchCard
              key={m.serial}
              label={`#${m.serial}`}
              serial={m.serial}
              date={m.date}
              venue={m.venue}
              oddsHome={m.oddsHome}
              oddsDraw={m.oddsDraw}
              oddsAway={m.oddsAway}
              home={{ name: m.home, flagCode: m.homeFlagCode }}
              away={{ name: m.away, flagCode: m.awayFlagCode }}
              result={results[m.serial]}
              onUpdate={r => onUpdate(m.serial, r)}
              onClear={() => onClear(m.serial)}
              isKO={false}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

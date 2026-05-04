import type { GroupMatch, MatchResult, GroupStanding } from '../types'
import { StandingsTable } from './StandingsTable'
import { MatchCard } from './MatchCard'

interface Props {
  groupId: string
  matches: GroupMatch[]
  standings: GroupStanding[]
  advancingThirds: Set<string>
  results: Record<number, MatchResult>
  onUpdate: (serial: number, r: MatchResult) => void
}

export function GroupTab({ groupId, matches, standings, advancingThirds, results, onUpdate }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Standings table */}
      <div className="sticker-card" style={{ borderRadius: 6, padding: '10px 12px' }}>
        <div className="foil-band" style={{ margin: '-10px -12px 10px' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span className="font-archivo" style={{ fontSize: 18, color: 'var(--navy)' }}>Group {groupId}</span>
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(27,26,20,0.4)' }}>STANDINGS</span>
        </div>
        <StandingsTable standings={standings} advancingThirds={advancingThirds} />
      </div>

      {/* Match cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {matches.map(m => (
          <MatchCard
            key={m.serial}
            label={`#${m.serial}`}
            home={{ name: m.home, flagCode: m.homeFlagCode }}
            away={{ name: m.away, flagCode: m.awayFlagCode }}
            result={results[m.serial]}
            onUpdate={r => onUpdate(m.serial, r)}
            isKO={false}
          />
        ))}
      </div>
    </div>
  )
}

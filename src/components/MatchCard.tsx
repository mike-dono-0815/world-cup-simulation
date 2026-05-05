import type { MatchResult, KOTeam } from '../types'
import { ScoreEntry } from './ScoreEntry'
import { Flag } from './Flag'

interface Team {
  name: string
  flagCode: string
  qualLabel?: string
}

interface Props {
  label: string
  home: Team
  away: Team
  result: MatchResult | undefined
  onUpdate: (r: MatchResult) => void
  isKO?: boolean
  disabled?: boolean
}

export function MatchCard({ label, home, away, result, onUpdate, isKO, disabled }: Props) {
  const hs = result?.homeScore ?? null
  const as_ = result?.awayScore ?? null
  const isDraw = hs != null && as_ != null && hs === as_
  const penWinner = result?.penaltyWinner

  function setHome(v: number) {
    onUpdate({ homeScore: v, awayScore: as_, penaltyWinner: undefined })
  }
  function setAway(v: number) {
    onUpdate({ homeScore: hs, awayScore: v, penaltyWinner: undefined })
  }
  function setPenalty(w: 'home' | 'away') {
    onUpdate({ homeScore: hs, awayScore: as_, penaltyWinner: w })
  }

  const hasResult = hs != null && as_ != null
  const isComplete = hasResult && (!isKO || !isDraw || penWinner != null)

  return (
    <div
      className="sticker-card"
      style={{
        borderRadius: 4,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {/* Header row: label + completion indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="serial-number">{label}</span>
        {isComplete && (
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--pitch)', fontWeight: 700 }}>
            ✓
          </span>
        )}
      </div>

      {/* Score row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Home */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <Flag code={home.flagCode} size={24} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {home.name}
            </div>
            {home.qualLabel && (
              <div className="serial-number" style={{ fontSize: 10 }}>{home.qualLabel}</div>
            )}
          </div>
        </div>

        {/* Score entries */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <ScoreEntry value={hs} onChange={setHome} disabled={disabled} />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(27,26,20,0.4)' }}>:</span>
          <ScoreEntry value={as_} onChange={setAway} disabled={disabled} />
        </div>

        {/* Away */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', minWidth: 0 }}>
          <div style={{ textAlign: 'right', minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {away.name}
            </div>
            {away.qualLabel && (
              <div className="serial-number" style={{ fontSize: 10, textAlign: 'right' }}>{away.qualLabel}</div>
            )}
          </div>
          <Flag code={away.flagCode} size={24} />
        </div>
      </div>

      {/* Penalty picker (KO + draw only) */}
      {isKO && isDraw && !disabled && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 4, borderTop: '1px dashed rgba(27,26,20,0.2)' }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--navy)', fontWeight: 700, flexShrink: 0 }}>
            PENS:
          </span>
          <button
            className={`penalty-btn${penWinner === 'home' ? ' selected' : ''}`}
            onClick={() => setPenalty('home')}
          >
            {home.name}
          </button>
          <button
            className={`penalty-btn${penWinner === 'away' ? ' selected' : ''}`}
            onClick={() => setPenalty('away')}
          >
            {away.name}
          </button>
        </div>
      )}

      {/* Show penalty result when complete */}
      {isKO && isDraw && isComplete && disabled && (
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--navy)', fontWeight: 700 }}>
          PENS: {penWinner === 'home' ? home.name : away.name}
        </div>
      )}
    </div>
  )
}

export function TBDMatchCard({ label, homeLabel, awayLabel, home, away }: {
  label: string
  homeLabel: string
  awayLabel: string
  home?: KOTeam | null
  away?: KOTeam | null
}) {
  return (
    <div
      className="sticker-card"
      style={{
        borderRadius: 4,
        padding: '10px 12px',
        opacity: 0.55,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <span className="serial-number">{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Home side */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          {home ? (
            <>
              <Flag code={home.flagCode} size={24} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {home.name}
                </div>
                <div className="serial-number" style={{ fontSize: 10 }}>{homeLabel}</div>
              </div>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--navy)' }}>{homeLabel}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(27,26,20,0.5)' }}>TBD</div>
            </div>
          )}
        </div>

        <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(27,26,20,0.25)', flexShrink: 0 }}>vs</span>

        {/* Away side */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', minWidth: 0 }}>
          {away ? (
            <>
              <div style={{ textAlign: 'right', minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {away.name}
                </div>
                <div className="serial-number" style={{ fontSize: 10, textAlign: 'right' }}>{awayLabel}</div>
              </div>
              <Flag code={away.flagCode} size={24} />
            </>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--navy)', textAlign: 'right' }}>{awayLabel}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(27,26,20,0.5)', textAlign: 'right' }}>TBD</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { MatchResult } from '../types'
import { ScoreEntry } from './ScoreEntry'
import { Flag } from './Flag'
import { useLanguage } from '../lib/LanguageContext'

interface Team {
  name: string
  flagCode: string
  qualLabel?: string
}

interface Props {
  label: string
  serial?: number
  date?: string
  venue?: string
  oddsHome?: number
  oddsDraw?: number
  oddsAway?: number
  home: Team
  away: Team
  result: MatchResult | undefined
  onUpdate: (r: MatchResult) => void
  onClear?: () => void
  isKO?: boolean
  disabled?: boolean
}

export function MatchCard({
  label, date, venue, oddsHome, oddsDraw, oddsAway,
  home, away, result, onUpdate, onClear, isKO, disabled,
}: Props) {
  const { t } = useLanguage()
  const hs = result?.homeScore ?? null
  const as_ = result?.awayScore ?? null
  const isDraw = hs != null && as_ != null && hs === as_
  const penWinner = result?.penaltyWinner
  const psoH = result?.psoHomeScore ?? null
  const psoA = result?.psoAwayScore ?? null
  const isAet = result?.resultType === 'aet'
  const isPso = isDraw && penWinner != null

  function setHome(v: number) {
    onUpdate({ homeScore: v, awayScore: as_, penaltyWinner: undefined, resultType: undefined })
  }
  function setAway(v: number) {
    onUpdate({ homeScore: hs, awayScore: v, penaltyWinner: undefined, resultType: undefined })
  }
  function setPenalty(w: 'home' | 'away') {
    onUpdate({ homeScore: hs, awayScore: as_, penaltyWinner: w })
  }
  function toggleAet() {
    onUpdate({ homeScore: hs, awayScore: as_, resultType: isAet ? undefined : 'aet' })
  }

  const hasResult = hs != null && as_ != null
  const isComplete = hasResult && (!isKO || !isDraw || penWinner != null)
  const isOfficial = !!result?.official
  const winner: 'home' | 'away' | null =
    isKO && hasResult
      ? hs! > as_! ? 'home' : as_! > hs! ? 'away' : penWinner ?? null
      : null

  const [activeScore, setActiveScore] = useState<'home' | 'away' | null>(null)

  function handleScoreTap(which: 'home' | 'away') {
    if (disabled || isOfficial) return
    if (window.innerWidth > 600) return
    setActiveScore(prev => prev === which ? null : which)
  }

  // Probability bar from odds (if provided)
  let pH = 0, pD = 0, pA = 0
  if (oddsHome && oddsDraw && oddsAway) {
    const total = 1/oddsHome + 1/oddsDraw + 1/oddsAway
    pH = Math.round((1/oddsHome) / total * 100)
    pD = Math.round((1/oddsDraw) / total * 100)
    pA = 100 - pH - pD
  }

  return (
    <article className="bs-card" style={{ opacity: disabled ? 0.55 : 1 }}>
      {/* Header */}
      <header className="bs-match-header" style={{
        padding: '10px 16px 8px', borderBottom: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
          <span className="bs-match-serial font-didot tnum" style={{ fontSize: 16, lineHeight: 1, color: 'var(--muted)' }}>
            {label}
          </span>
          {date && (
            <span className="bs-match-date smallcaps" style={{
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {t.formatMatchDate(date)}
            </span>
          )}
          {venue && (
            <span className="bs-match-venue smallcaps" style={{ whiteSpace: 'nowrap' }}>
              {date ? '· ' : ''}{venue}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
            color: isOfficial ? '#1a6b3c' : isComplete ? 'var(--advance)' : 'var(--faint)',
          }}>
            {isOfficial ? t.official_badge : isComplete ? t.reported : t.pending}
          </span>
          {onClear && !isOfficial && (
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={e => { e.stopPropagation(); onClear() }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--faint)', fontSize: 14, lineHeight: 1, padding: '0 2px',
                fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center',
                visibility: hasResult ? 'visible' : 'hidden',
              }}
              title={t.clear_result_aria}
              aria-label={t.clear_result_aria}
            >×</button>
          )}
        </div>
      </header>

      {/* Body */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Home */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {winner === 'home'
            ? <div style={{ padding: 3, borderRadius: '50%', border: '2px solid var(--ink)', lineHeight: 0, flexShrink: 0 }}><Flag code={home.flagCode} size={26} /></div>
            : <Flag code={home.flagCode} size={26} />
          }
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: winner === 'home' ? 700 : 600, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.teamName(home.name)}
            </div>
            {home.qualLabel && (
              <div className="smallcaps" style={{ fontSize: 9, marginTop: 2, color: 'var(--faint)' }}>
                {home.qualLabel}
              </div>
            )}
          </div>
        </div>

        {/* Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isOfficial && hasResult ? (
              <>
                <span className="tnum bs-score-num" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1, minWidth: 28, textAlign: 'center' }}>{hs}</span>
                <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: 'var(--muted)', padding: '0 2px' }}>:</span>
                <span className="tnum bs-score-num" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1, minWidth: 28, textAlign: 'center' }}>{as_}</span>
              </>
            ) : (
              <>
                <ScoreEntry value={hs} onChange={setHome} disabled={disabled || isOfficial} onTap={() => handleScoreTap('home')} isActive={activeScore === 'home'} />
                <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: 'var(--muted)', padding: '0 2px' }}>:</span>
                <ScoreEntry value={as_} onChange={setAway} disabled={disabled || isOfficial} onTap={() => handleScoreTap('away')} isActive={activeScore === 'away'} />
              </>
            )}
          </div>
          {/* AET / PSO pill */}
          {isKO && hasResult && isPso && (
            <span className="smallcaps" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)' }}>
              {psoH != null && psoA != null ? `${psoH} – ${psoA} pen` : 'pen'}
            </span>
          )}
          {isKO && hasResult && isAet && !isPso && (
            isOfficial ? (
              <span className="smallcaps" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)' }}>{t.label_aet}</span>
            ) : (
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={toggleAet}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
              >
                <span className="smallcaps" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--advance)' }}>{t.label_aet} ×</span>
              </button>
            )
          )}
          {isKO && hasResult && !isPso && !isAet && !isDraw && !isOfficial && (
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={toggleAet}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
            >
              <span className="smallcaps" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--faint)' }}>+ {t.label_aet}</span>
            </button>
          )}
        </div>

        {/* Away */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', minWidth: 0 }}>
          <div style={{ minWidth: 0, textAlign: 'right' }}>
            <div style={{ fontSize: 15, fontWeight: winner === 'away' ? 700 : 600, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.teamName(away.name)}
            </div>
            {away.qualLabel && (
              <div className="smallcaps" style={{ fontSize: 9, marginTop: 2, color: 'var(--faint)' }}>
                {away.qualLabel}
              </div>
            )}
          </div>
          {winner === 'away'
            ? <div style={{ padding: 3, borderRadius: '50%', border: '2px solid var(--ink)', lineHeight: 0, flexShrink: 0 }}><Flag code={away.flagCode} size={26} /></div>
            : <Flag code={away.flagCode} size={26} />
          }
        </div>
      </div>

      {/* Mobile number-pad keypad strip */}
      {activeScore && !disabled && !isOfficial && (
        <div className="bs-keypad">
          {[0,1,2,3,4,5,6,7,8,9].map(d => (
            <button
              key={d}
              className="bs-keypad-btn"
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                if (activeScore === 'home') setHome(d)
                else setAway(d)
                setActiveScore(null)
              }}
            >{d}</button>
          ))}
        </div>
      )}

      {/* Penalty winner (read-only) for official KO draws */}
      {isKO && isDraw && isOfficial && penWinner && (
        <div style={{
          padding: '6px 16px', borderTop: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="smallcaps" style={{ fontSize: 9, letterSpacing: '0.22em' }}>{t.penalties_won_by}</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            {t.teamName(penWinner === 'home' ? home.name : away.name)}
          </span>
        </div>
      )}

      {/* Penalty picker (KO + draw only) */}
      {isKO && isDraw && !disabled && !isOfficial && (
        <div style={{
          padding: '8px 16px', borderTop: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span className="smallcaps" style={{ fontSize: 9, letterSpacing: '0.22em' }}>
            {t.penalties_won_by}
          </span>
          <button
            className={`bs-pen${penWinner === 'home' ? ' selected' : ''}`}
            onClick={() => setPenalty('home')}
          >
            {t.teamName(home.name)}
          </button>
          <button
            className={`bs-pen${penWinner === 'away' ? ' selected' : ''}`}
            onClick={() => setPenalty('away')}
          >
            {t.teamName(away.name)}
          </button>
        </div>
      )}

      {/* Footer — odds */}
      {oddsHome && oddsDraw && oddsAway && (
        <footer style={{
          padding: '6px 16px', borderTop: '1px solid var(--hairline)',
          background: 'rgba(26,24,19,0.025)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span className="smallcaps" style={{ fontSize: 9, letterSpacing: '0.18em' }}>
            {t.the_odds}
          </span>
          <div style={{ flex: 1, display: 'flex', height: 4, border: '1px solid var(--ink)' }}>
            <div style={{ width: `${pH}%`, background: '#1A1813' }} title={`Home ${pH}%`} />
            <div style={{ width: `${pD}%`, background: '#9a9384' }} title={`Draw ${pD}%`} />
            <div style={{ width: `${pA}%`, background: '#A52A2A' }} title={`Away ${pA}%`} />
          </div>
          <span className="font-didot tnum" style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            {oddsHome.toFixed(2)} · {oddsDraw.toFixed(2)} · {oddsAway.toFixed(2)}
          </span>
        </footer>
      )}
    </article>
  )
}

export function TBDMatchCard({
  label, homeLabel, awayLabel, date, venue,
}: { label: string; homeLabel: string; awayLabel: string; home?: unknown; away?: unknown; date?: string; venue?: string }) {
  const { t } = useLanguage()
  return (
    <article className="bs-card" style={{ opacity: 0.5 }}>
      <header style={{
        padding: '10px 16px 8px', borderBottom: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
          <span className="font-didot tnum" style={{ fontSize: 16, color: 'var(--muted)' }}>{label}</span>
          {date && (
            <span className="bs-match-date smallcaps" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {t.formatMatchDate(date)}
            </span>
          )}
          {venue && (
            <span className="bs-match-venue smallcaps" style={{ whiteSpace: 'nowrap' }}>
              {date ? '· ' : ''}{venue}
            </span>
          )}
        </div>
        <span className="smallcaps" style={{ fontSize: 9 }}>{t.tbd_awaits}</span>
      </header>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div className="smallcaps" style={{ fontSize: 9 }}>{homeLabel}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--faint)' }}>TBD</div>
        </div>
        <span className="font-didot" style={{ fontSize: 22, color: 'var(--faint)' }}>vs</span>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div className="smallcaps" style={{ fontSize: 9 }}>{awayLabel}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--faint)' }}>TBD</div>
        </div>
      </div>
    </article>
  )
}

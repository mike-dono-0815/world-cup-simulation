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

function formatDate(iso?: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    })
  } catch { return iso }
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

  const [activeScore, setActiveScore] = useState<'home' | 'away' | null>(null)

  function handleScoreTap(which: 'home' | 'away') {
    if (disabled) return
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
              {formatDate(date)}
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
            color: isComplete ? 'var(--advance)' : 'var(--faint)',
          }}>
            {isComplete ? t.reported : t.pending}
          </span>
          {onClear && (
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
          <Flag code={home.flagCode} size={26} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <ScoreEntry value={hs} onChange={setHome} disabled={disabled} onTap={() => handleScoreTap('home')} isActive={activeScore === 'home'} />
          <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: 'var(--muted)', padding: '0 2px' }}>:</span>
          <ScoreEntry value={as_} onChange={setAway} disabled={disabled} onTap={() => handleScoreTap('away')} isActive={activeScore === 'away'} />
        </div>

        {/* Away */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', minWidth: 0 }}>
          <div style={{ minWidth: 0, textAlign: 'right' }}>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.teamName(away.name)}
            </div>
            {away.qualLabel && (
              <div className="smallcaps" style={{ fontSize: 9, marginTop: 2, color: 'var(--faint)' }}>
                {away.qualLabel}
              </div>
            )}
          </div>
          <Flag code={away.flagCode} size={26} />
        </div>
      </div>

      {/* Mobile number-pad keypad strip */}
      {activeScore && !disabled && (
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

      {/* Penalty picker (KO + draw only) */}
      {isKO && isDraw && !disabled && (
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
  label, homeLabel, awayLabel,
}: { label: string; homeLabel: string; awayLabel: string; home?: unknown; away?: unknown }) {
  const { t } = useLanguage()
  return (
    <article className="bs-card" style={{ opacity: 0.5 }}>
      <header style={{
        padding: '10px 16px 8px', borderBottom: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <span className="font-didot tnum" style={{ fontSize: 16, color: 'var(--muted)' }}>{label}</span>
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

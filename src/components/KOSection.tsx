import { useState } from 'react'
import type { KOMatch, MatchResult } from '../types'
import { MatchCard, TBDMatchCard } from './MatchCard'
import { useLanguage } from '../lib/LanguageContext'

function tbd(slot: string) {
  return { name: 'TBD', flagCode: '', qualLabel: slot }
}
import { Flag } from './Flag'
import { KO_SERIALS_BY_STAGE, BRACKET_TREE } from '../lib/bracket'

interface Props {
  koMatches: KOMatch[]
  results: Record<number, MatchResult>
  onUpdate: (serial: number, r: MatchResult) => void
  onClear: (serial: number) => void
  filterStage?: KOMatch['stage'] | KOMatch['stage'][] | 'all'
}

type Stage = KOMatch['stage']
const STAGE_ORDER: Stage[] = ['r32', 'r16', 'qf', 'sf', '3rd', 'final']

// Next-stage serials whose BRACKET_TREE entries define the pairs for each stage
const NEXT_STAGE_SERIALS: Partial<Record<Stage, number[]>> = {
  r32: KO_SERIALS_BY_STAGE.r16,
  r16: KO_SERIALS_BY_STAGE.qf,
  qf:  KO_SERIALS_BY_STAGE.sf,
  sf:  [104],
}

function getPairs(stage: Stage): [number, number][] {
  const nextSerials = NEXT_STAGE_SERIALS[stage]
  if (!nextSerials) return []
  return nextSerials
    .filter(s => BRACKET_TREE[s] !== undefined)
    .map(s => BRACKET_TREE[s] as [number, number])
}

export function KOSection({ koMatches, results, onUpdate, onClear, filterStage = 'all' }: Props) {
  const { t } = useLanguage()
  const bySerial = new Map(koMatches.map(m => [m.serial, m]))
  const stages = filterStage === 'all' ? STAGE_ORDER : Array.isArray(filterStage) ? filterStage : [filterStage as Stage]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {stages.map(stage => {
        const serials = KO_SERIALS_BY_STAGE[stage]
        const stageMatches = serials.map(s => bySerial.get(s)).filter(Boolean) as KOMatch[]
        if (stageMatches.length === 0) return null

        const playedInStage = stageMatches.filter(m => {
          const r = results[m.serial]
          return r?.homeScore != null && r?.awayScore != null
        }).length
        const r32Provisional = stage === 'r32' && stageMatches.some(m => !m.home || !m.away)

        return (
          <section key={stage} id={`ko-${stage}`}>
            <header style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12,
              marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--ink)',
            }}>
              <h2 className="font-didot" style={{ fontSize: 26, margin: 0, lineHeight: 1, letterSpacing: '-0.005em' }}>
                {({ r32: t.phase_r32, r16: t.phase_r16, qf: t.phase_qf, sf: t.phase_sf, '3rd': t.phase_3rd, final: t.phase_final } as Record<Stage, string>)[stage]}
                {r32Provisional && (
                  <span className="font-didot" style={{ fontSize: 14, fontWeight: 400, fontStyle: 'italic', color: 'var(--muted)', marginLeft: 8 }}>
                    (As It Stands)
                  </span>
                )}
              </h2>
              <span className="smallcaps">
                {t.ko_reported(playedInStage, stageMatches.length)}
              </span>
            </header>

            {stage === 'final' ? (
              <FinalCard match={stageMatches[0]} result={results[stageMatches[0].serial]} onUpdate={onUpdate} />
            ) : stage === '3rd' ? (
              (() => {
                const ko = stageMatches[0]
                if (!ko.home && !ko.away) return <TBDMatchCard label={ko.label} homeLabel={ko.homeSlot} awayLabel={ko.awaySlot} />
                return <MatchCard label={ko.label} home={ko.home ?? tbd(ko.homeSlot)} away={ko.away ?? tbd(ko.awaySlot)} result={results[ko.serial]} onUpdate={r => onUpdate(ko.serial, r)} onClear={() => onClear(ko.serial)} isKO disabled={!ko.home || !ko.away} />
              })()
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {getPairs(stage).map((pair, pairIdx, arr) => (
                  <div key={pairIdx}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {pair.map(serial => {
                        const ko = bySerial.get(serial)
                        if (!ko) return null
                        if (!ko.home && !ko.away) {
                          return (
                            <TBDMatchCard
                              key={ko.serial}
                              label={ko.label}
                              homeLabel={ko.homeSlot}
                              awayLabel={ko.awaySlot}
                            />
                          )
                        }
                        const isPartial = !ko.home || !ko.away
                        return (
                          <MatchCard
                            key={ko.serial}
                            label={ko.label}
                            home={ko.home ?? tbd(ko.homeSlot)}
                            away={ko.away ?? tbd(ko.awaySlot)}
                            result={results[ko.serial]}
                            onUpdate={r => onUpdate(ko.serial, r)}
                            onClear={() => onClear(ko.serial)}
                            isKO
                            disabled={isPartial}
                          />
                        )
                      })}
                    </div>
                    {pairIdx < arr.length - 1 && (
                      <div style={{ margin: '14px 0', borderBottom: '1px solid var(--hairline)' }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}


function FinalCard({ match, result, onUpdate }: {
  match: KOMatch
  result: MatchResult | undefined
  onUpdate: (serial: number, r: MatchResult) => void
}) {
  const { t } = useLanguage()
  const [activeScore, setActiveScore] = useState<'home' | 'away' | null>(null)

  if (!match.home && !match.away) {
    return (
      <div className="bs-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div className="smallcaps" style={{ marginBottom: 6 }}>{t.the_final_title}</div>
        <div className="font-didot" style={{ fontSize: 32, color: 'var(--faint)' }}>
          {t.awaiting_finalists}
        </div>
      </div>
    )
  }
  const isPartial = !match.home || !match.away
  const isOfficial = !!result?.official
  const home = match.home ?? tbd(match.homeSlot)
  const away = match.away ?? tbd(match.awaySlot)

  const hs = result?.homeScore ?? null
  const as_ = result?.awayScore ?? null
  const isDraw = hs != null && as_ != null && hs === as_
  const penWinner = result?.penaltyWinner

  function setHome(v: number) { onUpdate(match.serial, { homeScore: v, awayScore: as_, penaltyWinner: undefined }) }
  function setAway(v: number) { onUpdate(match.serial, { homeScore: hs, awayScore: v, penaltyWinner: undefined }) }
  function setPenalty(w: 'home' | 'away') { onUpdate(match.serial, { homeScore: hs, awayScore: as_, penaltyWinner: w }) }

  function handleScoreTap(which: 'home' | 'away') {
    if (isPartial || isOfficial) return
    if (window.innerWidth > 600) return
    setActiveScore(prev => prev === which ? null : which)
  }

  return (
    <article className="bs-card" style={{ opacity: isPartial ? 0.65 : 1 }}>
      <div style={{ padding: '24px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1 }}>
            {t.the_final_title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>
          {/* Home */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2, textAlign: 'right' }}>{t.teamName(home.name)}</div>
            <Flag code={home.flagCode} size={44} />
          </div>

          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <ScoreBig value={hs} onChange={setHome} disabled={isPartial || isOfficial} onTap={() => handleScoreTap('home')} isActive={activeScore === 'home'} />
            <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: 'var(--muted)', padding: '0 2px' }}>:</span>
            <ScoreBig value={as_} onChange={setAway} disabled={isPartial || isOfficial} onTap={() => handleScoreTap('away')} isActive={activeScore === 'away'} />
          </div>

          {/* Away */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>{t.teamName(away.name)}</div>
            <Flag code={away.flagCode} size={44} />
          </div>
        </div>

        {isDraw && !isPartial && !isOfficial && (
          <div style={{
            marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--hairline)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <span className="smallcaps">{t.penalties_won_by}</span>
            <button className={`bs-pen${penWinner === 'home' ? ' selected' : ''}`} onClick={() => setPenalty('home')}>
              {t.teamName(home.name)}
            </button>
            <button className={`bs-pen${penWinner === 'away' ? ' selected' : ''}`} onClick={() => setPenalty('away')}>
              {t.teamName(away.name)}
            </button>
          </div>
        )}
      </div>

      {activeScore && !isPartial && !isOfficial && (
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
    </article>
  )
}

function ScoreBig({ value, onChange, disabled, onTap, isActive }: {
  value: number | null; onChange: (v: number) => void; disabled?: boolean; onTap?: () => void; isActive?: boolean
}) {
  const v = value ?? 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button className="bs-step bs-score-step" onMouseDown={e => e.preventDefault()} onClick={() => !disabled && onChange(Math.max(0, v - 1))} disabled={disabled}>−</button>
      <span
        className={`tnum bs-score-num${isActive ? ' active' : ''}`}
        style={{ fontSize: 56, fontWeight: 700, lineHeight: 1, minWidth: 40, textAlign: 'center', color: value == null ? 'var(--faint)' : 'var(--ink)' }}
        onClick={onTap}
      >
        {value == null ? '–' : value}
      </span>
      <button className="bs-step bs-score-step" onMouseDown={e => e.preventDefault()} onClick={() => !disabled && onChange(v + 1)} disabled={disabled}>+</button>
    </div>
  )
}

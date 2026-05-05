import type { KOMatch, MatchResult } from '../types'
import { MatchCard, TBDMatchCard } from './MatchCard'
import { Flag } from './Flag'
import { STAGE_LABELS, KO_SERIALS_BY_STAGE } from '../lib/bracket'

interface Props {
  koMatches: KOMatch[]
  results: Record<number, MatchResult>
  onUpdate: (serial: number, r: MatchResult) => void
}

type Stage = KOMatch['stage']
const STAGE_ORDER: Stage[] = ['r32', 'r16', 'qf', 'sf', '3rd', 'final']

export function KOSection({ koMatches, results, onUpdate }: Props) {
  const bySerial = new Map(koMatches.map(m => [m.serial, m]))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {STAGE_ORDER.map(stage => {
        const serials = KO_SERIALS_BY_STAGE[stage]
        const stageMatches = serials.map(s => bySerial.get(s)).filter(Boolean) as KOMatch[]
        if (stageMatches.length === 0) return null

        return (
          <section key={stage} id={`ko-${stage}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <h2 className="section-heading" style={{ fontSize: 20, margin: 0 }}>
                {STAGE_LABELS[stage]}
              </h2>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px dashed rgba(27,26,20,0.25)' }} />
            </div>

            {stage === 'final' ? (
              <FinalCard match={stageMatches[0]} result={results[stageMatches[0].serial]} onUpdate={onUpdate} />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: stage === 'r32' ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 8,
              }}>
                {stageMatches.map(ko => {
                  if (!ko.home || !ko.away) {
                    return (
                      <TBDMatchCard
                        key={ko.serial}
                        label={ko.label}
                        homeLabel={ko.homeSlot}
                        awayLabel={ko.awaySlot}
                        home={ko.home}
                        away={ko.away}
                      />
                    )
                  }
                  return (
                    <MatchCard
                      key={ko.serial}
                      label={ko.label}
                      home={ko.home}
                      away={ko.away}
                      result={results[ko.serial]}
                      onUpdate={r => onUpdate(ko.serial, r)}
                      isKO
                    />
                  )
                })}
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
  if (!match.home || !match.away) {
    return (
      <div className="sticker-card champion-card" style={{ borderRadius: 8, padding: 24, textAlign: 'center' }}>
        <div className="gold-foil-text font-archivo" style={{ fontSize: 28, marginBottom: 8 }}>WORLD CUP FINAL</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Finalists not yet determined</div>
      </div>
    )
  }

  const hs = result?.homeScore ?? null
  const as_ = result?.awayScore ?? null
  const isDraw = hs != null && as_ != null && hs === as_
  const penWinner = result?.penaltyWinner

  function setHome(v: number) { onUpdate(match.serial, { homeScore: v, awayScore: as_, penaltyWinner: undefined }) }
  function setAway(v: number) { onUpdate(match.serial, { homeScore: hs, awayScore: v, penaltyWinner: undefined }) }
  function setPenalty(w: 'home' | 'away') { onUpdate(match.serial, { homeScore: hs, awayScore: as_, penaltyWinner: w }) }

  return (
    <div className="sticker-card champion-card" style={{ borderRadius: 8, padding: 20 }}>
      <div className="gold-foil-text font-archivo" style={{ fontSize: 22, textAlign: 'center', marginBottom: 16 }}>
        ⚽ WORLD CUP FINAL — {match.label}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Home */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Flag code={match.home.flagCode} size={40} />
          <div style={{ color: 'white', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{match.home.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{match.home.qualLabel}</div>
        </div>

        {/* Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ScoreEntryLight value={hs} onChange={setHome} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, fontWeight: 700 }}>:</span>
            <ScoreEntryLight value={as_} onChange={setAway} />
          </div>
          {isDraw && (
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setPenalty('home')}
                style={{
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  padding: '2px 8px', border: '1.5px solid rgba(200,162,76,0.7)',
                  background: penWinner === 'home' ? 'var(--gold)' : 'transparent',
                  color: penWinner === 'home' ? 'var(--ink)' : 'var(--gold-light)',
                  cursor: 'pointer',
                }}
              >{match.home.name} pens</button>
              <button
                onClick={() => setPenalty('away')}
                style={{
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  padding: '2px 8px', border: '1.5px solid rgba(200,162,76,0.7)',
                  background: penWinner === 'away' ? 'var(--gold)' : 'transparent',
                  color: penWinner === 'away' ? 'var(--ink)' : 'var(--gold-light)',
                  cursor: 'pointer',
                }}
              >{match.away.name} pens</button>
            </div>
          )}
        </div>

        {/* Away */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Flag code={match.away.flagCode} size={40} />
          <div style={{ color: 'white', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{match.away.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{match.away.qualLabel}</div>
        </div>
      </div>
    </div>
  )
}

function ScoreEntryLight({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const v = value ?? 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <button
        onClick={() => onChange(v + 1)}
        style={{
          width: 24, height: 24, border: '1.5px solid rgba(200,162,76,0.5)',
          background: 'transparent', color: 'var(--gold-light)', cursor: 'pointer', fontSize: 12, fontWeight: 700,
        }}
      >▲</button>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: 'white', minWidth: 32, textAlign: 'center' }}>
        {value == null ? '–' : value}
      </span>
      <button
        onClick={() => onChange(Math.max(0, v - 1))}
        style={{
          width: 24, height: 24, border: '1.5px solid rgba(200,162,76,0.5)',
          background: 'transparent', color: 'var(--gold-light)', cursor: 'pointer', fontSize: 12, fontWeight: 700,
        }}
      >▼</button>
    </div>
  )
}

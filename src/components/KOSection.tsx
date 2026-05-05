import type { KOMatch, MatchResult } from '../types'
import { MatchCard, TBDMatchCard } from './MatchCard'
import { Flag } from './Flag'
import { STAGE_LABELS, KO_SERIALS_BY_STAGE } from '../lib/bracket'

interface Props {
  koMatches: KOMatch[]
  results: Record<number, MatchResult>
  onUpdate: (serial: number, r: MatchResult) => void
  filterStage?: KOMatch['stage'] | 'all'
}

type Stage = KOMatch['stage']
const STAGE_ORDER: Stage[] = ['r32', 'r16', 'qf', 'sf', '3rd', 'final']
const STAGE_NUM: Record<Stage, string> = {
  r32: 'I', r16: 'II', qf: 'III', sf: 'IV', '3rd': 'V', final: 'VI',
}

export function KOSection({ koMatches, results, onUpdate, filterStage = 'all' }: Props) {
  const bySerial = new Map(koMatches.map(m => [m.serial, m]))
  const stages = filterStage === 'all' ? STAGE_ORDER : [filterStage as Stage]

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

        return (
          <section key={stage} id={`ko-${stage}`}>
            <header style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12,
              marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--ink)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span className="font-didot" style={{
                  fontSize: 22, color: 'var(--muted)', lineHeight: 1, fontVariant: 'small-caps',
                }}>
                  {STAGE_NUM[stage]}.
                </span>
                <h2 className="font-didot" style={{ fontSize: 26, margin: 0, lineHeight: 1, letterSpacing: '-0.005em' }}>
                  {STAGE_LABELS[stage]}
                </h2>
              </div>
              <span className="smallcaps">
                {playedInStage}/{stageMatches.length} reported
              </span>
            </header>

            {stage === 'final' ? (
              <FinalCard match={stageMatches[0]} result={results[stageMatches[0].serial]} onUpdate={onUpdate} />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: stage === 'r32'
                  ? 'repeat(auto-fill, minmax(320px, 1fr))'
                  : 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: 10,
              }}>
                {stageMatches.map(ko => {
                  if (!ko.home || !ko.away) {
                    return (
                      <TBDMatchCard
                        key={ko.serial}
                        label={ko.label}
                        homeLabel={ko.homeSlot}
                        awayLabel={ko.awaySlot}
                      />
                    )
                  }
                  return (
                    <MatchCard
                      key={ko.serial}
                      label={ko.label}
                      serial={ko.serial}
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
      <div className="bs-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div className="smallcaps" style={{ marginBottom: 6 }}>The Final</div>
        <div className="font-didot" style={{ fontSize: 32, color: 'var(--faint)' }}>
          Awaiting finalists
        </div>
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
    <article className="bs-card" style={{ padding: '24px 28px' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div className="smallcaps" style={{ marginBottom: 4 }}>The Final · Match № 31</div>
        <div className="font-didot" style={{ fontSize: 38, lineHeight: 1, letterSpacing: '-0.01em' }}>
          The Championship
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>
        {/* Home */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.1 }}>{match.home.name}</div>
              <div className="smallcaps" style={{ fontSize: 9, marginTop: 2 }}>{match.home.qualLabel}</div>
            </div>
            <Flag code={match.home.flagCode} size={44} />
          </div>
        </div>

        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <ScoreBig value={hs} onChange={setHome} />
          <span className="font-didot" style={{ fontSize: 36, color: 'var(--muted)' }}>–</span>
          <ScoreBig value={as_} onChange={setAway} />
        </div>

        {/* Away */}
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <Flag code={match.away.flagCode} size={44} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.1 }}>{match.away.name}</div>
              <div className="smallcaps" style={{ fontSize: 9, marginTop: 2 }}>{match.away.qualLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {isDraw && (
        <div style={{
          marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <span className="smallcaps">Pens won by</span>
          <button className={`bs-pen${penWinner === 'home' ? ' selected' : ''}`} onClick={() => setPenalty('home')}>
            {match.home.name}
          </button>
          <button className={`bs-pen${penWinner === 'away' ? ' selected' : ''}`} onClick={() => setPenalty('away')}>
            {match.away.name}
          </button>
        </div>
      )}
    </article>
  )
}

function ScoreBig({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const v = value ?? 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button className="bs-step" onClick={() => onChange(Math.max(0, v - 1))}>−</button>
      <span className="font-didot tnum" style={{
        fontSize: 56, lineHeight: 1, minWidth: 40, textAlign: 'center',
        color: value == null ? 'var(--faint)' : 'var(--ink)',
      }}>
        {value == null ? '–' : value}
      </span>
      <button className="bs-step" onClick={() => onChange(v + 1)}>+</button>
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import type { MatchResult, AutoFillStrategy, KOMatch } from './types'
import { GROUP_MATCHES, GROUPS } from './data/schedule'
import { loadResults, saveResults, clearResults } from './lib/storage'
import { calculateGroupStandings, rankThirdPlaceTeams } from './lib/standings'
import { buildAllKOMatches, getTournamentWinner, KO_SERIALS_BY_STAGE } from './lib/bracket'
import { autoFillGroupMatch, autoFillKOMatch } from './lib/autofill'
import { GroupTab } from './components/GroupTab'
import { KOSection } from './components/KOSection'
import { AutoFillModal } from './components/AutoFillModal'
import { Flag } from './components/Flag'

type Phase = 'groups' | 'r32' | 'r16' | 'qf' | 'sf' | 'final'
const PHASES: Array<{ id: Phase; num: string; label: string; total: number }> = [
  { id: 'groups', num: 'I',   label: 'Group Stage',   total: 72 },
  { id: 'r32',    num: 'II',  label: 'Round of 32',   total: 16 },
  { id: 'r16',    num: 'III', label: 'Round of 16',   total: 8 },
  { id: 'qf',     num: 'IV',  label: 'Quarter-Finals', total: 4 },
  { id: 'sf',     num: 'V',   label: 'Semi-Finals',   total: 2 },
  { id: 'final',  num: 'VI',  label: 'The Final',     total: 2 }, // 3rd place + final
]

export default function App() {
  const [results, setResults] = useState<Record<number, MatchResult>>(() => loadResults())
  const [activePhase, setActivePhase] = useState<Phase>('groups')
  const [activeGroup, setActiveGroup] = useState<typeof GROUPS[number]>('A')
  const [showAutoFill, setShowAutoFill] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => { saveResults(results) }, [results])

  function applyWithKOCleanup(
    prev: Record<number, MatchResult>,
    next: Record<number, MatchResult>
  ): Record<number, MatchResult> {
    const before = new Map(buildAllKOMatches(prev).map(m => [m.serial, m]))
    for (const m of buildAllKOMatches(next)) {
      const old = before.get(m.serial)
      if (!old) continue
      if (m.home?.name !== old.home?.name || m.away?.name !== old.away?.name) {
        delete next[m.serial]
      }
    }
    return next
  }

  const updateResult = (serial: number, r: MatchResult) => {
    setResults(prev => applyWithKOCleanup(prev, { ...prev, [serial]: r }))
  }

  const allGroupStandings = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateGroupStandings>>()
    for (const g of GROUPS) map.set(g, calculateGroupStandings(GROUP_MATCHES.filter(m => m.group === g), results))
    return map
  }, [results])

  const advancingThirds = useMemo(() => {
    const ranked = rankThirdPlaceTeams(allGroupStandings)
    return new Set(ranked.slice(0, 8).map(t => t.standing.team))
  }, [allGroupStandings])

  const koMatches = useMemo(() => buildAllKOMatches(results), [results])
  const champion = useMemo(() => getTournamentWinner(results, koMatches), [results, koMatches])

  // Per-phase played counts
  const phaseCounts = useMemo(() => {
    const counts: Record<Phase, number> = { groups: 0, r32: 0, r16: 0, qf: 0, sf: 0, final: 0 }
    for (const m of GROUP_MATCHES) {
      const r = results[m.serial]
      if (r?.homeScore != null && r?.awayScore != null) counts.groups++
    }
    const isPlayed = (s: number) => {
      const r = results[s]; return r?.homeScore != null && r?.awayScore != null
    }
    counts.r32 = KO_SERIALS_BY_STAGE.r32.filter(isPlayed).length
    counts.r16 = KO_SERIALS_BY_STAGE.r16.filter(isPlayed).length
    counts.qf  = KO_SERIALS_BY_STAGE.qf.filter(isPlayed).length
    counts.sf  = KO_SERIALS_BY_STAGE.sf.filter(isPlayed).length
    counts.final = [...KO_SERIALS_BY_STAGE['3rd'], ...KO_SERIALS_BY_STAGE.final].filter(isPlayed).length
    return counts
  }, [results])

  const totalPlayed = phaseCounts.groups + phaseCounts.r32 + phaseCounts.r16 + phaseCounts.qf + phaseCounts.sf + phaseCounts.final

  // Per-group played count, for sub-nav progress
  const groupCounts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const g of GROUPS) {
      c[g] = GROUP_MATCHES.filter(m => m.group === g && results[m.serial]?.homeScore != null && results[m.serial]?.awayScore != null).length
    }
    return c
  }, [results])

  const fillPhase = useMemo((): Phase => {
    if (phaseCounts.groups < 72) return 'groups'
    if (phaseCounts.r32 < 16) return 'r32'
    if (phaseCounts.r16 < 8)  return 'r16'
    if (phaseCounts.qf  < 4)  return 'qf'
    if (phaseCounts.sf  < 2)  return 'sf'
    return 'final'
  }, [phaseCounts])

  const fillPhaseStages = useMemo((): KOMatch['stage'][] =>
    fillPhase === 'final' ? ['3rd', 'final'] :
    fillPhase === 'groups' ? [] :
    [fillPhase as KOMatch['stage']]
  , [fillPhase])

  const fillInfo = useMemo(() => {
    const phase = PHASES.find(p => p.id === fillPhase)!
    const groupPending = fillPhase === 'groups'
      ? GROUP_MATCHES.filter(m => results[m.serial]?.homeScore == null).length
      : 0
    const koPending = koMatches.filter(ko =>
      fillPhaseStages.includes(ko.stage) && ko.home && ko.away && results[ko.serial]?.homeScore == null
    ).length
    const pending = groupPending + koPending
    return { label: phase.label, played: totalPlayed, total: totalPlayed + pending }
  }, [fillPhase, fillPhaseStages, results, totalPlayed, koMatches])

  function handleAutoFill(strategy: AutoFillStrategy) {
    const newResults = { ...results }
    if (fillPhase === 'groups') {
      for (const m of GROUP_MATCHES) {
        if (newResults[m.serial]?.homeScore == null || newResults[m.serial]?.awayScore == null) {
          newResults[m.serial] = autoFillGroupMatch(m, strategy)
        }
      }
    } else {
      for (const ko of koMatches) {
        if (!fillPhaseStages.includes(ko.stage)) continue
        if (!ko.home || !ko.away) continue
        if (newResults[ko.serial]?.homeScore != null && newResults[ko.serial]?.awayScore != null) continue
        const filled = autoFillKOMatch(ko, strategy)
        if (filled) newResults[ko.serial] = filled
      }
    }
    setResults(newResults)
  }

  function clearResult(serial: number) {
    setResults(prev => {
      const next = { ...prev }
      delete next[serial]
      return applyWithKOCleanup(prev, next)
    })
  }

  function handleReset() {
    clearResults(); setResults({}); setShowResetConfirm(false)
  }

  const koStageForPhase: Record<Exclude<Phase,'groups'>, KOMatch['stage'] | KOMatch['stage'][]> = {
    r32: 'r32', r16: 'r16', qf: 'qf', sf: 'sf', final: ['3rd', 'final'],
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Masthead */}
      <header style={{
        background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div className="bs-page-pad" style={{
          maxWidth: 1240, margin: '0 auto', padding: '18px 32px 10px',
        }}>
          <div className="bs-masthead-meta" style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12,
            marginBottom: 6, flexWrap: 'wrap',
          }}>
            <div className="smallcaps">
              Vol. XXIII · Estd. 2026 · United Hosts: USA · CAN · MEX
            </div>
            <div className="smallcaps">
              {totalPlayed}/104 matches reported
            </div>
          </div>

          <div className="double-rule" style={{ paddingBottom: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <h1 className="font-didot bs-masthead-title" style={{
                margin: 0, fontSize: 56, lineHeight: 0.95, letterSpacing: '-0.015em',
              }}>
                The World Cup Chronicle
              </h1>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="bs-btn primary" onClick={() => setShowAutoFill(true)}>
                  Auto-fill
                </button>
                {totalPlayed > 0 && (
                  <button className="bs-btn danger" onClick={() => setShowResetConfirm(true)}>
                    Reset
                  </button>
                )}
              </div>
            </div>
            <div className="bs-masthead-tagline" style={{
              fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', marginTop: 4,
            }}>
              "All Eyes on the Beautiful Game" — A Daily Forecast of the 2026 World Cup
            </div>
          </div>
        </div>

        {/* Phase rail */}
        <div className="bs-phase-nav" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
          <nav className="bs-phase-rail">
            {PHASES.map((p) => {
              const isActive = activePhase === p.id
              const played = phaseCounts[p.id]
              return (
                <button
                  key={p.id}
                  className={`bs-phase${isActive ? ' active' : ''}`}
                  onClick={() => setActivePhase(p.id)}
                  style={{ borderRight: '1px solid var(--ink)' }}
                >
                  <span className="bs-phase-eyebrow">Phase {p.num}</span>
                  <span className="bs-phase-title">{p.label}</span>
                  <span className="bs-phase-meta">{played}/{p.total} reported</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Group sub-nav (only when groups phase active) */}
        {activePhase === 'groups' && (
          <div className="bs-phase-nav" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ borderBottom: '1px solid var(--hairline)', padding: '10px 0 8px' }}>
          <div className="bs-group-rail">
            {GROUPS.map((g, i) => (
              <span key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <button
                  className={`bs-group${activeGroup === g ? ' active' : ''}`}
                  onClick={() => setActiveGroup(g)}
                >
                  <span>Group {g}</span>
                  <span className="tnum" style={{
                    fontSize: 10, fontWeight: 500,
                    color: groupCounts[g] === 6 ? 'var(--advance)' : 'var(--faint)',
                  }}>
                    {groupCounts[g]}/6
                  </span>
                </button>
                {i < GROUPS.length - 1 && (
                  <span style={{ color: 'var(--faint)', fontSize: 10 }}>·</span>
                )}
              </span>
            ))}
          </div>
          </div>
          </div>
        )}
      </header>

      {/* Champion banner */}
      {champion && (
        <div className="bs-phase-nav" style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
          <div className="bs-champion">
            <span className="smallcaps" style={{ color: 'rgba(242,237,224,0.7)', letterSpacing: '0.22em' }}>
              World Champion
            </span>
            <Flag code={champion.flagCode} size={32} />
            <span className="font-didot" style={{ fontSize: 30, lineHeight: 1 }}>
              {champion.name}
            </span>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="bs-page-pad" style={{
        flex: 1, padding: '24px 32px 48px', maxWidth: 1240, width: '100%', margin: '0 auto',
      }}>
        {activePhase === 'groups' ? (
          <GroupTab
            groupId={activeGroup}
            matches={GROUP_MATCHES.filter(m => m.group === activeGroup)}
            standings={allGroupStandings.get(activeGroup) ?? []}
            advancingThirds={advancingThirds}
            results={results}
            onUpdate={updateResult}
            onClear={clearResult}
          />
        ) : (
          <KOSection
            koMatches={koMatches}
            results={results}
            onUpdate={updateResult}
            onClear={clearResult}
            filterStage={koStageForPhase[activePhase]}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--hairline)',
        padding: '14px 32px',
        textAlign: 'center',
      }}>
        <div className="smallcaps">
          The World Cup Chronicle · Forecasted, not foretold · 2026 ed.
        </div>
      </footer>

      {showAutoFill && (
        <AutoFillModal
          fillInfo={fillInfo}
          onApply={handleAutoFill}
          onClose={() => setShowAutoFill(false)}
        />
      )}

      {showResetConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,24,19,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowResetConfirm(false) }}
        >
          <div className="bs-card" style={{ padding: 24, maxWidth: 360, width: '100%' }}>
            <div className="smallcaps" style={{ marginBottom: 4, color: 'var(--crimson)' }}>Erratum</div>
            <div className="font-didot" style={{ fontSize: 26, lineHeight: 1.05, marginBottom: 10 }}>
              Reset all results?
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18, lineHeight: 1.5 }}>
              This clears all {totalPlayed} entered results and starts the simulation from scratch. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="bs-btn" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="bs-btn danger" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

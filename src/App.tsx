import { useState, useEffect, useMemo } from 'react'
import type { MatchResult, AutoFillStrategy } from './types'
import { GROUP_MATCHES, GROUPS } from './data/schedule'
import { loadResults, saveResults, clearResults } from './lib/storage'
import { calculateGroupStandings, rankThirdPlaceTeams } from './lib/standings'
import { buildAllKOMatches, getTournamentWinner, KO_SERIALS_BY_STAGE } from './lib/bracket'
import { autoFillGroupMatch, autoFillKOMatch } from './lib/autofill'
import { GroupTab } from './components/GroupTab'
import { KOSection } from './components/KOSection'
import { AutoFillModal } from './components/AutoFillModal'
import { Flag } from './components/Flag'

type Tab = typeof GROUPS[number] | 'KO'
const ALL_TABS: Tab[] = [...GROUPS, 'KO']

export default function App() {
  const [results, setResults] = useState<Record<number, MatchResult>>(() => loadResults())
  const [activeTab, setActiveTab] = useState<Tab>('A')
  const [showAutoFill, setShowAutoFill] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Auto-save on every change
  useEffect(() => { saveResults(results) }, [results])

  const updateResult = (serial: number, r: MatchResult) => {
    setResults(prev => ({ ...prev, [serial]: r }))
  }

  // Compute all group standings
  const allGroupStandings = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateGroupStandings>>()
    for (const g of GROUPS) {
      const gMatches = GROUP_MATCHES.filter(m => m.group === g)
      map.set(g, calculateGroupStandings(gMatches, results))
    }
    return map
  }, [results])

  // Compute advancing 3rd-place teams (top 8)
  const advancingThirds = useMemo(() => {
    const ranked = rankThirdPlaceTeams(allGroupStandings)
    return new Set(ranked.slice(0, 8).map(t => t.standing.team))
  }, [allGroupStandings])

  // Compute KO matches
  const koMatches = useMemo(() => buildAllKOMatches(results), [results])

  // Check if all group matches done
  const groupMatchesDone = useMemo(
    () => GROUP_MATCHES.every(m => {
      const r = results[m.serial]
      return r?.homeScore != null && r?.awayScore != null
    }),
    [results]
  )

  // Check tournament complete
  const champion = useMemo(() => getTournamentWinner(results, koMatches), [results, koMatches])

  // Total played count
  const totalMatches = 104
  const playedCount = useMemo(() => {
    let n = GROUP_MATCHES.filter(m => {
      const r = results[m.serial]; return r?.homeScore != null && r?.awayScore != null
    }).length
    const koSerials = [
      ...KO_SERIALS_BY_STAGE.r32, ...KO_SERIALS_BY_STAGE.r16,
      ...KO_SERIALS_BY_STAGE.qf,  ...KO_SERIALS_BY_STAGE.sf,
      ...KO_SERIALS_BY_STAGE['3rd'], ...KO_SERIALS_BY_STAGE.final,
    ]
    n += koSerials.filter(s => {
      const r = results[s]; return r?.homeScore != null && r?.awayScore != null
    }).length
    return n
  }, [results])

  function handleAutoFill(strategy: AutoFillStrategy) {
    const newResults = { ...results }

    // Fill group matches
    for (const m of GROUP_MATCHES) {
      const r = newResults[m.serial]
      if (r?.homeScore == null || r?.awayScore == null) {
        const filled = autoFillGroupMatch(m, strategy)
        newResults[m.serial] = filled
      }
    }

    // Fill KO rounds in order (recompute after each round)
    const koOrder = [
      ...KO_SERIALS_BY_STAGE.r32,
      ...KO_SERIALS_BY_STAGE.r16,
      ...KO_SERIALS_BY_STAGE.qf,
      ...KO_SERIALS_BY_STAGE.sf,
      [...KO_SERIALS_BY_STAGE['3rd'], ...KO_SERIALS_BY_STAGE.final],
    ].flat()

    for (const serial of koOrder) {
      const r = newResults[serial]
      if (r?.homeScore != null && r?.awayScore != null) continue

      const freshKO = buildAllKOMatches(newResults)
      const m = freshKO.find(x => x.serial === serial)
      if (!m?.home || !m?.away) continue

      const filled = autoFillKOMatch(m, strategy)
      if (filled) newResults[serial] = filled
    }

    setResults(newResults)
  }

  function handleReset() {
    clearResults()
    setResults({})
    setShowResetConfirm(false)
  }

  const progress = Math.round((playedCount / totalMatches) * 100)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'var(--navy)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="foil-band" />
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="gold-foil-text font-archivo" style={{ fontSize: 20 }}>
              WC 2026 SIMULATOR
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
              {playedCount}/{totalMatches}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setShowAutoFill(true)}
              style={{
                padding: '5px 14px', background: 'var(--gold)', border: '1.5px solid var(--gold-light)',
                color: 'var(--ink)', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                fontFamily: "'Archivo Black', sans-serif", letterSpacing: '0.04em', borderRadius: 3,
              }}
            >
              AUTO FILL
            </button>
            {playedCount > 0 && (
              <button
                onClick={() => setShowResetConfirm(true)}
                style={{
                  padding: '5px 12px', background: 'transparent',
                  border: '1.5px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600, borderRadius: 3,
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)' }}>
          <div style={{ height: '100%', background: 'var(--gold)', width: `${progress}%`, transition: 'width 0.3s' }} />
        </div>
      </header>

      {/* Champion banner */}
      {champion && (
        <div style={{
          background: 'linear-gradient(135deg, var(--navy), #2d5a9e)',
          borderBottom: '2px solid var(--gold)',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <span className="gold-foil-text font-archivo" style={{ fontSize: 16 }}>🏆 WORLD CHAMPION</span>
          <Flag code={champion.flagCode} size={28} />
          <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>{champion.name}</span>
        </div>
      )}

      {/* Tab bar */}
      <div style={{
        borderBottom: '1.5px solid var(--ink)',
        background: 'var(--cream)',
        overflowX: 'auto',
        display: 'flex',
        flexShrink: 0,
      }}>
        {ALL_TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'KO' ? 'KNOCKOUT' : `GRP ${tab}`}
            {tab !== 'KO' && groupMatchesDone && activeTab !== tab && (
              <span style={{ marginLeft: 4, fontSize: 9, color: 'var(--pitch)' }}>✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main style={{ flex: 1, padding: 16, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {activeTab === 'KO' ? (
          <KOSection
            koMatches={koMatches}
            results={results}
            onUpdate={updateResult}
          />
        ) : (
          <GroupTab
            groupId={activeTab}
            matches={GROUP_MATCHES.filter(m => m.group === activeTab)}
            standings={allGroupStandings.get(activeTab) ?? []}
            advancingThirds={advancingThirds}
            results={results}
            onUpdate={updateResult}
          />
        )}
      </main>

      {/* Auto Fill modal */}
      {showAutoFill && (
        <AutoFillModal
          onApply={handleAutoFill}
          onClose={() => setShowAutoFill(false)}
        />
      )}

      {/* Reset confirm */}
      {showResetConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(27,26,20,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowResetConfirm(false) }}
        >
          <div className="sticker-card" style={{ borderRadius: 8, padding: 24, maxWidth: 340, width: '100%' }}>
            <div className="font-archivo" style={{ fontSize: 18, color: 'var(--crimson)', marginBottom: 8 }}>Reset All Results?</div>
            <p style={{ fontSize: 13, color: 'rgba(27,26,20,0.7)', marginBottom: 20 }}>
              This will clear all {playedCount} entered results and start from scratch. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{ padding: '6px 16px', border: '1.5px solid rgba(27,26,20,0.3)', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, borderRadius: 3 }}
              >Cancel</button>
              <button
                onClick={handleReset}
                style={{ padding: '6px 18px', border: '1.5px solid var(--crimson)', background: 'var(--crimson)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700, borderRadius: 3 }}
              >Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

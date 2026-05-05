import type { AutoFillStrategy } from '../types'
import { useState } from 'react'
import { useLanguage } from '../lib/LanguageContext'

const STRATEGY_KEYS: AutoFillStrategy[] = [
  'follow_odds', 'fifa_ranking', 'weighted_random', 'value_hunter',
  'upset_machine', 'draw_specialist', 'giant_killer', 'totally_random',
]

interface Props {
  fillInfo: { phaseId: string; played: number; total: number }
  onApply: (strategy: AutoFillStrategy) => void
  onClose: () => void
}

export function AutoFillModal({ fillInfo, onApply, onClose }: Props) {
  const { t } = useLanguage()
  const remaining = fillInfo.total - fillInfo.played
  const [selected, setSelected] = useState<AutoFillStrategy>('follow_odds')

  const phaseNames: Record<string, string> = {
    groups: t.phase_groups, r32: t.phase_r32, r16: t.phase_r16,
    qf: t.phase_qf, sf: t.phase_sf, final: t.phase_final,
  }
  const phaseName = phaseNames[fillInfo.phaseId] ?? fillInfo.phaseId

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(26,24,19,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bs-card"
        style={{ maxWidth: 520, width: '100%', maxHeight: '90vh', overflow: 'auto' }}
      >
        <header className="double-rule" style={{ padding: '16px 22px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div className="smallcaps" style={{ marginBottom: 4 }}>{t.oracle_eyebrow}</div>
              <div className="font-didot" style={{ fontSize: 30, lineHeight: 1, letterSpacing: '-0.005em' }}>
                {t.autofill_title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, fontStyle: 'italic' }}>
                {t.autofill_desc(remaining, phaseName)}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 24, color: 'var(--muted)', lineHeight: 1, padding: 0,
              }}
              aria-label="close"
            >×</button>
          </div>
        </header>

        <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STRATEGY_KEYS.map((s, i) => {
            const strat = t.strategies[s]
            const isSelected = s === selected
            return (
              <button
                key={s}
                onClick={() => setSelected(s)}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: 14, padding: '12px 4px',
                  border: 'none',
                  borderBottom: i < STRATEGY_KEYS.length - 1 ? '1px solid var(--hairline)' : 'none',
                  background: 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <span className="font-didot tnum" style={{
                  fontSize: 22, color: isSelected ? 'var(--ink)' : 'var(--faint)',
                  lineHeight: 1, minWidth: 28,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                    <span className="font-didot" style={{
                      fontSize: 18, lineHeight: 1.1,
                      color: isSelected ? 'var(--ink)' : 'var(--muted)',
                    }}>
                      {strat.label}
                    </span>
                    <span className="smallcaps" style={{ fontSize: 9 }}>{strat.short}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
                    {strat.description}
                  </div>
                </div>
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '1.5px solid var(--ink)',
                  background: isSelected ? 'var(--ink)' : 'transparent',
                  flexShrink: 0, alignSelf: 'center',
                }} />
              </button>
            )
          })}
        </div>

        <footer style={{
          padding: '12px 22px', borderTop: '1px solid var(--ink)',
          display: 'flex', justifyContent: 'flex-end', gap: 8,
        }}>
          <button className="bs-btn" onClick={onClose}>{t.btn_cancel}</button>
          <button className="bs-btn primary" onClick={() => { onApply(selected); onClose() }}>
            {t.btn_fill(remaining)}
          </button>
        </footer>
      </div>
    </div>
  )
}

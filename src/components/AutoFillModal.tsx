import type { AutoFillStrategy } from '../types'
import { STRATEGY_LABELS } from '../lib/autofill'
import { useState } from 'react'

interface Props {
  fillInfo: { label: string; played: number; total: number }
  onApply: (strategy: AutoFillStrategy) => void
  onClose: () => void
}

const STRATEGIES = Object.keys(STRATEGY_LABELS) as AutoFillStrategy[]

export function AutoFillModal({ fillInfo, onApply, onClose }: Props) {
  const remaining = fillInfo.total - fillInfo.played
  const [selected, setSelected] = useState<AutoFillStrategy>('follow_odds')

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
              <div className="smallcaps" style={{ marginBottom: 4 }}>The Oracle</div>
              <div className="font-didot" style={{ fontSize: 30, lineHeight: 1, letterSpacing: '-0.005em' }}>
                Auto-fill
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, fontStyle: 'italic' }}>
                Filling <strong>{remaining}</strong> unplayed game{remaining !== 1 ? 's' : ''} in the <strong>{fillInfo.label}</strong> ({fillInfo.played}/{fillInfo.total} already reported).
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
          {STRATEGIES.map((s, i) => {
            const { label, short, description } = STRATEGY_LABELS[s]
            const isSelected = s === selected
            return (
              <button
                key={s}
                onClick={() => setSelected(s)}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: 14, padding: '12px 4px',
                  border: 'none',
                  borderBottom: i < STRATEGIES.length - 1 ? '1px solid var(--hairline)' : 'none',
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
                  <div style={{
                    display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2,
                  }}>
                    <span className="font-didot" style={{
                      fontSize: 18, lineHeight: 1.1,
                      color: isSelected ? 'var(--ink)' : 'var(--muted)',
                    }}>
                      {label}
                    </span>
                    <span className="smallcaps" style={{ fontSize: 9 }}>{short}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
                    {description}
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
          <button className="bs-btn" onClick={onClose}>Cancel</button>
          <button className="bs-btn primary" onClick={() => { onApply(selected); onClose() }}>
            Fill {remaining} game{remaining !== 1 ? 's' : ''}
          </button>
        </footer>
      </div>
    </div>
  )
}

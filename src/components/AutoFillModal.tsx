import type { AutoFillStrategy } from '../types'
import { STRATEGY_LABELS } from '../lib/autofill'
import { useState } from 'react'

interface Props {
  onApply: (strategy: AutoFillStrategy) => void
  onClose: () => void
}

const STRATEGIES = Object.keys(STRATEGY_LABELS) as AutoFillStrategy[]

export function AutoFillModal({ onApply, onClose }: Props) {
  const [selected, setSelected] = useState<AutoFillStrategy>('follow_odds')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(27,26,20,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="sticker-card"
        style={{ borderRadius: 8, maxWidth: 480, width: '100%', padding: 0, overflow: 'hidden' }}
      >
        <div className="foil-band" />
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div className="font-archivo" style={{ fontSize: 18, color: 'var(--navy)' }}>Auto Fill</div>
              <div style={{ fontSize: 11, color: 'rgba(27,26,20,0.5)' }}>Fills all unplayed matches using the chosen strategy</div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink)', lineHeight: 1 }}
            >×</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STRATEGIES.map(s => {
              const { label, short, description } = STRATEGY_LABELS[s]
              const isSelected = s === selected
              return (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                    border: isSelected ? '1.5px solid var(--navy)' : '1.5px solid rgba(27,26,20,0.2)',
                    background: isSelected ? 'rgba(27,58,107,0.06)' : 'transparent',
                    borderRadius: 4, cursor: 'pointer', textAlign: 'left', transition: 'all 0.1s',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                      padding: '2px 5px', background: isSelected ? 'var(--navy)' : 'rgba(27,26,20,0.12)',
                      color: isSelected ? 'white' : 'var(--navy)', letterSpacing: '0.05em',
                      whiteSpace: 'nowrap', flexShrink: 0, borderRadius: 2,
                    }}
                  >
                    {short}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(27,26,20,0.55)' }}>{description}</div>
                  </div>
                  {isSelected && (
                    <div style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--navy)', fontSize: 14 }}>✓</div>
                  )}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '1px dashed rgba(27,26,20,0.2)' }}>
            <button
              onClick={onClose}
              style={{
                padding: '6px 16px', border: '1.5px solid rgba(27,26,20,0.3)',
                background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, borderRadius: 3,
              }}
            >Cancel</button>
            <button
              onClick={() => { onApply(selected); onClose() }}
              style={{
                padding: '6px 18px', border: '1.5px solid var(--navy)',
                background: 'var(--navy)', color: 'white', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, borderRadius: 3,
                fontFamily: "'Archivo Black', sans-serif", letterSpacing: '0.04em',
              }}
            >Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}

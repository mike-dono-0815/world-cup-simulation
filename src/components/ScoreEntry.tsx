interface Props {
  value: number | null
  onChange: (v: number) => void
  disabled?: boolean
}

export function ScoreEntry({ value, onChange, disabled }: Props) {
  const v = value ?? 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <button
        className="score-btn"
        onClick={() => !disabled && onChange(v + 1)}
        disabled={disabled}
        aria-label="increase"
      >▲</button>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22,
          fontWeight: 700,
          minWidth: 28,
          textAlign: 'center',
          color: value == null ? 'rgba(27,26,20,0.3)' : 'var(--ink)',
        }}
      >
        {value == null ? '–' : value}
      </span>
      <button
        className="score-btn"
        onClick={() => !disabled && onChange(Math.max(0, v - 1))}
        disabled={disabled}
        aria-label="decrease"
      >▼</button>
    </div>
  )
}

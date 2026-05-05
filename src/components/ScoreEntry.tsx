interface Props {
  value: number | null
  onChange: (v: number) => void
  disabled?: boolean
}

/** Score entry — Option B · hairline, left/right arrows. */
export function ScoreEntry({ value, onChange, disabled }: Props) {
  const v = value ?? 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        className="bs-step"
        onMouseDown={e => e.preventDefault()}
        onClick={() => !disabled && onChange(Math.max(0, v - 1))}
        disabled={disabled}
        aria-label="decrease"
      >−</button>
      <span
        className="tnum"
        style={{
          fontSize: 38,
          fontWeight: 700,
          lineHeight: 1,
          minWidth: 28,
          textAlign: 'center',
          color: value == null ? 'var(--faint)' : 'var(--ink)',
        }}
      >
        {value == null ? '–' : value}
      </span>
      <button
        className="bs-step"
        onMouseDown={e => e.preventDefault()}
        onClick={() => !disabled && onChange(v + 1)}
        disabled={disabled}
        aria-label="increase"
      >+</button>
    </div>
  )
}

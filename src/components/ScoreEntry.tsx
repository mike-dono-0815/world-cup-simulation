interface Props {
  value: number | null
  onChange: (v: number) => void
  disabled?: boolean
  onTap?: () => void
  isActive?: boolean
}

/** Score entry — desktop: +/- steppers. Mobile: tappable digit (keypad managed by parent). */
export function ScoreEntry({ value, onChange, disabled, onTap, isActive }: Props) {
  const v = value ?? 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        className="bs-step bs-score-step"
        onMouseDown={e => e.preventDefault()}
        onClick={() => !disabled && onChange(Math.max(0, v - 1))}
        disabled={disabled}
        aria-label="decrease"
      >−</button>
      <span
        className={`tnum bs-score-num${isActive ? ' active' : ''}`}
        style={{
          fontSize: 38,
          fontWeight: 700,
          lineHeight: 1,
          minWidth: 28,
          textAlign: 'center',
          color: value == null ? 'var(--faint)' : 'var(--ink)',
        }}
        onClick={onTap}
      >
        {value == null ? '–' : value}
      </span>
      <button
        className="bs-step bs-score-step"
        onMouseDown={e => e.preventDefault()}
        onClick={() => !disabled && onChange(v + 1)}
        disabled={disabled}
        aria-label="increase"
      >+</button>
    </div>
  )
}

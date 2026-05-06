import { useLanguage } from '../lib/LanguageContext'

interface Props {
  onClose: () => void
}

export function HelpModal({ onClose }: Props) {
  const { t } = useLanguage()

  const sections = [
    { heading: t.help_s1_heading, body: t.help_s1_body },
    { heading: t.help_s2_heading, body: t.help_s2_body },
    { heading: t.help_s3_heading, body: t.help_s3_body },
    { heading: t.help_s4_heading, body: t.help_s4_body },
    { heading: t.help_s5_heading, body: t.help_s5_body },
  ]

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
        style={{ maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }}
      >
        <header className="double-rule" style={{ padding: '16px 22px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div className="smallcaps" style={{ marginBottom: 4 }}>{t.help_eyebrow}</div>
              <div className="font-didot" style={{ fontSize: 30, lineHeight: 1, letterSpacing: '-0.005em' }}>
                {t.help_title}
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

        <div style={{ padding: '6px 22px 4px', display: 'flex', flexDirection: 'column' }}>
          {sections.map((s, i) => (
            <div
              key={i}
              style={{
                padding: '14px 0',
                borderBottom: i < sections.length - 1 ? '1px solid var(--hairline)' : 'none',
              }}
            >
              <div className="font-didot" style={{ fontSize: 18, lineHeight: 1.1, marginBottom: 6 }}>
                {s.heading}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
                {s.body}
              </div>
            </div>
          ))}
        </div>

        <footer style={{
          padding: '12px 22px', borderTop: '1px solid var(--ink)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button className="bs-btn" onClick={onClose}>{t.btn_close}</button>
        </footer>
      </div>
    </div>
  )
}

import { useLanguage } from '../lib/LanguageContext'
import type { Lang } from '../lib/i18n'

const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'de', label: 'DE' },
  { id: 'es', label: 'ES' },
]

export function LanguageSelector() {
  const { lang, setLang } = useLanguage()
  return (
    <div style={{ display: 'flex', border: '1px solid var(--ink)' }}>
      {LANGS.map(({ id, label }, i) => (
        <button
          key={id}
          onClick={() => setLang(id)}
          style={{
            padding: '6px 10px',
            border: 'none',
            borderRight: i < LANGS.length - 1 ? '1px solid var(--ink)' : 'none',
            background: lang === id ? 'var(--ink)' : 'transparent',
            color: lang === id ? 'var(--paper)' : 'var(--ink)',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            fontFamily: 'inherit',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

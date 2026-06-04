import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../lib/LanguageContext'
import type { Lang } from '../lib/i18n'

const LANGS: Lang[] = ['en', 'de', 'es']

const LANG_FLAGS: Record<Lang, string> = { en: 'gb', de: 'de', es: 'es' }

export function LanguageSelector() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '5px 8px', cursor: 'pointer',
          border: '1px solid var(--ink)',
          background: 'transparent',
          fontFamily: 'inherit',
        }}
      >
        <img
          src={`https://flagcdn.com/w40/${LANG_FLAGS[lang]}.png`}
          alt={lang}
          style={{ height: 14, width: 'auto', display: 'block', border: '1px solid rgba(27,26,20,0.25)' }}
        />
        <span style={{ fontSize: 9, color: 'var(--ink)', lineHeight: 1 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 100,
          background: 'var(--paper)',
          border: '1px solid var(--ink)',
          padding: 4, display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 8px', border: 'none', cursor: 'pointer',
                background: l === lang ? 'var(--ink)' : 'transparent',
                fontFamily: 'inherit',
              }}
            >
              <img
                src={`https://flagcdn.com/w40/${LANG_FLAGS[l]}.png`}
                alt={l}
                style={{ height: 14, width: 'auto', display: 'block', border: '1px solid rgba(27,26,20,0.25)' }}
              />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                color: l === lang ? 'var(--paper)' : 'var(--ink)',
              }}>
                {l.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import { createContext, useContext, useState } from 'react'
import type { Lang, Translations } from './i18n'
import { translations } from './i18n'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem('wc-lang')
      if (s === 'de' || s === 'es') return s
    } catch { /* ignore */ }
    return 'en'
  })

  function setLang(l: Lang) {
    setLangState(l)
    try { localStorage.setItem('wc-lang', l) } catch { /* ignore */ }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

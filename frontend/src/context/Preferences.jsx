import { useEffect, useMemo, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { PreferencesContext } from './preferencesContext'
import i18n from '../i18n'

const STORAGE_KEY = 'spacy-prefs'

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

function load() {
  const defaults = { contrast: false, reduceMotion: prefersReducedMotion(), fontSize: 'md', libras: i18n.resolvedLanguage === 'pt' }
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
  } catch {
    return defaults
  }
}

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(load)

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('contrast', prefs.contrast)
    html.classList.toggle('reduce-motion', prefs.reduceMotion)
    html.classList.toggle('font-lg', prefs.fontSize === 'lg')
    html.classList.toggle('font-xl', prefs.fontSize === 'xl')
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // private mode: preferences just won't persist
    }
  }, [prefs])

  const value = useMemo(() => ({ prefs, set: (key, val) => setPrefs((p) => ({ ...p, [key]: val })) }), [prefs])

  return (
    <PreferencesContext.Provider value={value}>
      <MotionConfig reducedMotion={prefs.reduceMotion ? 'always' : 'user'}>{children}</MotionConfig>
    </PreferencesContext.Provider>
  )
}


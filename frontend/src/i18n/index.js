import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import pt from './locales/pt.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

// UI strings only - probe/hardware content already comes translated from the backend
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
]

i18n
  .use(LanguageDetector) // ?lang=  >  saved choice  >  browser language
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, pt: { translation: pt }, es: { translation: es }, fr: { translation: fr } },
    fallbackLng: 'en',
    supportedLngs: LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true, // pt-BR -> pt, fr-FR -> fr
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
  })

// keep <html lang> updated (screen readers use it)
const syncHtmlLang = (lng) => document.documentElement.setAttribute('lang', lng)
syncHtmlLang(i18n.resolvedLanguage ?? 'en')
i18n.on('languageChanged', syncHtmlLang)

export default i18n

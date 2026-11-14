import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'

// changes UI language and reloads backend content in that language
export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  return (
    <label className="language-switcher">
      <span>{t('language.label')}</span>
      <select value={i18n.resolvedLanguage} onChange={(e) => i18n.changeLanguage(e.target.value)}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  )
}

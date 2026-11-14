import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import StatusCard from '../components/StatusCard'
import { getHealth, getProbes } from '../services/api'

// TODO: replace with the real pages (showcase, missions, hardware, simulation)
export default function Home() {
  const { t, i18n } = useTranslation()
  const [health, setHealth] = useState(null)
  const [probes, setProbes] = useState([])
  const [error, setError] = useState(null)

  // reload when the language changes
  useEffect(() => {
    getHealth().then(setHealth).catch((e) => setError(e.message))
    getProbes().then(setProbes).catch((e) => setError(e.message))
  }, [i18n.resolvedLanguage])

  return (
    <main className="container">
      <header className="header">
        <div>
          <h1>{t('app.title')}</h1>
          <p>{t('app.subtitle')}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <StatusCard title={t('services.title')} data={health} error={error} />

      <h2>{t('probes.title', { count: probes.length })}</h2>
      <div className="grid">
        {probes.map((p) => (
          <article key={p.id} className="card">
            <h3>{p.name}</h3>
            <p>
              {p.mission} · {t(`destination.${p.destination}`)} · <strong>{t(`status.${p.status}`)}</strong>
            </p>
            <p>{p.function}</p>
          </article>
        ))}
      </div>
    </main>
  )
}

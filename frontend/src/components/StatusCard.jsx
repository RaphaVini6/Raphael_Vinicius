import { useTranslation } from 'react-i18next'

export default function StatusCard({ title, data, error }) {
  const { t } = useTranslation()
  return (
    <div className="card">
      <h3>{title}</h3>
      {error && <p className="error">{error}</p>}
      {!error && !data && <p>{t('common.loading')}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import { getProbes } from '../services/api'
import ProbeCard from '../components/ProbeCard'
import { ErrorBox, Loader, Reveal } from '../components/ui'

const DESTINATIONS = ['all', 'Moon', 'Mars', 'Asteroid', 'DeepSpace']
const STATUSES = ['all', 'Active', 'Inactive', 'Lost']

export default function Exhibits() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const destination = params.get('destination') ?? 'all'
  const status = params.get('status') ?? 'all'
  const type = params.get('type') ?? 'all'
  const { data, loading, error, retry } = useApi(() => getProbes())

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const probes = useMemo(() => data ?? [], [data])
  const types = useMemo(() => ['all', ...new Set(probes.map((p) => p.type))], [probes])
  const filtered = probes.filter((p) => {
    if (destination !== 'all' && p.destination !== destination) return false
    if (status !== 'all' && p.status !== status) return false
    if (type !== 'all' && p.type !== type) return false
    const q = search.trim().toLowerCase()
    return !q || `${p.name} ${p.mission} ${p.location} ${p.equipment}`.toLowerCase().includes(q)
  })

  return (
    <div className="container">
      <Reveal className="page-head">
        <span className="eyebrow">{t('exhibits.eyebrow')}</span>
        <h1>{t('exhibits.title')}</h1>
        <p className="section-lead">{t('exhibits.lead')}</p>
      </Reveal>

      <div className="filters">
        <LayoutGroup id="dest-tabs">
          <div className="tabs" role="tablist" aria-label={t('detail.location')}>
            {DESTINATIONS.map((d) => {
              const n = d === 'all' ? probes.length : probes.filter((p) => p.destination === d).length
              const selected = destination === d
              return (
                <button key={d} type="button" role="tab" aria-selected={selected} className="tab" onClick={() => setParam('destination', d)}>
                  {selected && <motion.span layoutId="tab-bg" className="tab-bg" transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }} />}
                  {t(`destination.${d}`)}
                  <span className="n">{n}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>
        <div className="filters-right">
          <label className="search">
            <Search size={16} />
            <span className="sr-only">{t('exhibits.search')}</span>
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('exhibits.search')} />
          </label>
          <select className="select" value={status} onChange={(e) => setParam('status', e.target.value)} aria-label={t('detail.status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{t(`status.${s}`)}</option>
            ))}
          </select>
          <select className="select" value={type} onChange={(e) => setParam('type', e.target.value)} aria-label={t('detail.type')}>
            {types.map((ty) => (
              <option key={ty} value={ty}>{t(`type.${ty}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loader />}
      {error && <ErrorBox onRetry={retry} />}
      {!loading && !error && (
        <>
          <p className="probe-card-meta" style={{ marginBottom: 18 }} aria-live="polite">
            {t('exhibits.results', { count: filtered.length })}
          </p>
          {filtered.length === 0 ? (
            <p className="empty">{t('exhibits.empty')}</p>
          ) : (
            <motion.div layout className="probe-grid" style={{ paddingBottom: 100 }}>
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                  >
                    <ProbeCard probe={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

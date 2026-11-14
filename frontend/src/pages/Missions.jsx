import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import { getMissions } from '../services/api'
import { DestinationBadge, ErrorBox, Loader, Reveal, StatusBadge } from '../components/ui'
import { formatDate } from '../utils/format'

const NODE_COLOR = { Moon: 'var(--moon)', Mars: 'var(--mars)', Asteroid: 'var(--deep)', DeepSpace: 'var(--deep)' }

export default function Missions() {
  const { t, i18n } = useTranslation()
  const { data, loading, error, retry } = useApi(() => getMissions())
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })

  return (
    <div className="container">
      <Reveal className="page-head">
        <span className="eyebrow">{t('missions.eyebrow')}</span>
        <h1>{t('missions.title')}</h1>
        <p className="section-lead">{t('missions.lead')}</p>
      </Reveal>

      {loading && <Loader />}
      {error && <ErrorBox onRetry={retry} />}
      {data && (
        <div className="timeline" ref={ref}>
          <div className="timeline-track" aria-hidden="true">
            <motion.div className="timeline-progress" style={{ scaleY: progress }} />
          </div>
          {data.map((m, i) => (
            <div key={m.name} className="tl-item">
              <motion.div
                className="card tl-card"
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="tl-year">{m.date.slice(0, 4)}</div>
                <h3>{m.name}</h3>
                <p>{formatDate(m.date, i18n.resolvedLanguage)}</p>
                <div className="badges" style={{ marginTop: 10, justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                  <DestinationBadge destination={m.destination} />
                  <StatusBadge status={m.status} />
                </div>
                <div className="tl-probes">
                  {m.probes.map((p) => (
                    <Link key={p.id} to={`/exhibits/${p.id}`} className="chip">
                      {p.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
              <motion.span
                className="tl-node"
                style={{ color: NODE_COLOR[m.destination] }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

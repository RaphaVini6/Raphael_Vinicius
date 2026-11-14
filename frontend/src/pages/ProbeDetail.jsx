import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, BookOpen, Bot, CalendarDays, Cog, ExternalLink, Images, MapPin, Recycle, Rocket, ShieldCheck, Target, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import { getProbe, getProbeNarration, probeAudio } from '../services/api'
import ListenButton from '../components/ListenButton'
import { LibrasButton, LibrasGloss } from '../components/LibrasPanel'
import SurfaceMap from '../components/SurfaceMap'
import { DestinationBadge, ErrorBox, Loader, Reveal, StatusBadge } from '../components/ui'
import { formatDate, isPhoto } from '../utils/format'

const fmtCoord = (lat, lon) => `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(3)}° ${lon >= 0 ? 'E' : 'W'}`

export default function ProbeDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const { data: p, loading, error, retry } = useApi(() => getProbe(id), [id])
  const [gloss, setGloss] = useState(null)
  const [lightbox, setLightbox] = useState(null)

  if (loading) return <Loader />
  if (error)
    return (
      <div className="container section">
        {error.response?.status === 404 ? <p className="empty">{t('detail.notFound')}</p> : <ErrorBox onRetry={retry} />}
      </div>
    )

  const hasMap = p.latitude != null && p.longitude != null && ['Moon', 'Mars'].includes(p.destination)
  const facts = [
    { icon: Rocket, label: t('detail.launch'), value: formatDate(p.launch, lang) },
    { icon: CalendarDays, label: t(`dateKind.${p.dateKind}`), value: formatDate(p.date, lang) },
    { icon: MapPin, label: t('detail.location'), value: p.location },
    { icon: ShieldCheck, label: t('detail.reliability'), value: `${t(`reliability.${p.reliability}`)}${p.reliabilityNote ? ` · ${p.reliabilityNote}` : ''}` },
  ]

  return (
    <div className="container">
      <Link to="/exhibits" className="back-link">
        <ArrowLeft size={16} /> {t('nav.exhibits')}
      </Link>

      <section className="detail-hero">
        <motion.div className={`detail-media ${isPhoto(p) ? 'photo' : ''}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
          {p.imageUrl && (
            <motion.img
              src={p.imageUrl}
              alt={p.imageAudioDescription ?? p.name}
              animate={isPhoto(p) ? undefined : { y: [0, -12, 0], rotate: [0, 0.8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {p.imageCredit && <span className="credit">{t('common.credit')}: {p.imageCredit}</span>}
        </motion.div>

        <div>
          <motion.div className="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <DestinationBadge destination={p.destination} />
            <StatusBadge status={p.status} />
            <span className="badge">{t(`type.${p.type}`)}</span>
          </motion.div>
          <motion.h1 className="detail-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
            {p.name}
          </motion.h1>
          <motion.p className="detail-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {p.equipment} · {p.mission}
          </motion.p>
          <p style={{ marginTop: 14, color: 'var(--muted)' }}>{p.statusDetail}</p>

          <div className="a11y-bar">
            <ListenButton load={() => probeAudio(p.id)} loadText={() => getProbeNarration(p.id)} />
            <LibrasButton probeId={p.id} onResult={setGloss} />
            {p.simulable && (
              <Link to={`/simulator?probe=${p.id}`} className="btn btn-sm btn-primary">
                <Rocket size={16} /> {t('common.simulate')}
              </Link>
            )}
          </div>
          <LibrasGloss result={gloss} />

          <dl className="facts">
            {facts.map((f) => (
              <div key={f.label} className="fact">
                <dt>
                  <f.icon size={13} /> {f.label}
                </dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="detail-sections">
        <div>
          <Reveal className="card info-block">
            <h2><Target size={20} /> {t('detail.function')}</h2>
            <p>{p.function}</p>
          </Reveal>
          <Reveal className="card info-block highlight">
            <h2><Recycle size={20} /> {t('detail.reuse')}</h2>
            <p>{p.mechanicalReuse}</p>
          </Reveal>
          {p.keyComponents && (
            <Reveal className="card info-block">
              <h2><Cog size={20} /> {t('detail.keyComponents')}</h2>
              <p>{p.keyComponents}</p>
            </Reveal>
          )}
          {p.roboticsApplication && (
            <Reveal className="card info-block">
              <h2><Bot size={20} /> {t('detail.robotics')}</h2>
              <p>{p.roboticsApplication}</p>
            </Reveal>
          )}
        </div>

        <div>
          {hasMap && (
            <Reveal className="card info-block">
              <h2><MapPin size={20} /> {t('detail.map')}</h2>
              <SurfaceMap destination={p.destination} latitude={p.latitude} longitude={p.longitude} label={`${p.location} ${fmtCoord(p.latitude, p.longitude)}`} />
              <p className="coords">{fmtCoord(p.latitude, p.longitude)}</p>
            </Reveal>
          )}
          {p.gallery?.length > 0 && (
            <Reveal className="card info-block">
              <h2><Images size={20} /> {t('detail.gallery')}</h2>
              <div className="gallery">
                {p.gallery.map((src) => (
                  <button key={src} type="button" className={src.includes('diagram') ? '' : 'dark'} onClick={() => setLightbox(src)} aria-label={t('detail.gallery')}>
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </Reveal>
          )}
          <Reveal className="card info-block">
            <h2><BookOpen size={20} /> {t('detail.source')}</h2>
            <p>{p.source.name}</p>
            {p.source.nssdcaUrl && (
              <a className="link" href={p.source.nssdcaUrl} target="_blank" rel="noreferrer">
                {t('detail.nssdca')} ({p.source.nssdcaId}) <ExternalLink size={14} />
              </a>
            )}
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.img src={lightbox} alt="" initial={{ scale: 0.92 }} animate={{ scale: 1 }} style={{ background: lightbox.includes('diagram') ? '#fff' : 'transparent' }} />
            <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={() => setLightbox(null)}>
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

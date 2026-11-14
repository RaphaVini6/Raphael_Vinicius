import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Cpu, GraduationCap, Rocket } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import { getMissions, getProbes } from '../services/api'
import ProbeCard from '../components/ProbeCard'
import { Reveal } from '../components/ui'

const THIS_YEAR = new Date().getFullYear()
const FEATURED = ['apollo-11-eagle', 'apollo-15-lrv', 'perseverance', 'ingenuity', 'surveyor-3', 'pioneer-10', 'viking-1-orbiter', 'kepler']

function Counter({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, { duration: 1.8, ease: [0.2, 0.8, 0.2, 1], onUpdate: (v) => setShown(Math.round(v)) })
    return () => c.stop()
  }, [inView, value])
  return <strong ref={ref}>{shown}</strong>
}

function HeroVisual() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 60, damping: 15 })
  const y = useSpring(useTransform(my, [-1, 1], [-14, 14]), { stiffness: 60, damping: 15 })

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  const orbits = [
    { size: '96%', duration: 60, color: 'var(--gold)' },
    { size: '78%', duration: 38, color: 'var(--mars)', reverse: true },
    { size: '112%', duration: 90, color: 'var(--cyan)' },
  ]

  return (
    <div className="hero-visual" aria-hidden="true">
      {orbits.map((o) => (
        <motion.div key={o.size} className="orbit" style={{ width: o.size, height: o.size }} animate={{ rotate: o.reverse ? -360 : 360 }} transition={{ duration: o.duration, repeat: Infinity, ease: 'linear' }}>
          <span className="orbit-dot" style={{ background: o.color, boxShadow: `0 0 16px ${o.color}` }} />
        </motion.div>
      ))}
      <motion.div className="hero-planet" style={{ x: useTransform(x, (v) => -v * 0.5), y: useTransform(y, (v) => -v * 0.5) }} />
      <motion.img
        src="/images/probes/apollo-11-lunar-module.webp"
        alt=""
        className="hero-craft"
        style={{ x, y }}
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: [0, -14, 0], scale: 1 }}
        transition={{ opacity: { duration: 1 }, scale: { duration: 1.2 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
      />
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const probes = useApi(() => getProbes())
  const missions = useApi(() => getMissions())
  const list = probes.data ?? []

  const count = (dests) => list.filter((p) => dests.includes(p.destination)).length
  const years = list.length ? THIS_YEAR - Math.min(...list.map((p) => Number(p.launch.slice(0, 4)))) : 0
  const featured = FEATURED.map((id) => list.find((p) => p.id === id)).filter(Boolean)

  const titleWords = [...t('home.title1').split(' ').map((w) => ({ w, hl: false })), ...t('home.title2').split(' ').map((w) => ({ w, hl: true }))]

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              {t('home.eyebrow')}
            </motion.span>
            <h1 style={{ marginTop: 18 }}>
              {titleWords.map(({ w, hl }, i) => (
                <motion.span
                  key={`${w}-${i}`}
                  className={`word ${hl ? 'text-gradient' : ''}`}
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.15 + i * 0.09, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>
            <motion.p className="hero-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}>
              {t('home.lead')}
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}>
              <Link to="/exhibits" className="btn btn-primary">
                {t('home.explore')} <ArrowRight size={18} />
              </Link>
              <Link to="/simulator" className="btn">
                <Rocket size={18} /> {t('home.simulate')}
              </Link>
            </motion.div>
          </div>
          <HeroVisual />
        </div>
        <div className="hero-scroll" aria-hidden="true">
          {t('home.scroll')}
          <motion.span className="line" animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </section>

      <section className="container">
        <div className="stats">
          <div className="stat"><Counter value={list.length} /><span>{t('home.stats.artifacts')}</span></div>
          <div className="stat"><Counter value={new Set(list.map((p) => p.destination)).size} /><span>{t('home.stats.destinations')}</span></div>
          <div className="stat"><Counter value={missions.data?.length ?? 0} /><span>{t('home.stats.missions')}</span></div>
          <div className="stat"><Counter value={years} /><span>{t('home.stats.years')}</span></div>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <span className="eyebrow">{t('nav.exhibits')}</span>
          <h2 className="section-title">{t('home.destTitle')}</h2>
          <p className="section-lead">{t('home.destLead')}</p>
        </Reveal>
        <div className="destinations">
          {[
            { key: 'Moon', globe: 'moon', desc: 'destMoon', dests: ['Moon'] },
            { key: 'Mars', globe: 'mars', desc: 'destMars', dests: ['Mars'] },
            { key: 'DeepSpace', globe: 'deep', desc: 'destDeep', dests: ['Asteroid', 'DeepSpace'] },
          ].map((d, i) => (
            <Reveal key={d.key} delay={i * 0.1}>
              <Link to={`/exhibits?destination=${d.key}`} className="destination">
                <span className={`globe ${d.globe}`} aria-hidden="true" />
                <h3>{t(`destination.${d.key}`)}</h3>
                <p>{t(`home.${d.desc}`)}</p>
                <span className="count">
                  {t('home.artifacts', { count: count(d.dests) })} <ArrowRight size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-sm container">
        <Reveal className="row-head">
          <div>
            <span className="eyebrow">{t('exhibits.eyebrow')}</span>
            <h2 className="section-title">{t('home.featuredTitle')}</h2>
            <p className="section-lead">{t('home.featuredLead')}</p>
          </div>
          <Link to="/exhibits" className="btn">
            {t('common.viewAll')} <ArrowRight size={16} />
          </Link>
        </Reveal>
        <div className="rail">
          {featured.map((p) => (
            <ProbeCard key={p.id} probe={p} />
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal className="cta-band">
          <div>
            <span className="eyebrow">
              <Cpu size={14} /> {t('sim.eyebrow')}
            </span>
            <h2 className="section-title">{t('home.simTitle')}</h2>
            <p className="section-lead">{t('home.simLead')}</p>
            <Link to="/simulator" className="btn btn-primary" style={{ marginTop: 28 }}>
              <Rocket size={18} /> {t('home.simCta')}
            </Link>
          </div>
          <motion.img src="/images/probes/apollo-15-lrv.webp" alt="" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        </Reveal>
      </section>

      <section className="section-sm container" style={{ paddingBottom: 110 }}>
        <Reveal className="cta-band" >
          <motion.img src="/images/probes/apollo-11-plaque.webp" alt="" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
          <div>
            <span className="eyebrow">
              <GraduationCap size={14} /> {t('learn.eyebrow')}
            </span>
            <h2 className="section-title">{t('home.learnTitle')}</h2>
            <p className="section-lead">{t('home.learnLead')}</p>
            <Link to="/learn" className="btn" style={{ marginTop: 28 }}>
              {t('home.learnCta')} <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, ChevronRight, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import { getLearn, getRoboticsCases } from '../services/api'
import { ErrorBox, Loader, Reveal } from '../components/ui'

function PayloadCalculator() {
  const { t, i18n } = useTranslation()
  const [mass, setMass] = useState(30)
  const [cost, setCost] = useState(1000000)
  const total = mass * cost
  const money = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })

  return (
    <Reveal className="card calc">
      <div>
        <h3 style={{ fontSize: '1.4rem' }}>{t('learn.calc')}</h3>
        <p className="section-lead" style={{ fontSize: '0.95rem' }}>{t('learn.calcLead')}</p>
        <label htmlFor="calc-mass">
          {t('learn.calcMass')} <b>{mass} kg</b>
        </label>
        <input id="calc-mass" type="range" min="10" max="50" value={mass} onChange={(e) => setMass(Number(e.target.value))} />
        <label htmlFor="calc-cost">{t('learn.calcCost')}</label>
        <input id="calc-cost" type="number" min="0" step="10000" value={cost} onChange={(e) => setCost(Math.max(0, Number(e.target.value)))} />
        <p className="hint">{t('learn.calcHint')}</p>
      </div>
      <div className="calc-out" aria-live="polite">
        <motion.strong key={total} className="text-gradient" initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          {money.format(total)}
        </motion.strong>
        <span>{t('learn.calcSaving')}</span>
      </div>
    </Reveal>
  )
}

export default function Learn() {
  const { t } = useTranslation()
  const learn = useApi(() => getLearn())
  const cases = useApi(() => getRoboticsCases())
  const d = learn.data

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <Reveal className="page-head">
        <span className="eyebrow">{t('learn.eyebrow')}</span>
        <h1>{t('learn.title')}</h1>
        <p className="section-lead">{t('learn.lead')}</p>
      </Reveal>

      {learn.loading && <Loader />}
      {learn.error && <ErrorBox onRetry={learn.retry} />}
      {d && (
        <>
          <Reveal className="note">
            <Info size={18} />
            <p>{d.note}</p>
          </Reveal>

          <section className="section-sm">
            <Reveal>
              <h2 className="section-title">{t('learn.precedents')}</h2>
            </Reveal>
            <div className="two-col">
              {d.precedents.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.1} className="card">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="section-sm">
            <Reveal>
              <h2 className="section-title">{t('learn.methodology')}</h2>
              <p className="section-lead">{t('learn.methodologyLead')}</p>
            </Reveal>
            <div className="phases">
              {d.methodology.map((m, i) => (
                <Reveal key={m.title} delay={i * 0.12} className="card phase">
                  <div className="num">0{i + 1}</div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </Reveal>
              ))}
            </div>
            <PayloadCalculator />
          </section>

          <section className="section-sm">
            <Reveal>
              <h2 className="section-title">{t('learn.cases')}</h2>
              <p className="section-lead">{t('learn.casesLead')}</p>
            </Reveal>
            <div className="cases">
              {(cases.data ?? []).map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08} className="card case">
                  <motion.img src={c.imageUrl} alt="" whileHover={{ scale: 1.06, rotate: -2 }} />
                  <div>
                    <h3>{c.name}</h3>
                    <p className="kc">{c.keyComponents}</p>
                    <p>{c.application}</p>
                    <Link to={`/exhibits/${c.id}`}>
                      {t('learn.open')} <ArrowRight size={14} />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="section-sm">
            <Reveal>
              <h2 className="section-title">{t('learn.robotics')}</h2>
              <p className="section-lead">{t('learn.roboticsLead')}</p>
            </Reveal>
            <Reveal className="cascade" aria-label={t('learn.robotics')}>
              {[
                ['perception', null],
                ['decision', null],
                ['trajectory', 'gpc'],
                ['actuators', 'pid'],
              ].map(([key, loop], i) => (
                <motion.div
                  key={key}
                  className="cascade-step"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <strong>{t(`learn.cascade.${key}`)}</strong>
                  {loop && <span>{t(`learn.cascade.${loop}`)}</span>}
                  {i < 3 && <ChevronRight size={16} style={{ position: 'absolute', right: -9, top: '50%', marginTop: -8, color: 'var(--gold)', background: 'var(--bg)', borderRadius: '50%' }} aria-hidden="true" />}
                </motion.div>
              ))}
            </Reveal>
            <div className="topics">
              {d.robotics.topics.map((topic, i) => (
                <Reveal key={topic.title} delay={i * 0.1} className="card">
                  <h3>{topic.title}</h3>
                  <p>{topic.text}</p>
                </Reveal>
              ))}
            </div>
            <p className="reference">{d.robotics.reference}</p>
          </section>
        </>
      )}
    </div>
  )
}

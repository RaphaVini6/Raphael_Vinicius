import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, animate, motion } from 'motion/react'
import {
  Activity, ArrowLeft, BatteryFull, BatteryLow, Check, Cpu, Flag, Flame, Navigation, RadioTower, Radiation,
  RotateCcw, Rocket, Satellite, Thermometer, Wind, Wrench, Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import { getEnvironments, getHardwareByCategory, getProbes, getSimulationNarration, simulate, simulationAudio } from '../services/api'
import { usePreferences } from '../context/preferencesContext'
import ListenButton from '../components/ListenButton'
import ScoreRing from '../components/ScoreRing'
import { ErrorBox, Loader, Reveal } from '../components/ui'

const CATEGORIES = ['Power', 'Storage', 'Thermal', 'Mobility', 'Communication', 'Computer']
const CAT_ICON = { Power: Zap, Storage: BatteryFull, Thermal: Thermometer, Mobility: Navigation, Communication: RadioTower, Computer: Cpu }
const EVENT_ICON = { Heat: Flame, Storm: Wind, Power: BatteryLow, Dust: Wind, Mobility: Wrench, Radiation, Summary: Activity, End: Flag }

function Meter({ label, value, max, unit }) {
  const { i18n } = useTranslation()
  return (
    <div className="meter">
      <div className="meter-label">
        <span>{label}</span>
        <b>{Math.round(value).toLocaleString(i18n.resolvedLanguage)} {unit}</b>
      </div>
      <div className="meter-bar">
        <motion.div className="meter-fill" animate={{ width: `${Math.min(100, (value / max) * 100)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
      </div>
    </div>
  )
}

export default function Simulator() {
  const { t } = useTranslation()
  const { prefs } = usePreferences()
  const [params, setParams] = useSearchParams()
  const probes = useApi(() => getProbes())
  const hardware = useApi(() => getHardwareByCategory())
  const environments = useApi(() => getEnvironments())

  const [custom, setCustom] = useState({ probeId: null, map: {} }) // player's picks for the current probe
  const [run, setRun] = useState(null) // { request, result, day, done }
  const [countdown, setCountdown] = useState(null)
  const [simError, setSimError] = useState(false)

  const scenarios = (probes.data ?? []).filter((p) => p.simulable)
  const probe = scenarios.find((p) => p.id === params.get('probe'))
  const step = run ? 3 : probe ? 2 : 1
  const env = environments.data?.find((e) => e.destination === probe?.destination)

  // starts from the real hardware; the player's picks override it
  const components = custom.probeId === probe?.id ? custom.map : (probe?.realHardware ?? {})
  const setComponents = (map) => setCustom({ probeId: probe.id, map })

  const allParts = Object.values(hardware.data ?? {}).flat()
  const parts = CATEGORIES.map((c) => allParts.find((x) => x.id === components[c])).filter(Boolean)

  const pickProbe = (id) => {
    setRun(null)
    setParams(id ? { probe: id } : {})
  }

  async function launch() {
    const request = { probeId: probe.id, components }
    setSimError(false)
    const pending = simulate(probe.id, components)
    if (!prefs.reduceMotion) {
      for (const n of [3, 2, 1]) {
        setCountdown(n)
        await new Promise((r) => setTimeout(r, 750))
      }
    }
    setCountdown(null)
    try {
      const result = await pending
      setRun({ request, result, day: 0, done: false })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      const duration = prefs.reduceMotion ? 0 : Math.min(5, Math.max(2.2, Math.log10(result.daysSurvived + 1) * 1.6))
      animate(0, result.daysSurvived, {
        duration,
        ease: [0.3, 0.1, 0.2, 1],
        onUpdate: (v) => setRun((r) => r && { ...r, day: Math.round(v) }),
        onComplete: () => setRun((r) => r && { ...r, day: result.daysSurvived, done: true }),
      })
    } catch {
      setSimError(true)
    }
  }

  if (probes.loading || hardware.loading) return <Loader />
  if (probes.error || hardware.error)
    return (
      <div className="container section">
        <ErrorBox onRetry={() => (probes.retry(), hardware.retry())} />
      </div>
    )

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <Reveal className="page-head">
        <span className="eyebrow">{t('sim.eyebrow')}</span>
        <h1>{t('sim.title')}</h1>
        <p className="section-lead">{t('sim.lead')}</p>
      </Reveal>

      <ol className="steps" style={{ listStyle: 'none', padding: 0 }}>
        {['step1', 'step2', 'step3'].map((s, i) => (
          <li key={s} className={`step ${step === i + 1 ? 'on' : ''} ${step > i + 1 ? 'done' : ''}`} aria-current={step === i + 1 ? 'step' : undefined}>
            <b>{step > i + 1 ? <Check size={14} /> : i + 1}</b>
            {t(`sim.${s}`)}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section key="pick" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>{t('sim.pick')}</h2>
            <div className="scenario-grid">
              {scenarios.map((p, i) => (
                <motion.button
                  key={p.id}
                  type="button"
                  className="scenario"
                  onClick={() => pickProbe(p.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <img src={p.imageUrl} alt="" />
                  <span>
                    <strong>{p.name}</strong>
                    <span>
                      {t(`destination.${p.destination}`)} · {t('common.days', { count: p.scenario.actualDurationDays ?? p.scenario.plannedDurationDays })}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section key="build" className="builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div>
              {CATEGORIES.map((cat) => {
                const Icon = CAT_ICON[cat]
                return (
                  <div key={cat} className="card slot" role="group" aria-label={t(`category.${cat}`)}>
                    <div className="slot-head">
                      <Icon size={20} />
                      <h3>{t(`category.${cat}`)}</h3>
                    </div>
                    <div className="options">
                      {(hardware.data?.[cat] ?? []).map((c) => {
                        const selected = components[cat] === c.id
                        return (
                          <button key={c.id} type="button" className="option" aria-pressed={selected} onClick={() => setComponents({ ...components, [cat]: c.id })}>
                            {selected && <Check size={16} className="check" />}
                            <strong>{c.name}</strong>
                            <small>{c.description}</small>
                            {probe.realHardware[cat] === c.id && <span className="tag">{t('sim.original')}</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <aside className="card summary" aria-live="polite">
              <h3>{t('sim.summary')}</h3>
              <p className="scn">{probe.name}</p>
              <p className="scn" style={{ marginTop: 8 }}>{probe.scenario.summary}</p>
              <Meter label={t('sim.mass')} value={parts.reduce((s, p) => s + p.massKg, 0)} max={200} unit="kg" />
              <Meter label={t('sim.draw')} value={parts.reduce((s, p) => s + p.consumptionW, 0)} max={110} unit="W" />
              <Meter label={t('sim.output')} value={parts.find((p) => p.category === 'Power')?.outputW ?? 0} max={200} unit="W" />
              <Meter label={t('sim.battery')} value={parts.find((p) => p.category === 'Storage')?.capacityWh ?? 0} max={2000} unit="Wh" />
              {env && (
                <>
                  <h3 style={{ marginTop: 22, fontSize: '1rem' }}>{t('sim.environment')}</h3>
                  <p className="scn">{env.description}</p>
                  <ul className="env-list">
                    <li>{t('sim.minTemp')} <b>{probe.scenario.minTempC ?? env.minTempC} °C</b></li>
                    <li>{t('sim.maxTemp')} <b>{probe.scenario.maxTempC ?? env.maxTempC} °C</b></li>
                    <li>{t('sim.gravity')} <b>{env.gravityMs2} m/s²</b></li>
                    <li>{t('sim.sunlight')} <b>{env.solarIrradianceWm2} W/m²</b></li>
                    <li>{t('sim.night')} <b>{t('sim.hours', { count: env.darkHoursPerCycle })}</b></li>
                  </ul>
                </>
              )}
              <button type="button" className="btn btn-primary" onClick={launch}>
                <Rocket size={18} /> {t('sim.launch')}
              </button>
              <button type="button" className="btn btn-sm" onClick={() => setComponents(probe.realHardware)}>
                <RotateCcw size={14} /> {t('sim.useOriginal')}
              </button>
              <button type="button" className="btn btn-sm" onClick={() => pickProbe(null)}>
                <ArrowLeft size={14} /> {t('sim.change')}
              </button>
              {simError && <p className="error-box" style={{ marginTop: 12 }}>{t('common.error')}</p>}
            </aside>
          </motion.section>
        )}

        {step === 3 && run && <RunView key="run" probe={probe} run={run} onAgain={() => setRun(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {countdown && (
          <motion.div className="launch-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="assertive">
            <AnimatePresence mode="popLayout">
              <motion.span key={countdown} className="countdown" initial={{ scale: 1.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.45 }}>
                {countdown}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function RunView({ probe, run, onAgain }) {
  const { t, i18n } = useTranslation()
  const { result, day, done, request } = run
  const scale = Math.max(result.plannedDurationDays, result.actualDurationDays ?? 0, result.daysSurvived, 1) * 1.06
  const pct = (d) => `${(d / scale) * 100}%`
  const visible = result.events.filter((e) => e.day <= day || done)

  return (
    <motion.section className="card run" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="run-head">
        <div>
          <span className="eyebrow">{done ? (result.missionAccomplished ? t('sim.accomplished') : t('sim.failed')) : t('sim.running')}</span>
          <h2 style={{ fontSize: '1.6rem', marginTop: 8 }}>{probe.name}</h2>
        </div>
        <div className="day-counter" aria-live="off">
          {day.toLocaleString(i18n.resolvedLanguage)}
          <small>{t('common.days', { count: day }).replace(/^[\d.,\s]+/, '')}</small>
        </div>
      </div>

      <div className="track" aria-hidden="true">
        <div className="track-line" />
        <div className="track-fill" style={{ width: pct(day) }} />
        <div className="track-mark" style={{ left: pct(result.plannedDurationDays) }}>
          <span>{t('sim.planned')}</span>
        </div>
        {result.actualDurationDays && (
          <div className="track-mark" style={{ left: pct(result.actualDurationDays) }}>
            <span>{t('sim.actual')}</span>
          </div>
        )}
        <Satellite className="track-craft" style={{ left: pct(day) }} />
      </div>

      <h3 style={{ fontSize: '1rem', marginTop: 24 }}>{t('sim.events')}</h3>
      <ul className="events">
        <AnimatePresence initial={false}>
          {visible.map((e, i) => {
            const Icon = EVENT_ICON[e.type] ?? Activity
            return (
              <motion.li key={`${e.day}-${i}`} className={`event ${e.type}`} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                <span className="day">
                  {t('sim.dayLabel')} {e.day}
                </span>
                <Icon size={16} />
                <span>{e.message}</span>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {done && (
          <motion.div className="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ScoreRing score={result.score} label={t('sim.score')} />
            <div>
              <h3>{result.missionAccomplished ? t('sim.accomplished') : t('sim.failed')}</h3>
              <p>{result.endReason}</p>
              <div className="compare">
                <div><span>{t('sim.yours')}</span><strong>{t('common.days', { count: result.daysSurvived })}</strong></div>
                <div><span>{t('sim.planned')}</span><strong>{t('common.days', { count: result.plannedDurationDays })}</strong></div>
                {result.actualDurationDays && (
                  <div><span>{t('sim.actual')}</span><strong>{t('common.days', { count: result.actualDurationDays })}</strong></div>
                )}
              </div>
              <div className="result-actions">
                <button type="button" className="btn btn-primary" onClick={onAgain}>
                  <RotateCcw size={16} /> {t('sim.again')}
                </button>
                <ListenButton label={t('sim.listen')} load={() => simulationAudio(request)} loadText={() => getSimulationNarration(request)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

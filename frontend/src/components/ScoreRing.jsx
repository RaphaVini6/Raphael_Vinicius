import { useEffect, useState } from 'react'
import { animate, motion } from 'motion/react'

export default function ScoreRing({ score, label, size = 180 }) {
  const [shown, setShown] = useState(0)
  const r = 70
  const color = score >= 80 ? 'var(--ok)' : score >= 50 ? 'var(--gold)' : 'var(--bad)'

  useEffect(() => {
    const controls = animate(0, score, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setShown(Math.round(v)) })
    return () => controls.stop()
  }, [score])

  return (
    <svg className="score-ring" width={size} height={size} viewBox="0 0 180 180" role="img" aria-label={`${label}: ${score}/100`}>
      <circle cx="90" cy="90" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="12" />
      <motion.circle
        cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        transform="rotate(-90 90 90)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: score / 100 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
      <text x="90" y="92" textAnchor="middle" fontSize="44" fontWeight="700" fill="var(--text)">{shown}</text>
      <text x="90" y="118" textAnchor="middle" fontSize="12" fill="var(--muted)" letterSpacing="2">{label.toUpperCase()}</text>
    </svg>
  )
}

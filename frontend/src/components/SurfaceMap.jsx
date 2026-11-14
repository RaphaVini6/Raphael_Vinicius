import { motion } from 'motion/react'

// simple equirectangular map with a pulsing marker at the probe's coordinates
const PALETTE = {
  Moon: ['#2a2f3b', '#8b93a6'],
  Mars: ['#3a140a', '#c4502a'],
}

export default function SurfaceMap({ destination, latitude, longitude, label }) {
  const W = 360
  const H = 180
  const x = ((longitude + 180) / 360) * W
  const y = ((90 - latitude) / 180) * H
  const [dark, light] = PALETTE[destination] ?? PALETTE.Moon

  return (
    <div className="surface-map">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <defs>
          <radialGradient id={`sm-${destination}`} cx="40%" cy="40%" r="80%">
            <stop offset="0" stopColor={light} />
            <stop offset="1" stopColor={dark} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#sm-${destination})`} />
        {[...Array(11)].map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 30} y1="0" x2={(i + 1) * 30} y2={H} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        ))}
        {[...Array(5)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 30} x2={W} y2={(i + 1) * 30} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        ))}
        <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" strokeDasharray="3 3" />
        <motion.circle cx={x} cy={y} r="4" fill="none" stroke="#ffd88a" strokeWidth="1.2" animate={{ r: [4, 16], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        <circle cx={x} cy={y} r="3.5" fill="#f2b84b" stroke="#000" strokeWidth="0.8" />
      </svg>
    </div>
  )
}

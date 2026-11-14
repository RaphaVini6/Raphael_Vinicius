import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DestinationBadge, StatusBadge } from './ui'
import { isPhoto } from '../utils/format'

// card with a soft 3D tilt that follows the pointer
export default function ProbeCard({ probe }) {
  const { t } = useTranslation()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 20 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div style={{ rotateX, rotateY, transformPerspective: 900, height: '100%' }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <Link to={`/exhibits/${probe.id}`} className="probe-card">
        <div className={`probe-card-media ${isPhoto(probe) ? 'photo' : ''}`}>
          <div className="probe-card-badges">
            <DestinationBadge destination={probe.destination} />
            <StatusBadge status={probe.status} />
          </div>
          {probe.imageUrl && <img src={probe.imageUrl} alt="" loading="lazy" />}
        </div>
        <div className="probe-card-body">
          <h3>{probe.name}</h3>
          <p className="probe-card-meta">
            {probe.mission} · {t(`type.${probe.type}`)}
          </p>
          <div className="probe-card-foot">
            <span>{probe.date?.slice(0, 4)}</span>
            <span className="go">
              {probe.simulable && <span className="badge badge-sim">{t('common.simulable')}</span>}
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

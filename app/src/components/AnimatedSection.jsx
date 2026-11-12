import { motion, useReducedMotion } from 'framer-motion'

export default function AnimatedSection({ id, className = '', children }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  )
}

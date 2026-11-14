export default function BrandMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd88a" />
          <stop offset="1" stopColor="#e8952f" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="9" fill="url(#bm-gold)" />
      <ellipse cx="20" cy="20" rx="18" ry="6.5" stroke="#e8edf6" strokeOpacity="0.7" strokeWidth="1.4" transform="rotate(-24 20 20)" />
      <circle cx="35" cy="13.5" r="2" fill="#5cc8ff" />
    </svg>
  )
}

import { socialLinks } from '../data/socialLinks'

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map(({ id, label, href, Icon }) => (
        <a
          key={id}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-xl text-text transition hover:border-accent hover:text-accent"
        >
          <Icon />
        </a>
      ))}
    </div>
  )
}

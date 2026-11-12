import { RiMailLine } from 'react-icons/ri'
import { contactEmail, socialLinks } from '../data/socialLinks'

const cardClass =
  'flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-6 text-center transition hover:-translate-y-1 hover:border-accent focus-visible:-translate-y-1 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const cards = [
  {
    id: 'email',
    label: 'E-mail',
    detail: contactEmail,
    href: `mailto:${contactEmail}`,
    Icon: RiMailLine,
    external: false,
  },
  ...socialLinks.map(({ id, label, href, Icon }) => ({
    id,
    label,
    detail: { linkedin: 'Perfil profissional', github: 'Código e projetos', instagram: 'Dia a dia' }[id],
    href,
    Icon,
    external: true,
  })),
]

export default function ContactCards() {
  return (
    <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ id, label, detail, href, Icon, external }) => (
        <li key={id}>
          <a
            href={href}
            className={`${cardClass} h-full`}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            <Icon className="text-2xl text-accent" aria-hidden="true" />
            <span className="font-semibold text-text">{label}</span>
            <span className="break-all text-xs text-text-muted">{detail}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

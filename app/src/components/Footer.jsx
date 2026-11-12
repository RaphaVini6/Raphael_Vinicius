import ContactForm from './ContactForm'
import ContactCards from './ContactCards'

export default function Footer() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
      <p className="font-mono text-sm text-accent">// 05. contato</p>
      <h2 className="text-2xl font-bold text-text">Vamos conversar?</h2>
      <ContactForm />
      <a
        href="/CV.pdf"
        className="rounded-full bg-accent px-6 py-3 font-mono text-sm font-semibold text-bg transition hover:brightness-110"
      >
        Download CV
      </a>
      <ContactCards />
      <p className="mt-6 text-xs text-text-muted">© {new Date().getFullYear()} Raphael Vinicius</p>
      <a href="#home" className="font-mono text-xs text-text-muted transition hover:text-accent">
        ↑ Voltar ao topo
      </a>
    </div>
  )
}

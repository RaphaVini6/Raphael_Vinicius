import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { contactEmail } from '../data/socialLinks'

export default function ContactForm() {
  const [status, setStatus] = useState('idle')

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  const isConfigured = Boolean(serviceId && templateId && publicKey)

  if (!isConfigured) {
    return (
      <div className="flex max-w-md flex-col items-center gap-3">
        <p className="text-sm text-text-muted">
          Formulário de contato em configuração — por enquanto, fale comigo por e-mail ou pelos
          links abaixo.
        </p>
        <a
          href={`mailto:${contactEmail}`}
          className="rounded-full border border-accent px-6 py-3 font-mono text-sm font-semibold text-accent transition hover:bg-accent hover:text-bg"
        >
          Enviar e-mail
        </a>
      </div>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')

    try {
      await emailjs.sendForm(serviceId, templateId, event.target, { publicKey })
      setStatus('success')
      event.target.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4 text-left">
      <label className="flex flex-col gap-1 text-sm text-text-muted">
        Nome
        <input
          type="text"
          name="from_name"
          required
          className="rounded-lg border border-border bg-surface px-4 py-2 text-text outline-none transition focus:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-text-muted">
        E-mail
        <input
          type="email"
          name="reply_to"
          required
          className="rounded-lg border border-border bg-surface px-4 py-2 text-text outline-none transition focus:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-text-muted">
        Mensagem
        <textarea
          name="message"
          required
          rows={4}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-text outline-none transition focus:border-accent"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full bg-accent px-6 py-3 font-mono text-sm font-semibold text-bg transition hover:brightness-110 disabled:opacity-60"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
      </button>
      {status === 'success' && (
        <p role="status" className="text-sm text-accent">
          Mensagem enviada! Te respondo em breve.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-400">
          Não consegui enviar agora. Tenta de novo ou usa os links abaixo.
        </p>
      )}
    </form>
  )
}

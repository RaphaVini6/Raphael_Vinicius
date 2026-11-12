import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import emailjs from '@emailjs/browser'
import ContactForm from './ContactForm'

vi.mock('@emailjs/browser', () => ({
  default: { sendForm: vi.fn() },
}))

describe('ContactForm without EmailJS configured', () => {
  it('shows a fallback message instead of the form', () => {
    render(<ContactForm />)

    expect(screen.getByText(/formulário de contato em configuração/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/nome/i)).not.toBeInTheDocument()
  })

  it('offers a mailto link as a fallback', () => {
    render(<ContactForm />)

    expect(screen.getByRole('link', { name: /enviar e-mail/i })).toHaveAttribute(
      'href',
      'mailto:raphaeluchoas89@gmail.com'
    )
  })
})

describe('ContactForm with EmailJS configured', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'service_test')
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'template_test')
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'public_test')
    emailjs.sendForm.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('renders the name, email and message fields', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument()
  })

  it('sends the form via EmailJS and shows a success message', async () => {
    emailjs.sendForm.mockResolvedValue({ status: 200 })
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText(/mensagem/i), { target: { value: 'Olá!' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/mensagem enviada/i))
    expect(emailjs.sendForm).toHaveBeenCalledWith(
      'service_test',
      'template_test',
      expect.anything(),
      { publicKey: 'public_test' }
    )
  })

  it('shows an error message when EmailJS fails', async () => {
    emailjs.sendForm.mockRejectedValue(new Error('network error'))
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText(/mensagem/i), { target: { value: 'Olá!' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/não consegui enviar/i))
  })
})

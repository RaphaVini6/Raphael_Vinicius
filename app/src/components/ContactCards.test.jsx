import { render, screen } from '@testing-library/react'
import ContactCards from './ContactCards'

describe('ContactCards', () => {
  it('renders an e-mail card with a mailto link', () => {
    render(<ContactCards />)

    expect(screen.getByRole('link', { name: /e-mail/i })).toHaveAttribute(
      'href',
      'mailto:raphaeluchoas89@gmail.com'
    )
  })

  it('renders cards for LinkedIn, GitHub and Instagram that open in a new tab', () => {
    render(<ContactCards />)

    ;['linkedin', 'github', 'instagram'].forEach((name) => {
      const link = screen.getByRole('link', { name: new RegExp(name, 'i') })
      expect(link).toHaveAttribute('target', '_blank')
    })
  })
})

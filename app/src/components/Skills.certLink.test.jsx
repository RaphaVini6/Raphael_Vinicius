import { render, screen } from '@testing-library/react'

vi.mock('../data/skills', () => ({
  skillCategories: [
    {
      category: 'Front-end',
      items: [{ name: 'React', Icon: null, certUrl: 'https://example.com/cert-react' }],
    },
  ],
}))

describe('Skills with a certificate link', () => {
  it('renders the skill as a link to its certificate', async () => {
    const { default: Skills } = await import('./Skills')
    render(<Skills />)

    expect(screen.getByRole('link', { name: /react - ver certificado/i })).toHaveAttribute(
      'href',
      'https://example.com/cert-react'
    )
  })
})

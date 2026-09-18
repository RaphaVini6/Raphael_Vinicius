import { render, screen } from '@testing-library/react'
import SocialLinks from './SocialLinks'

describe('SocialLinks', () => {
  it('renders a link for each social entry with correct hrefs', () => {
    render(<SocialLinks />)

    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/raphael-vinicius-a1006b26b/'
    )
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/RaphaVini6'
    )
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/rapha.vini6/'
    )
  })
})

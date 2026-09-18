import { render, screen } from '@testing-library/react'
import Projects from './Projects'
import { projects } from '../data/projects'

describe('Projects', () => {
  it('renders a card with title, description and link for every project', () => {
    render(<Projects />)

    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument()
      expect(screen.getByText(project.description)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: new RegExp(project.title, 'i') })).toHaveAttribute(
        'href',
        project.url
      )
    })
  })
})

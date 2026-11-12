import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Projects from './Projects'
import { projects } from '../data/projects'

describe('Projects', () => {
  it('renders a card with the title for every project, without the description or link', () => {
    render(<Projects />)

    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument()
      expect(screen.queryByText(project.description)).not.toBeInTheDocument()
    })
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('opens a modal with the description and link when a project card is clicked', () => {
    render(<Projects />)
    const project = projects[0]

    fireEvent.click(screen.getByRole('button', { name: `${project.title} - abrir detalhes` }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(project.description)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: new RegExp(project.title, 'i') })).toHaveAttribute(
      'href',
      project.url
    )
  })

  it('closes the modal when the close button is clicked', async () => {
    render(<Projects />)
    const project = projects[0]

    fireEvent.click(screen.getByRole('button', { name: `${project.title} - abrir detalhes` }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /fechar/i }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes the modal when Escape is pressed', async () => {
    render(<Projects />)
    const project = projects[0]

    fireEvent.click(screen.getByRole('button', { name: `${project.title} - abrir detalhes` }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})

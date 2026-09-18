import { projects } from './projects'

describe('projects data', () => {
  it('has exactly 6 projects with required fields', () => {
    expect(projects).toHaveLength(6)
    projects.forEach((project) => {
      expect(project.id).toEqual(expect.any(String))
      expect(project.title).toEqual(expect.any(String))
      expect(project.description).toEqual(expect.any(String))
      expect(project.url).toMatch(/^https:\/\/github\.com\//)
    })
  })
})

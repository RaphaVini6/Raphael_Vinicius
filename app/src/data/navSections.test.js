import { navSections } from './navSections'

describe('navSections data', () => {
  it('has 6 sections matching the anchors used across the app', () => {
    expect(navSections.map((s) => s.id)).toEqual([
      'home',
      'sobre-mim',
      'skills',
      'timeline',
      'projetos',
      'contato',
    ])
  })
})

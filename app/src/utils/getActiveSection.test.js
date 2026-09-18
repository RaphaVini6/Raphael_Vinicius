import { getActiveSection } from './getActiveSection'

const sections = [
  { id: 'home', offsetTop: 0 },
  { id: 'sobre-mim', offsetTop: 500 },
  { id: 'projetos', offsetTop: 1000 },
]

describe('getActiveSection', () => {
  it('returns the first section id when scrollY is 0', () => {
    expect(getActiveSection(sections, 0)).toBe('home')
  })

  it('returns the section whose offsetTop has been passed', () => {
    expect(getActiveSection(sections, 600)).toBe('sobre-mim')
  })

  it('returns the last matching section when scrollY passes all offsets', () => {
    expect(getActiveSection(sections, 1200)).toBe('projetos')
  })

  it('applies the offset before comparing', () => {
    expect(getActiveSection(sections, 920, 100)).toBe('projetos')
  })

  it('returns null for an empty sections list', () => {
    expect(getActiveSection([], 100)).toBeNull()
  })
})

import { skillCategories } from './skills'

describe('skills data', () => {
  it('groups skills into 4 categories with at least one item each', () => {
    expect(skillCategories).toHaveLength(4)
    skillCategories.forEach((group) => {
      expect(group.category).toEqual(expect.any(String))
      expect(group.items.length).toBeGreaterThan(0)
      group.items.forEach((item) => {
        expect(item.name).toEqual(expect.any(String))
      })
    })
  })
})

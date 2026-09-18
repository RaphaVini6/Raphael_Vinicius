export function getActiveSection(sections, scrollY, offset = 0) {
  if (sections.length === 0) return null

  let activeId = sections[0].id
  for (const section of sections) {
    if (scrollY + offset >= section.offsetTop) {
      activeId = section.id
    }
  }
  return activeId
}

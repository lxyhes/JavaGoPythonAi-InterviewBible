export const buildQuestionAnchor = (sectionId: string, question: string, index: number) => {
  const normalized = question
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

  const suffix = normalized || 'item'
  return `${sectionId}-q-${index + 1}-${suffix}`
}

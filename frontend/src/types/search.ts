export type SearchCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'algorithm'
  | 'system-design'
  | 'devops'
  | 'network'
  | 'os'
  | 'ai'

export type SearchTag = 'must' | 'frequent' | 'important'

export interface SearchItem {
  id: string
  category: SearchCategory
  path: string
  sectionId: string
  sectionTitle: string
  question: string
  answer: string
  tags: SearchTag[]
  anchor: string
}

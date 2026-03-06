import type { SearchCategory, SearchTag } from '@/types/search'

export type PracticeMode = 'all' | 'review' | 'weak'

export interface PracticeSession {
  keyword: string
  category: 'all' | SearchCategory
  tag: 'all' | SearchTag
  mode: PracticeMode
  currentItemId: string | null
  updatedAt: string
}

const PRACTICE_SESSION_KEY = 'mianshi-practice-session-v1'

const isCategory = (value: string): value is SearchCategory => {
  return ['frontend', 'backend', 'database', 'algorithm', 'system-design', 'devops', 'network', 'os', 'ai'].includes(value)
}

const isTag = (value: string): value is SearchTag => {
  return value === 'must' || value === 'frequent' || value === 'important'
}

const isMode = (value: string): value is PracticeMode => value === 'all' || value === 'review' || value === 'weak'

export const loadPracticeSession = (): PracticeSession | null => {
  const raw = localStorage.getItem(PRACTICE_SESSION_KEY)
  if (!raw) return null

  try {
    const data = JSON.parse(raw) as Partial<PracticeSession>

    const keyword = typeof data.keyword === 'string' ? data.keyword : ''
    const categoryValue = typeof data.category === 'string' ? data.category : 'all'
    const tagValue = typeof data.tag === 'string' ? data.tag : 'all'
    const modeValue = typeof data.mode === 'string' ? data.mode : 'all'
    const updatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : new Date(0).toISOString()

    const category = categoryValue === 'all' || isCategory(categoryValue) ? categoryValue : 'all'
    const tag = tagValue === 'all' || isTag(tagValue) ? tagValue : 'all'
    const mode = isMode(modeValue) ? modeValue : 'all'

    return {
      keyword,
      category,
      tag,
      mode,
      currentItemId: typeof data.currentItemId === 'string' && data.currentItemId.length ? data.currentItemId : null,
      updatedAt,
    }
  } catch {
    return null
  }
}

export const savePracticeSession = (session: PracticeSession) => {
  localStorage.setItem(PRACTICE_SESSION_KEY, JSON.stringify(session))
}


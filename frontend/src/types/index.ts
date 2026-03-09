export interface NavItem {
  id: string
  title: string
  icon: string
}

export interface NavCategory {
  name: string
  items: NavItem[]
}

export interface NavConfig {
  title: string
  icon: string
  categories: NavCategory[]
}

export interface QaItem {
  question: string
  answer: string
  tags?: string[]
  source?: string
  hotScore?: number
  status?: 'pending' | 'approved' | 'rejected'
  submittedAt?: string
  reviewedAt?: string
}

export interface QuestionSubmission {
  category: string
  sectionId: string
  question: string
  answer: string
  tags: string[]
  source: string
  submitter?: string
}

export interface Section {
  id: string
  title: string
  items: QaItem[]
}

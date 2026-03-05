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
}

export interface Section {
  id: string
  title: string
  items: QaItem[]
}

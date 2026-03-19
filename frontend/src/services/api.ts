/**
 * API service layer for Java backend integration.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 获取 token
function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

function streamWithEventSource(url: string, callbacks: StreamCallbacks) {
  const token = getToken()
  const fullUrl = token ? `${url}&token=${encodeURIComponent(token)}` : url
  const eventSource = new EventSource(fullUrl)

  eventSource.addEventListener('chunk', (event) => {
    callbacks.onChunk((event as MessageEvent<string>).data)
  })

  eventSource.addEventListener('done', () => {
    callbacks.onDone?.()
    eventSource.close()
  })

  eventSource.addEventListener('error', (event) => {
    const message = (event as MessageEvent<string>).data || 'streaming failed'
    callbacks.onError?.(message)
    eventSource.close()
  })

  return () => eventSource.close()
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  timestamp: string
}

export interface ExplainRequest {
  question: string
  category: string
}

export interface GenerateRequest {
  topic: string
  count: number
}

export interface AnalyzeCodeRequest {
  filePath: string
  codeContent: string
}

export interface QueryRequest {
  question: string
}

export interface CoachPlanRequest {
  category?: string
  heatLevel: 'hot' | 'warm' | 'cold'
  nextAction: 'review' | 'weak' | 'practice' | 'explore'
  level: number
  streakDays: number
  reviewedToday: number
  dailyGoalTarget: number
  weakCount: number
  dueCount: number
  unlockedAchievements: number
}

export interface StreamCallbacks {
  onChunk: (chunk: string) => void
  onDone?: () => void
  onError?: (message: string) => void
}

// ============ 认证相关接口 ============
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
  level: number
  xp: number
  streakDays: number
  dailyGoal: number
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  login: (params: LoginRequest) =>
    request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  register: (params: RegisterRequest) =>
    request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getCurrentUser: () =>
    request<ApiResponse<User>>('/auth/me'),

  updateUser: (params: { username?: string; avatar?: string }) =>
    request<ApiResponse<User>>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(params),
    }),

  changePassword: (params: { oldPassword: string; newPassword: string }) =>
    request<ApiResponse<void>>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(params),
    }),
}

// ============ 题库相关接口 ============
export interface Question {
  id: string
  category: string
  sectionId?: string
  question: string
  answer: string
  tags?: string[]
  source?: string
  hotScore: number
  viewCount: number
  favoriteCount: number
  practiceCount: number
  createdAt: string
}

export interface QuestionListResponse {
  content: Question[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export const questionApi = {
  getCategories: () =>
    request<ApiResponse<string[]>>('/questions/categories'),

  getTags: () =>
    request<ApiResponse<string[]>>('/questions/tags'),

  getQuestions: (params?: { category?: string; search?: string; page?: number; size?: number }) => {
    const query = new URLSearchParams()
    if (params?.category) query.append('category', params.category)
    if (params?.search) query.append('search', params.search)
    if (params?.page !== undefined) query.append('page', params.page.toString())
    if (params?.size !== undefined) query.append('size', params.size.toString())
    return request<ApiResponse<QuestionListResponse>>(`/questions?${query.toString()}`)
  },

  getHotQuestions: (limit = 10) =>
    request<ApiResponse<Question[]>>(`/questions/hot?limit=${limit}`),

  getQuestionById: (id: string) =>
    request<ApiResponse<Question>>(`/questions/${id}`),

  getQuestionsBySection: (category: string, sectionId: string) =>
    request<ApiResponse<Question[]>>(`/questions/section/${category}/${sectionId}`),

  getRandomQuestions: (params?: { category?: string; count?: number }) => {
    const query = new URLSearchParams()
    if (params?.category) query.append('category', params.category)
    if (params?.count) query.append('count', params.count.toString())
    return request<ApiResponse<Question[]>>(`/questions/random?${query.toString()}`)
  },
}

// ============ 学习记录相关接口 ============
export interface LearningRecord {
  id: string
  userId: string
  questionId: string
  masteryStatus: 'unknown' | 'vague' | 'mastered'
  reviewCount: number
  nextReviewAt?: string
  lastReviewedAt?: string
  isFavorite: boolean
  isWeak: boolean
  createdAt: string
}

export interface LearningStats {
  masteredCount: number
  totalCount: number
  dueCount: number
  weakCount: number
  masteryRate: number
}

export const learningApi = {
  getUserRecords: () =>
    request<ApiResponse<LearningRecord[]>>('/learning/records'),

  getRecord: (questionId: string) =>
    request<ApiResponse<LearningRecord>>(`/learning/record/${questionId}`),

  updateMasteryStatus: (questionId: string, status: string) =>
    request<ApiResponse<LearningRecord>>(`/learning/record/${questionId}/mastery`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  toggleFavorite: (questionId: string) =>
    request<ApiResponse<LearningRecord>>(`/learning/record/${questionId}/favorite`, {
      method: 'POST',
    }),

  toggleWeak: (questionId: string) =>
    request<ApiResponse<LearningRecord>>(`/learning/record/${questionId}/weak`, {
      method: 'POST',
    }),

  getDueForReview: () =>
    request<ApiResponse<LearningRecord[]>>('/learning/due'),

  getWeakQuestions: () =>
    request<ApiResponse<LearningRecord[]>>('/learning/weak'),

  getLearningStats: () =>
    request<ApiResponse<LearningStats>>('/learning/stats'),
}

// ============ AI 面试相关接口 ============
export const interviewApi = {
  explain: (params: ExplainRequest) =>
    request<ApiResponse<string>>('/interview/explain', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  explainStream: (question: string, category: string, callbacks: StreamCallbacks) => {
    const url = `${API_BASE_URL}/interview/explain/stream?q=${encodeURIComponent(question)}&category=${encodeURIComponent(category)}`
    return streamWithEventSource(url, callbacks)
  },

  generate: (params: GenerateRequest) =>
    request<ApiResponse<string>>('/interview/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  generateStream: (topic: string, count: number, callbacks: StreamCallbacks) => {
    const url = `${API_BASE_URL}/interview/generate/stream?topic=${encodeURIComponent(topic)}&count=${count}`
    return streamWithEventSource(url, callbacks)
  },

  analyzeCode: (params: AnalyzeCodeRequest) =>
    request<ApiResponse<string>>('/interview/analyze-code', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  query: (params: QueryRequest) =>
    request<ApiResponse<string>>('/interview/query', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  queryStream: (question: string, callbacks: StreamCallbacks) => {
    const url = `${API_BASE_URL}/interview/query/stream?q=${encodeURIComponent(question)}`
    return streamWithEventSource(url, callbacks)
  },

  coachPlan: (params: CoachPlanRequest) =>
    request<ApiResponse<string>>('/interview/coach-plan', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  health: () => request<ApiResponse<boolean>>('/interview/health'),
}

export default interviewApi

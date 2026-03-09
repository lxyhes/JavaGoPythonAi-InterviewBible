/**
 * API service layer for Java backend integration.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

function streamWithEventSource(url: string, callbacks: StreamCallbacks) {
  const eventSource = new EventSource(url)

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

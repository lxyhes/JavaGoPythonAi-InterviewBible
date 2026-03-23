import type { ApiResponse } from './api'
import type { QuestionSubmission } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
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

export interface ReviewRequest {
  id: string
  action: 'approve' | 'reject'
  note?: string
}

export interface InteractionRequest {
  type: 'view' | 'favorite' | 'practice'
}

export interface QuestionStats {
  pending: number
  approved: number
  rejected: number
}

export const questionApi = {
  /**
   * 提交新题目
   */
  submit: (submission: QuestionSubmission) =>
    request<QuestionSubmission>('/questions/submit', {
      method: 'POST',
      body: JSON.stringify(submission),
    }),

  /**
   * 审核题目
   */
  review: (params: ReviewRequest) =>
    request<QuestionSubmission>('/questions/review', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  /**
   * 获取待审核列表
   */
  getPending: (page = 0, size = 20) =>
    request<QuestionSubmission[]>(`/questions/pending?page=${page}&size=${size}`),

  /**
   * 获取已审核通过的题目
   */
  getApproved: (category?: string, page = 0, size = 20, sortBy = 'hot') => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    params.append('page', String(page))
    params.append('size', String(size))
    params.append('sortBy', sortBy)
    return request<QuestionSubmission[]>(`/questions/approved?${params.toString()}`)
  },

  /**
   * 更新题目交互数据（浏览/收藏/练习）
   */
  updateInteraction: (id: string, params: InteractionRequest) =>
    request<QuestionSubmission>(`/questions/${id}/interaction`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  /**
   * 获取统计信息
   */
  getStats: () => request<QuestionStats>('/questions/stats'),
}

export default questionApi

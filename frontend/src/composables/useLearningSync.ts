import { learningApi, type LearningRecord } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

/**
 * 学习记录后端同步工具
 */
export function useLearningSync() {
  const authStore = useAuthStore()

  /**
   * 同步掌握状态到后端
   */
  const syncMasteryStatus = async (questionId: string, status: string) => {
    if (!authStore.isLoggedIn) return null
    try {
      return await learningApi.updateMasteryStatus(questionId, status)
    } catch (error) {
      console.error('Failed to sync mastery status:', error)
      return null
    }
  }

  /**
   * 同步收藏状态到后端
   */
  const syncFavorite = async (questionId: string) => {
    if (!authStore.isLoggedIn) return null
    try {
      return await learningApi.toggleFavorite(questionId)
    } catch (error) {
      console.error('Failed to sync favorite:', error)
      return null
    }
  }

  /**
   * 同步薄弱项标记到后端
   */
  const syncWeak = async (questionId: string) => {
    if (!authStore.isLoggedIn) return null
    try {
      return await learningApi.toggleWeak(questionId)
    } catch (error) {
      console.error('Failed to sync weak:', error)
      return null
    }
  }

  /**
   * 从后端获取学习记录
   */
  const fetchLearningRecords = async (): Promise<LearningRecord[]> => {
    if (!authStore.isLoggedIn) return []
    try {
      const response = await learningApi.getUserRecords()
      if (response.success) {
        return response.data
      }
      return []
    } catch (error) {
      console.error('Failed to fetch learning records:', error)
      return []
    }
  }

  /**
   * 获取学习统计
   */
  const fetchLearningStats = async () => {
    if (!authStore.isLoggedIn) return null
    try {
      const response = await learningApi.getLearningStats()
      if (response.success) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Failed to fetch learning stats:', error)
      return null
    }
  }

  /**
   * 获取待复习题目
   */
  const fetchDueForReview = async (): Promise<LearningRecord[]> => {
    if (!authStore.isLoggedIn) return []
    try {
      const response = await learningApi.getDueForReview()
      if (response.success) {
        return response.data
      }
      return []
    } catch (error) {
      console.error('Failed to fetch due for review:', error)
      return []
    }
  }

  /**
   * 获取薄弱项
   */
  const fetchWeakQuestions = async (): Promise<LearningRecord[]> => {
    if (!authStore.isLoggedIn) return []
    try {
      const response = await learningApi.getWeakQuestions()
      if (response.success) {
        return response.data
      }
      return []
    } catch (error) {
      console.error('Failed to fetch weak questions:', error)
      return []
    }
  }

  return {
    syncMasteryStatus,
    syncFavorite,
    syncWeak,
    fetchLearningRecords,
    fetchLearningStats,
    fetchDueForReview,
    fetchWeakQuestions,
  }
}

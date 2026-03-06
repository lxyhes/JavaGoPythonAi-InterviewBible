import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type MasteryLevel = 'unknown' | 'vague' | 'mastered'

export interface LearningRecord {
  questionId: string
  mastery: MasteryLevel
  lastReviewedAt: string
  reviewCount: number
  nextReviewAt: string
}

export interface LearningHistoryItem {
  questionId: string
  mastery: MasteryLevel
  reviewedAt: string
}

const RECORDS_STORAGE_KEY = 'mianshi-learning-records-v1'
const HISTORY_STORAGE_KEY = 'mianshi-learning-history-v1'

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const getNextReviewDate = (mastery: MasteryLevel, now: Date) => {
  if (mastery === 'unknown') return addDays(now, 1)
  if (mastery === 'vague') return addDays(now, 3)
  return addDays(now, 7)
}

const toDayKey = (value: string | Date) => {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const loadJSON = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return (JSON.parse(raw) as T) ?? fallback
  } catch {
    return fallback
  }
}

export const useLearningStore = defineStore('learning', () => {
  const records = ref<Record<string, LearningRecord>>(loadJSON<Record<string, LearningRecord>>(RECORDS_STORAGE_KEY, {}))
  const history = ref<LearningHistoryItem[]>(loadJSON<LearningHistoryItem[]>(HISTORY_STORAGE_KEY, []))

  const persist = () => {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records.value))
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.value))
  }

  const getRecord = (questionId: string) => records.value[questionId]

  const markMastery = (questionId: string, mastery: MasteryLevel) => {
    const now = new Date()
    const prev = records.value[questionId]

    records.value[questionId] = {
      questionId,
      mastery,
      reviewCount: (prev?.reviewCount ?? 0) + 1,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: getNextReviewDate(mastery, now).toISOString(),
    }

    history.value.unshift({
      questionId,
      mastery,
      reviewedAt: now.toISOString(),
    })

    if (history.value.length > 5000) {
      history.value = history.value.slice(0, 5000)
    }

    persist()
  }

  const reviewQueueIds = computed(() => {
    const now = Date.now()

    return Object.values(records.value)
      .filter((record) => new Date(record.nextReviewAt).getTime() <= now)
      .sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime())
      .map((record) => record.questionId)
  })

  const weakQuestionIds = computed(() => {
    const masteryScore: Record<MasteryLevel, number> = {
      unknown: 2,
      vague: 1,
      mastered: 0,
    }

    return Object.values(records.value)
      .filter((record) => record.mastery !== 'mastered')
      .sort((a, b) => {
        const scoreDiff = masteryScore[b.mastery] - masteryScore[a.mastery]
        if (scoreDiff !== 0) return scoreDiff

        const aTime = new Date(a.lastReviewedAt).getTime()
        const bTime = new Date(b.lastReviewedAt).getTime()
        return aTime - bTime
      })
      .map((record) => record.questionId)
  })

  const weakQuestionCount = computed(() => weakQuestionIds.value.length)

  const totalTrackedQuestions = computed(() => Object.keys(records.value).length)
  const masteredQuestionCount = computed(
    () => Object.values(records.value).filter((record) => record.mastery === 'mastered').length
  )

  const todayKey = computed(() => toDayKey(new Date()))

  const reviewedTodayCount = computed(() => {
    return history.value.filter((item) => toDayKey(item.reviewedAt) === todayKey.value).length
  })

  const totalReviewActions = computed(() => history.value.length)

  const streakDays = computed(() => {
    if (!history.value.length) return 0

    const daySet = new Set(history.value.map((item) => toDayKey(item.reviewedAt)))
    let streak = 0
    const cursor = new Date()

    while (daySet.has(toDayKey(cursor))) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    return streak
  })

  const clearAll = () => {
    records.value = {}
    history.value = []
    persist()
  }

  return {
    records,
    history,
    reviewQueueIds,
    weakQuestionIds,
    weakQuestionCount,
    totalTrackedQuestions,
    masteredQuestionCount,
    reviewedTodayCount,
    totalReviewActions,
    streakDays,
    getRecord,
    markMastery,
    clearAll,
  }
})

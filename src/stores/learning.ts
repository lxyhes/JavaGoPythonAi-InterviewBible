import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type MasteryLevel = 'unknown' | 'vague' | 'mastered'
export type LearningNextAction = 'review' | 'weak' | 'practice' | 'explore'
export type LearningHeatLevel = 'hot' | 'warm' | 'cold'

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

export interface LearningSettings {
  dailyGoalTarget: number
}

export interface WeeklyActivityItem {
  date: string
  count: number
}

export interface LearningAchievement {
  id: string
  title: string
  description: string
  unlocked: boolean
}

export interface LearningCelebration {
  id: string
  type: 'goal' | 'level' | 'achievement'
  title: string
  description: string
}

const RECORDS_STORAGE_KEY = 'mianshi-learning-records-v1'
const HISTORY_STORAGE_KEY = 'mianshi-learning-history-v1'
const SETTINGS_STORAGE_KEY = 'mianshi-learning-settings-v1'

const DEFAULT_DAILY_GOAL = 15
const LEVEL_XP_STEP = 180

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

const getXpByMastery = (mastery: MasteryLevel) => {
  if (mastery === 'unknown') return 4
  if (mastery === 'vague') return 7
  return 12
}

const getLevelByXp = (xp: number) => Math.floor(xp / LEVEL_XP_STEP) + 1

const getStreakDaysFromHistory = (items: LearningHistoryItem[]) => {
  if (!items.length) return 0

  const daySet = new Set(items.map((item) => toDayKey(item.reviewedAt)))
  let streak = 0
  const cursor = new Date()

  while (daySet.has(toDayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

const buildAchievements = (params: {
  totalReviewActions: number
  dailyGoalDone: boolean
  streakDays: number
  masteredQuestionCount: number
}): LearningAchievement[] => [
  {
    id: 'first-review',
    title: 'First Review',
    description: 'Complete your first review action.',
    unlocked: params.totalReviewActions >= 1,
  },
  {
    id: 'goal-starter',
    title: 'Daily Goal Hit',
    description: 'Finish your daily target today.',
    unlocked: params.dailyGoalDone,
  },
  {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Learn for 3 consecutive days.',
    unlocked: params.streakDays >= 3,
  },
  {
    id: 'streak-7',
    title: '7-Day Streak',
    description: 'Learn for 7 consecutive days.',
    unlocked: params.streakDays >= 7,
  },
  {
    id: 'mastery-10',
    title: 'Mastery Builder',
    description: 'Master 10 questions.',
    unlocked: params.masteredQuestionCount >= 10,
  },
  {
    id: 'mastery-50',
    title: 'Interview Veteran',
    description: 'Master 50 questions.',
    unlocked: params.masteredQuestionCount >= 50,
  },
]

export const useLearningStore = defineStore('learning', () => {
  const records = ref<Record<string, LearningRecord>>(loadJSON<Record<string, LearningRecord>>(RECORDS_STORAGE_KEY, {}))
  const history = ref<LearningHistoryItem[]>(loadJSON<LearningHistoryItem[]>(HISTORY_STORAGE_KEY, []))
  const settings = ref<LearningSettings>(
    loadJSON<LearningSettings>(SETTINGS_STORAGE_KEY, { dailyGoalTarget: DEFAULT_DAILY_GOAL })
  )
  const celebrations = ref<LearningCelebration[]>([])

  const persist = () => {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records.value))
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.value))
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings.value))
  }

  const getRecord = (questionId: string) => records.value[questionId]

  const markMastery = (questionId: string, mastery: MasteryLevel) => {
    const now = new Date()
    const prev = records.value[questionId]
    const todayKey = toDayKey(now)
    const prevHistory = history.value.slice()
    const prevTotalReviewActions = prevHistory.length
    const prevReviewedTodayCount = prevHistory.filter((item) => toDayKey(item.reviewedAt) === todayKey).length
    const prevTotalXp = prevHistory.reduce((acc, item) => acc + getXpByMastery(item.mastery), 0)
    const prevMasteredQuestionCount = Object.values(records.value).filter((record) => record.mastery === 'mastered').length
    const prevStreakDays = getStreakDaysFromHistory(prevHistory)
    const prevAchievements = buildAchievements({
      totalReviewActions: prevTotalReviewActions,
      dailyGoalDone: prevReviewedTodayCount >= settings.value.dailyGoalTarget,
      streakDays: prevStreakDays,
      masteredQuestionCount: prevMasteredQuestionCount,
    })

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

    const nextHistory = history.value
    const nextTotalReviewActions = nextHistory.length
    const nextReviewedTodayCount = nextHistory.filter((item) => toDayKey(item.reviewedAt) === todayKey).length
    const nextTotalXp = nextHistory.reduce((acc, item) => acc + getXpByMastery(item.mastery), 0)
    const nextMasteredQuestionCount = Object.values(records.value).filter((record) => record.mastery === 'mastered').length
    const nextStreakDays = getStreakDaysFromHistory(nextHistory)
    const nextAchievements = buildAchievements({
      totalReviewActions: nextTotalReviewActions,
      dailyGoalDone: nextReviewedTodayCount >= settings.value.dailyGoalTarget,
      streakDays: nextStreakDays,
      masteredQuestionCount: nextMasteredQuestionCount,
    })

    if (getLevelByXp(nextTotalXp) > getLevelByXp(prevTotalXp)) {
      celebrations.value.push({
        id: `level-${now.getTime()}`,
        type: 'level',
        title: `Level Up: Lv.${getLevelByXp(nextTotalXp)}`,
        description: 'Your consistency is compounding. Keep going.',
      })
    }

    if (
      prevReviewedTodayCount < settings.value.dailyGoalTarget &&
      nextReviewedTodayCount >= settings.value.dailyGoalTarget
    ) {
      celebrations.value.push({
        id: `goal-${now.getTime()}`,
        type: 'goal',
        title: 'Daily Goal Complete',
        description: `You finished ${settings.value.dailyGoalTarget} reviews today.`,
      })
    }

    const prevAchievementMap = new Map(prevAchievements.map((item) => [item.id, item.unlocked]))
    for (const achievement of nextAchievements) {
      if (achievement.unlocked && !prevAchievementMap.get(achievement.id)) {
        celebrations.value.push({
          id: `achievement-${achievement.id}-${now.getTime()}`,
          type: 'achievement',
          title: achievement.title,
          description: achievement.description,
        })
      }
    }

    if (celebrations.value.length > 12) {
      celebrations.value = celebrations.value.slice(-12)
    }

    persist()
  }

  const updateDailyGoalTarget = (target: number) => {
    const safeTarget = Number.isFinite(target) ? Math.max(3, Math.min(60, Math.round(target))) : DEFAULT_DAILY_GOAL
    settings.value.dailyGoalTarget = safeTarget
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

  const latestReviewAt = computed(() => history.value[0]?.reviewedAt ?? null)
  const inactiveDays = computed(() => {
    if (!latestReviewAt.value) return 0

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const latest = new Date(latestReviewAt.value)
    const latestDay = new Date(latest.getFullYear(), latest.getMonth(), latest.getDate()).getTime()
    const diff = Math.floor((today - latestDay) / (24 * 60 * 60 * 1000))
    return Math.max(0, diff)
  })

  const heatLevel = computed<LearningHeatLevel>(() => {
    if (inactiveDays.value >= 3) return 'cold'
    if (inactiveDays.value >= 1) return 'warm'
    return 'hot'
  })

  const totalReviewActions = computed(() => history.value.length)

  const totalXp = computed(() => {
    return history.value.reduce((acc, item) => acc + getXpByMastery(item.mastery), 0)
  })

  const level = computed(() => getLevelByXp(totalXp.value))
  const currentLevelXp = computed(() => totalXp.value % LEVEL_XP_STEP)
  const nextLevelRequiredXp = computed(() => LEVEL_XP_STEP)
  const levelProgressRate = computed(() => Math.min(100, Math.round((currentLevelXp.value / LEVEL_XP_STEP) * 100)))

  const dailyGoalTarget = computed(() => settings.value.dailyGoalTarget)
  const dailyGoalProgress = computed(() => Math.min(reviewedTodayCount.value, dailyGoalTarget.value))
  const dailyGoalDone = computed(() => reviewedTodayCount.value >= dailyGoalTarget.value)
  const dailyGoalRate = computed(() => Math.min(100, Math.round((dailyGoalProgress.value / dailyGoalTarget.value) * 100)))

  const weeklyActivity = computed<WeeklyActivityItem[]>(() => {
    const result: WeeklyActivityItem[] = []
    const dayCounter = new Map<string, number>()

    for (const item of history.value) {
      const key = toDayKey(item.reviewedAt)
      dayCounter.set(key, (dayCounter.get(key) ?? 0) + 1)
    }

    const base = new Date()
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = addDays(base, -offset)
      const key = toDayKey(date)
      result.push({
        date: key,
        count: dayCounter.get(key) ?? 0,
      })
    }

    return result
  })

  const streakDays = computed(() => getStreakDaysFromHistory(history.value))

  const nextAction = computed<LearningNextAction>(() => {
    if (reviewQueueIds.value.length > 0) return 'review'
    if (weakQuestionIds.value.length > 0) return 'weak'
    if (!dailyGoalDone.value) return 'practice'
    return 'explore'
  })

  const achievements = computed<LearningAchievement[]>(() =>
    buildAchievements({
      totalReviewActions: totalReviewActions.value,
      dailyGoalDone: dailyGoalDone.value,
      streakDays: streakDays.value,
      masteredQuestionCount: masteredQuestionCount.value,
    })
  )

  const unlockedAchievementCount = computed(() => achievements.value.filter((item) => item.unlocked).length)
  const activeCelebration = computed(() => celebrations.value[0] ?? null)

  const dismissCelebration = (id: string) => {
    celebrations.value = celebrations.value.filter((item) => item.id !== id)
  }

  const clearAll = () => {
    records.value = {}
    history.value = []
    settings.value = { dailyGoalTarget: DEFAULT_DAILY_GOAL }
    celebrations.value = []
    persist()
  }

  return {
    records,
    history,
    settings,
    celebrations,
    reviewQueueIds,
    weakQuestionIds,
    weakQuestionCount,
    totalTrackedQuestions,
    masteredQuestionCount,
    reviewedTodayCount,
    latestReviewAt,
    inactiveDays,
    heatLevel,
    totalReviewActions,
    totalXp,
    level,
    currentLevelXp,
    nextLevelRequiredXp,
    levelProgressRate,
    dailyGoalTarget,
    dailyGoalProgress,
    dailyGoalDone,
    dailyGoalRate,
    weeklyActivity,
    streakDays,
    nextAction,
    achievements,
    unlockedAchievementCount,
    activeCelebration,
    getRecord,
    markMastery,
    updateDailyGoalTarget,
    dismissCelebration,
    clearAll,
  }
})

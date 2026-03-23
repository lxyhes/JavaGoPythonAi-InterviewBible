import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { searchItems } from '@/data/search-index'
import type { SearchCategory } from '@/types/search'

export type MasteryLevel = 'unknown' | 'vague' | 'mastered'
export type LearningNextAction = 'review' | 'weak' | 'practice' | 'explore'
export type LearningHeatLevel = 'hot' | 'warm' | 'cold'
export type CareerTarget =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'system-design'
  | 'ai'

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
  careerTarget: CareerTarget
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
  type: 'goal' | 'level' | 'achievement' | 'milestone'
  title: string
  description: string
  milestoneDay?: number
}

export interface StreakMilestone {
  day: number
  title: string
  description: string
  badgeColor: string
  rewardXp: number
}

export interface TomorrowPlan {
  targetQuestionCount: number
  focusCategories: string[]
  estimatedMinutes: number
  generatedAt: string
}

export interface CategoryCompetencyStat {
  category: SearchCategory
  total: number
  tracked: number
  mastered: number
  vague: number
  unknown: number
  due: number
  weak: number
  masteryRate: number
  coverageRate: number
  readinessScore: number
}

export interface CareerTargetProfile {
  id: CareerTarget
  label: string
  summary: string
  focusCategories: SearchCategory[]
  weights: Record<SearchCategory, number>
}

const RECORDS_STORAGE_KEY = 'mianshi-learning-records-v1'
const HISTORY_STORAGE_KEY = 'mianshi-learning-history-v1'
const SETTINGS_STORAGE_KEY = 'mianshi-learning-settings-v1'
const MILESTONES_STORAGE_KEY = 'mianshi-learning-milestones-v1'
const TOMORROW_PLAN_STORAGE_KEY = 'mianshi-learning-tomorrow-plan-v1'

const DEFAULT_DAILY_GOAL = 15
const LEVEL_XP_STEP = 180
const DEFAULT_CAREER_TARGET: CareerTarget = 'fullstack'

const ALL_CATEGORIES: SearchCategory[] = [
  'frontend',
  'backend',
  'database',
  'algorithm',
  'system-design',
  'devops',
  'network',
  'os',
  'ai',
]

const CAREER_TARGET_PROFILES: CareerTargetProfile[] = [
  {
    id: 'frontend',
    label: 'Frontend Engineer',
    summary: 'Strengthen UI delivery, engineering depth, and browser fundamentals.',
    focusCategories: ['frontend', 'algorithm', 'network', 'system-design'],
    weights: {
      frontend: 5,
      backend: 1,
      database: 1,
      algorithm: 3,
      'system-design': 3,
      devops: 1,
      network: 2,
      os: 1,
      ai: 1,
    },
  },
  {
    id: 'backend',
    label: 'Backend Engineer',
    summary: 'Push deeper on services, storage, distributed systems, and reliability.',
    focusCategories: ['backend', 'database', 'system-design', 'algorithm'],
    weights: {
      frontend: 1,
      backend: 5,
      database: 4,
      algorithm: 3,
      'system-design': 4,
      devops: 2,
      network: 2,
      os: 2,
      ai: 1,
    },
  },
  {
    id: 'fullstack',
    label: 'Full Stack Engineer',
    summary: 'Build balanced execution across UI, APIs, data, and system thinking.',
    focusCategories: ['frontend', 'backend', 'database', 'system-design'],
    weights: {
      frontend: 4,
      backend: 4,
      database: 3,
      algorithm: 2,
      'system-design': 3,
      devops: 2,
      network: 2,
      os: 1,
      ai: 1,
    },
  },
  {
    id: 'system-design',
    label: 'Senior / Architect',
    summary: 'Prioritize design trade-offs, scalability, and technical leadership range.',
    focusCategories: ['system-design', 'backend', 'database', 'devops'],
    weights: {
      frontend: 1,
      backend: 4,
      database: 4,
      algorithm: 2,
      'system-design': 5,
      devops: 3,
      network: 3,
      os: 2,
      ai: 1,
    },
  },
  {
    id: 'ai',
    label: 'AI Engineer',
    summary: 'Blend AI fundamentals with software delivery and productionization skills.',
    focusCategories: ['ai', 'backend', 'algorithm', 'system-design'],
    weights: {
      frontend: 1,
      backend: 3,
      database: 2,
      algorithm: 4,
      'system-design': 3,
      devops: 2,
      network: 1,
      os: 1,
      ai: 5,
    },
  },
]

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    day: 3,
    title: '初出茅庐',
    description: '连续学习3天，好习惯正在养成！',
    badgeColor: 'bronze',
    rewardXp: 30,
  },
  {
    day: 7,
    title: '坚持不懈',
    description: '连续学习7天，你比大多数人更有毅力！',
    badgeColor: 'silver',
    rewardXp: 70,
  },
  {
    day: 14,
    title: '面试达人',
    description: '连续学习14天，知识正在内化为你的能力！',
    badgeColor: 'gold',
    rewardXp: 150,
  },
  {
    day: 30,
    title: '终身学习者',
    description: '连续学习30天，你已经成为学习的化身！',
    badgeColor: 'legendary',
    rewardXp: 300,
  },
]

export const MILESTONE_BADGE_COLORS: Record<string, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  legendary: '#ff6b6b',
}

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
    loadJSON<LearningSettings>(SETTINGS_STORAGE_KEY, {
      dailyGoalTarget: DEFAULT_DAILY_GOAL,
      careerTarget: DEFAULT_CAREER_TARGET,
    })
  )
  const celebrations = ref<LearningCelebration[]>([])
  const unlockedMilestones = ref<Set<number>>(new Set(loadJSON<number[]>(MILESTONES_STORAGE_KEY, [])))
  const tomorrowPlan = ref<TomorrowPlan | null>(loadJSON<TomorrowPlan | null>(TOMORROW_PLAN_STORAGE_KEY, null))

  const persist = () => {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records.value))
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.value))
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings.value))
    localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(Array.from(unlockedMilestones.value)))
    if (tomorrowPlan.value) {
      localStorage.setItem(TOMORROW_PLAN_STORAGE_KEY, JSON.stringify(tomorrowPlan.value))
    }
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
      // Auto-generate tomorrow's plan when daily goal is completed
      generateTomorrowPlan()
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

    // Check for streak milestones
    if (nextStreakDays > prevStreakDays) {
      for (const milestone of STREAK_MILESTONES) {
        if (nextStreakDays >= milestone.day && !unlockedMilestones.value.has(milestone.day)) {
          unlockedMilestones.value.add(milestone.day)
          celebrations.value.push({
            id: `milestone-${milestone.day}-${now.getTime()}`,
            type: 'milestone',
            title: `🎉 ${milestone.title}`,
            description: `${milestone.description} (+${milestone.rewardXp} XP)`,
            milestoneDay: milestone.day,
          })
        }
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

  const updateCareerTarget = (target: CareerTarget) => {
    settings.value.careerTarget = target
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
  const careerTarget = computed(() => settings.value.careerTarget || DEFAULT_CAREER_TARGET)
  const dailyGoalProgress = computed(() => Math.min(reviewedTodayCount.value, dailyGoalTarget.value))
  const dailyGoalDone = computed(() => reviewedTodayCount.value >= dailyGoalTarget.value)
  const dailyGoalRate = computed(() => Math.min(100, Math.round((dailyGoalProgress.value / dailyGoalTarget.value) * 100)))

  const categoryCompetency = computed<CategoryCompetencyStat[]>(() => {
    const questionTotals = new Map<SearchCategory, number>()
    const trackedTotals = new Map<SearchCategory, number>()
    const masteredTotals = new Map<SearchCategory, number>()
    const vagueTotals = new Map<SearchCategory, number>()
    const unknownTotals = new Map<SearchCategory, number>()
    const dueTotals = new Map<SearchCategory, number>()
    const weakTotals = new Map<SearchCategory, number>()

    for (const category of ALL_CATEGORIES) {
      questionTotals.set(category, 0)
      trackedTotals.set(category, 0)
      masteredTotals.set(category, 0)
      vagueTotals.set(category, 0)
      unknownTotals.set(category, 0)
      dueTotals.set(category, 0)
      weakTotals.set(category, 0)
    }

    const dueIdSet = new Set(reviewQueueIds.value)
    const weakIdSet = new Set(weakQuestionIds.value)

    for (const item of searchItems) {
      questionTotals.set(item.category, (questionTotals.get(item.category) ?? 0) + 1)

      const record = records.value[item.id]
      if (!record) continue

      trackedTotals.set(item.category, (trackedTotals.get(item.category) ?? 0) + 1)
      if (record.mastery === 'mastered') {
        masteredTotals.set(item.category, (masteredTotals.get(item.category) ?? 0) + 1)
      }
      if (record.mastery === 'vague') {
        vagueTotals.set(item.category, (vagueTotals.get(item.category) ?? 0) + 1)
      }
      if (record.mastery === 'unknown') {
        unknownTotals.set(item.category, (unknownTotals.get(item.category) ?? 0) + 1)
      }
      if (dueIdSet.has(item.id)) {
        dueTotals.set(item.category, (dueTotals.get(item.category) ?? 0) + 1)
      }
      if (weakIdSet.has(item.id)) {
        weakTotals.set(item.category, (weakTotals.get(item.category) ?? 0) + 1)
      }
    }

    return ALL_CATEGORIES.map((category) => {
      const total = questionTotals.get(category) ?? 0
      const tracked = trackedTotals.get(category) ?? 0
      const mastered = masteredTotals.get(category) ?? 0
      const vague = vagueTotals.get(category) ?? 0
      const unknown = unknownTotals.get(category) ?? 0
      const due = dueTotals.get(category) ?? 0
      const weak = weakTotals.get(category) ?? 0
      const masteryRate = tracked ? Math.round((mastered / tracked) * 100) : 0
      const coverageRate = total ? Math.round((tracked / total) * 100) : 0
      const readinessScore = Math.round(masteryRate * 0.7 + coverageRate * 0.3)

      return {
        category,
        total,
        tracked,
        mastered,
        vague,
        unknown,
        due,
        weak,
        masteryRate,
        coverageRate,
        readinessScore,
      }
    })
  })

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

  const careerTargetProfile = computed<CareerTargetProfile>(() => {
    return CAREER_TARGET_PROFILES.find((item) => item.id === careerTarget.value) ?? CAREER_TARGET_PROFILES[2]
  })

  const competitivenessScore = computed(() => {
    const profile = careerTargetProfile.value
    let earned = 0
    let totalWeight = 0

    for (const stat of categoryCompetency.value) {
      const weight = profile.weights[stat.category] ?? 0
      earned += stat.readinessScore * weight
      totalWeight += weight
    }

    return totalWeight ? Math.round(earned / totalWeight) : 0
  })

  const categoryPriority = computed(() => {
    const profile = careerTargetProfile.value
    return [...categoryCompetency.value]
      .map((item) => ({
        ...item,
        weight: profile.weights[item.category] ?? 0,
        gapScore: Math.max(0, 100 - item.readinessScore) * (profile.weights[item.category] ?? 0) + item.weak * 4 + item.due * 2,
      }))
      .sort((a, b) => b.gapScore - a.gapScore || b.weight - a.weight || a.readinessScore - b.readinessScore)
  })

  const strongestCategories = computed(() =>
    [...categoryCompetency.value]
      .sort((a, b) => b.readinessScore - a.readinessScore || b.mastered - a.mastered)
      .slice(0, 3)
  )

  const criticalGaps = computed(() => categoryPriority.value.filter((item) => item.weight > 0).slice(0, 3))

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
    settings.value = { dailyGoalTarget: DEFAULT_DAILY_GOAL, careerTarget: DEFAULT_CAREER_TARGET }
    celebrations.value = []
    unlockedMilestones.value.clear()
    tomorrowPlan.value = null
    persist()
  }

  // Streak milestone helpers
  const getMilestoneProgress = (day: number) => {
    const currentStreak = streakDays.value
    if (currentStreak >= day) return 100
    const prevMilestone = STREAK_MILESTONES.find(m => m.day < day)?.day ?? 0
    return Math.round(((currentStreak - prevMilestone) / (day - prevMilestone)) * 100)
  }

  const getNextMilestone = () => {
    return STREAK_MILESTONES.find(m => !unlockedMilestones.value.has(m.day)) ?? null
  }

  const getCurrentMilestone = () => {
    const unlocked = Array.from(unlockedMilestones.value).sort((a, b) => b - a)
    if (unlocked.length === 0) return null
    const highestDay = unlocked[0]
    return STREAK_MILESTONES.find(m => m.day === highestDay) ?? null
  }

  // Tomorrow plan helpers
  const generateTomorrowPlan = () => {
    const now = new Date()
    
    // Calculate target based on current progress and streak
    const baseTarget = settings.value.dailyGoalTarget
    const streakBonus = Math.min(streakDays.value * 0.5, 5) // Max 5 bonus questions for streak
    const targetQuestionCount = Math.round(baseTarget + streakBonus)
    
    // Determine focus categories based on weak questions
    const weakCategories = new Map<string, number>()
    for (const questionId of weakQuestionIds.value.slice(0, 20)) {
      const category = questionId.split('/')[0] || 'general'
      weakCategories.set(category, (weakCategories.get(category) ?? 0) + 1)
    }
    const focusCategories = Array.from(weakCategories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat]) => cat)
    
    // Estimate time (avg 3 min per question)
    const estimatedMinutes = Math.round(targetQuestionCount * 3)
    
    tomorrowPlan.value = {
      targetQuestionCount,
      focusCategories,
      estimatedMinutes,
      generatedAt: now.toISOString(),
    }
    persist()
  }

  const acceptTomorrowPlan = () => {
    if (!tomorrowPlan.value) return
    settings.value.dailyGoalTarget = tomorrowPlan.value.targetQuestionCount
    persist()
  }

  const dismissTomorrowPlan = () => {
    tomorrowPlan.value = null
    persist()
  }

  // Data export/import for user account sync
  const exportUserData = () => {
    return {
      records: records.value,
      history: history.value,
      settings: settings.value,
      unlockedMilestones: Array.from(unlockedMilestones.value),
      exportAt: new Date().toISOString(),
      version: '1.0',
    }
  }

  const importUserData = (data: unknown) => {
    try {
      const parsed = data as {
        records?: Record<string, LearningRecord>
        history?: LearningHistoryItem[]
        settings?: LearningSettings
        unlockedMilestones?: number[]
      }
      
      if (parsed.records) records.value = parsed.records
      if (parsed.history) history.value = parsed.history
      if (parsed.settings) settings.value = parsed.settings
      if (parsed.unlockedMilestones) {
        unlockedMilestones.value = new Set(parsed.unlockedMilestones)
      }
      
      persist()
      return true
    } catch {
      return false
    }
  }

  return {
    records,
    history,
    settings,
    celebrations,
    unlockedMilestones,
    tomorrowPlan,
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
    careerTarget,
    careerTargetProfile,
    dailyGoalProgress,
    dailyGoalDone,
    dailyGoalRate,
    categoryCompetency,
    competitivenessScore,
    strongestCategories,
    criticalGaps,
    weeklyActivity,
    streakDays,
    nextAction,
    achievements,
    unlockedAchievementCount,
    activeCelebration,
    getRecord,
    markMastery,
    updateDailyGoalTarget,
    updateCareerTarget,
    dismissCelebration,
    clearAll,
    getMilestoneProgress,
    getNextMilestone,
    getCurrentMilestone,
    generateTomorrowPlan,
    acceptTomorrowPlan,
    dismissTomorrowPlan,
    exportUserData,
    importUserData,
  }
})

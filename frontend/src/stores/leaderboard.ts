import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLearningStore } from './learning'

export interface LeaderboardEntry {
  userId: string
  userName: string
  userAvatar?: string
  level: number
  totalXp: number
  streakDays: number
  masteredCount: number
  weeklyReviews: number
  rank?: number
  trend?: 'up' | 'down' | 'stable'
  change?: number
}

export type LeaderboardType = 'xp' | 'streak' | 'mastered' | 'weekly'

const LEADERBOARD_STORAGE_KEY = 'mianshi-leaderboard-v1'
const CURRENT_USER_STATS_KEY = 'mianshi-user-stats-v1'

// Generate mock leaderboard data
const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const mockUsers: LeaderboardEntry[] = [
    { userId: 'user-1', userName: '面试达人', level: 25, totalXp: 4520, streakDays: 45, masteredCount: 320, weeklyReviews: 89 },
    { userId: 'user-2', userName: '算法小王子', level: 23, totalXp: 4180, streakDays: 38, masteredCount: 285, weeklyReviews: 95 },
    { userId: 'user-3', userName: '全栈工程师', level: 22, totalXp: 3950, streakDays: 42, masteredCount: 268, weeklyReviews: 76 },
    { userId: 'user-4', userName: '前端大神', level: 21, totalXp: 3780, streakDays: 35, masteredCount: 245, weeklyReviews: 82 },
    { userId: 'user-5', userName: 'Java架构师', level: 20, totalXp: 3650, streakDays: 28, masteredCount: 230, weeklyReviews: 68 },
    { userId: 'user-6', userName: '数据库专家', level: 19, totalXp: 3420, streakDays: 31, masteredCount: 215, weeklyReviews: 71 },
    { userId: 'user-7', userName: 'DevOps达人', level: 18, totalXp: 3280, streakDays: 25, masteredCount: 198, weeklyReviews: 64 },
    { userId: 'user-8', userName: 'AI研究员', level: 18, totalXp: 3150, streakDays: 22, masteredCount: 185, weeklyReviews: 58 },
    { userId: 'user-9', userName: '系统设计师', level: 17, totalXp: 2980, streakDays: 19, masteredCount: 172, weeklyReviews: 52 },
    { userId: 'user-10', userName: '网络工程师', level: 16, totalXp: 2850, streakDays: 24, masteredCount: 165, weeklyReviews: 48 },
    { userId: 'user-11', userName: '操作系统高手', level: 16, totalXp: 2720, streakDays: 17, masteredCount: 158, weeklyReviews: 45 },
    { userId: 'user-12', userName: '应届生小白', level: 8, totalXp: 1450, streakDays: 12, masteredCount: 68, weeklyReviews: 32 },
    { userId: 'user-13', userName: '转码选手', level: 6, totalXp: 1080, streakDays: 8, masteredCount: 45, weeklyReviews: 28 },
    { userId: 'user-14', userName: '在职学习', level: 5, totalXp: 920, streakDays: 6, masteredCount: 38, weeklyReviews: 22 },
    { userId: 'user-15', userName: '考研党', level: 4, totalXp: 750, streakDays: 5, masteredCount: 28, weeklyReviews: 18 },
  ]

  // Add some random trends
  return mockUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
    trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
    change: Math.floor(Math.random() * 5),
  }))
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

export const useLeaderboardStore = defineStore('leaderboard', () => {
  // State
  const leaderboardData = ref<LeaderboardEntry[]>(loadJSON<LeaderboardEntry[]>(LEADERBOARD_STORAGE_KEY, generateMockLeaderboard()))
  const currentUserStats = ref<Partial<LeaderboardEntry>>(loadJSON<Partial<LeaderboardEntry>>(CURRENT_USER_STATS_KEY, {}))
  const lastUpdated = ref<string>(new Date().toISOString())

  // Get learning store for current user stats
  const getCurrentUserEntry = (): LeaderboardEntry => {
    const learningStore = useLearningStore()
    return {
      userId: 'current-user',
      userName: '我',
      level: learningStore.level,
      totalXp: learningStore.totalXp,
      streakDays: learningStore.streakDays,
      masteredCount: learningStore.masteredQuestionCount,
      weeklyReviews: learningStore.weeklyActivity.reduce((sum, day) => sum + day.count, 0),
    }
  }

  // Getters
  const xpLeaderboard = computed(() => {
    const currentUser = getCurrentUserEntry()
    const allEntries = [...leaderboardData.value, currentUser]
      .sort((a, b) => b.totalXp - a.totalXp)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
    return allEntries.slice(0, 20)
  })

  const streakLeaderboard = computed(() => {
    const currentUser = getCurrentUserEntry()
    const allEntries = [...leaderboardData.value, currentUser]
      .sort((a, b) => b.streakDays - a.streakDays)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
    return allEntries.slice(0, 20)
  })

  const masteredLeaderboard = computed(() => {
    const currentUser = getCurrentUserEntry()
    const allEntries = [...leaderboardData.value, currentUser]
      .sort((a, b) => b.masteredCount - a.masteredCount)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
    return allEntries.slice(0, 20)
  })

  const weeklyLeaderboard = computed(() => {
    const currentUser = getCurrentUserEntry()
    const allEntries = [...leaderboardData.value, currentUser]
      .sort((a, b) => b.weeklyReviews - a.weeklyReviews)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
    return allEntries.slice(0, 20)
  })

  const getLeaderboardByType = computed(() => {
    return (type: LeaderboardType) => {
      switch (type) {
        case 'streak':
          return streakLeaderboard.value
        case 'mastered':
          return masteredLeaderboard.value
        case 'weekly':
          return weeklyLeaderboard.value
        case 'xp':
        default:
          return xpLeaderboard.value
      }
    }
  })

  const currentUserRank = computed(() => {
    return (type: LeaderboardType) => {
      const leaderboard = getLeaderboardByType.value(type)
      const currentUser = leaderboard.find(e => e.userId === 'current-user')
      return currentUser?.rank ?? 0
    }
  })

  const nearbyUsers = computed(() => {
    return (type: LeaderboardType) => {
      const leaderboard = getLeaderboardByType.value(type)
      const currentUserIndex = leaderboard.findIndex(e => e.userId === 'current-user')
      if (currentUserIndex === -1) return leaderboard.slice(0, 10)

      const start = Math.max(0, currentUserIndex - 2)
      const end = Math.min(leaderboard.length, currentUserIndex + 3)
      return leaderboard.slice(start, end)
    }
  })

  const topThree = computed(() => {
    return (type: LeaderboardType) => {
      return getLeaderboardByType.value(type).slice(0, 3)
    }
  })

  const getRankTier = (rank: number): string => {
    if (rank === 1) return 'legendary'
    if (rank === 2) return 'epic'
    if (rank === 3) return 'rare'
    if (rank <= 10) return 'uncommon'
    return 'common'
  }

  const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
      legendary: '#ff6b6b',
      epic: '#9b59b6',
      rare: '#3498db',
      uncommon: '#2ecc71',
      common: '#95a5a6',
    }
    return colors[tier] ?? colors.common
  }

  const getTierLabel = (tier: string): string => {
    const labels: Record<string, string> = {
      legendary: '传说',
      epic: '史诗',
      rare: '稀有',
      uncommon: '优秀',
      common: '普通',
    }
    return labels[tier] ?? labels.common
  }

  // Actions
  const refreshLeaderboard = () => {
    // Simulate fetching new data
    leaderboardData.value = generateMockLeaderboard()
    lastUpdated.value = new Date().toISOString()
    persist()
  }

  const persist = () => {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboardData.value))
    localStorage.setItem(CURRENT_USER_STATS_KEY, JSON.stringify(currentUserStats.value))
  }

  const getLeaderboardTitle = (type: LeaderboardType): string => {
    const titles: Record<LeaderboardType, string> = {
      xp: '经验值排行',
      streak: '连续学习排行',
      mastered: '题目掌握排行',
      weekly: '本周活跃排行',
    }
    return titles[type]
  }

  const getLeaderboardDescription = (type: LeaderboardType): string => {
    const descriptions: Record<LeaderboardType, string> = {
      xp: '根据累计经验值排名',
      streak: '根据连续学习天数排名',
      mastered: '根据已掌握题目数量排名',
      weekly: '根据本周学习次数排名',
    }
    return descriptions[type]
  }

  return {
    leaderboardData,
    lastUpdated,
    xpLeaderboard,
    streakLeaderboard,
    masteredLeaderboard,
    weeklyLeaderboard,
    getLeaderboardByType,
    currentUserRank,
    nearbyUsers,
    topThree,
    getRankTier,
    getTierColor,
    getTierLabel,
    refreshLeaderboard,
    getLeaderboardTitle,
    getLeaderboardDescription,
  }
})

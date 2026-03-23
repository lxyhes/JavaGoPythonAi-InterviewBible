import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { searchItems } from '@/data/search-index'
import type { SearchCategory, SearchItem } from '@/types/search'

export type InterviewDifficulty = 'easy' | 'medium' | 'hard' | 'mixed'
export type InterviewStatus = 'config' | 'in-progress' | 'reviewing' | 'completed'

export interface InterviewQuestion {
  item: SearchItem
  userAnswer: string
  timeSpent: number // seconds
  selfRating: 'unknown' | 'vague' | 'mastered' | null
  revealed: boolean
}

export interface InterviewConfig {
  categories: SearchCategory[]
  questionCount: number
  timePerQuestion: number // seconds, 0 = no limit
  difficulty: InterviewDifficulty
}

export interface InterviewResult {
  id: string
  config: InterviewConfig
  questions: InterviewQuestion[]
  totalTime: number
  score: number // 0-100
  masteredCount: number
  vagueCount: number
  unknownCount: number
  completedAt: string
  weakCategories: SearchCategory[]
}

const HISTORY_KEY = 'mianshi-mock-interview-history-v1'
const COUNTDOWN_KEY = 'mianshi-interview-countdown-v1'

export interface InterviewCountdownData {
  targetDate: string
  targetCompany: string
  targetPosition: string
  createdAt: string
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

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export const useMockInterviewStore = defineStore('mockInterview', () => {
  const status = ref<InterviewStatus>('config')
  const config = ref<InterviewConfig>({
    categories: [],
    questionCount: 10,
    timePerQuestion: 180,
    difficulty: 'mixed',
  })
  const questions = ref<InterviewQuestion[]>([])
  const currentIndex = ref(0)
  const elapsedTime = ref(0) // total elapsed seconds
  const questionTimer = ref(0) // current question timer
  const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const history = ref<InterviewResult[]>(loadJSON<InterviewResult[]>(HISTORY_KEY, []))

  // Countdown
  const countdown = ref<InterviewCountdownData | null>(
    loadJSON<InterviewCountdownData | null>(COUNTDOWN_KEY, null)
  )

  const daysUntilInterview = computed(() => {
    if (!countdown.value) return null
    const target = new Date(countdown.value.targetDate)
    const now = new Date()
    const diff = target.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)))
  })

  const setCountdown = (data: InterviewCountdownData) => {
    countdown.value = data
    localStorage.setItem(COUNTDOWN_KEY, JSON.stringify(data))
  }

  const clearCountdown = () => {
    countdown.value = null
    localStorage.removeItem(COUNTDOWN_KEY)
  }

  // Interview logic
  const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
  const isLastQuestion = computed(() => currentIndex.value >= questions.value.length - 1)
  const progress = computed(() =>
    questions.value.length > 0
      ? Math.round(((currentIndex.value + 1) / questions.value.length) * 100)
      : 0
  )
  const answeredCount = computed(
    () => questions.value.filter((q) => q.selfRating !== null).length
  )

  function startInterview(cfg: InterviewConfig) {
    config.value = { ...cfg }
    const categories = cfg.categories.length > 0 ? cfg.categories : undefined
    let pool = searchItems.filter((item) => {
      if (categories && !categories.includes(item.category)) return false
      return true
    })

    // Difficulty filtering by tags
    if (cfg.difficulty === 'easy') {
      pool = pool.filter((item) => !item.tags.includes('must'))
    } else if (cfg.difficulty === 'hard') {
      pool = pool.filter((item) => item.tags.includes('must') || item.tags.includes('important'))
    }

    const shuffled = shuffleArray(pool)
    const selected = shuffled.slice(0, cfg.questionCount)

    questions.value = selected.map((item) => ({
      item,
      userAnswer: '',
      timeSpent: 0,
      selfRating: null,
      revealed: false,
    }))

    currentIndex.value = 0
    elapsedTime.value = 0
    questionTimer.value = 0
    status.value = 'in-progress'

    startTimer()
  }

  function startTimer() {
    stopTimer()
    timerInterval.value = setInterval(() => {
      elapsedTime.value += 1
      questionTimer.value += 1
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  function revealAnswer() {
    if (currentQuestion.value) {
      currentQuestion.value.revealed = true
    }
  }

  function rateAndNext(rating: 'unknown' | 'vague' | 'mastered') {
    if (!currentQuestion.value) return

    currentQuestion.value.selfRating = rating
    currentQuestion.value.timeSpent = questionTimer.value

    if (isLastQuestion.value) {
      finishInterview()
    } else {
      currentIndex.value += 1
      questionTimer.value = 0
    }
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < questions.value.length) {
      // Save time for current question
      if (currentQuestion.value) {
        currentQuestion.value.timeSpent += questionTimer.value
      }
      currentIndex.value = index
      questionTimer.value = 0
    }
  }

  function finishInterview() {
    stopTimer()

    const masteredCount = questions.value.filter((q) => q.selfRating === 'mastered').length
    const vagueCount = questions.value.filter((q) => q.selfRating === 'vague').length
    const unknownCount = questions.value.filter(
      (q) => q.selfRating === 'unknown' || q.selfRating === null
    ).length
    const score = Math.round((masteredCount / questions.value.length) * 100)

    // Identify weak categories
    const categoryScores = new Map<SearchCategory, { total: number; mastered: number }>()
    for (const q of questions.value) {
      const cat = q.item.category
      const entry = categoryScores.get(cat) || { total: 0, mastered: 0 }
      entry.total += 1
      if (q.selfRating === 'mastered') entry.mastered += 1
      categoryScores.set(cat, entry)
    }

    const weakCategories = Array.from(categoryScores.entries())
      .filter(([, entry]) => entry.total > 0 && entry.mastered / entry.total < 0.5)
      .map(([cat]) => cat)

    const result: InterviewResult = {
      id: `interview-${Date.now()}`,
      config: { ...config.value },
      questions: questions.value.map((q) => ({ ...q })),
      totalTime: elapsedTime.value,
      score,
      masteredCount,
      vagueCount,
      unknownCount,
      completedAt: new Date().toISOString(),
      weakCategories,
    }

    history.value.unshift(result)
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))

    status.value = 'completed'
  }

  function resetInterview() {
    stopTimer()
    questions.value = []
    currentIndex.value = 0
    elapsedTime.value = 0
    questionTimer.value = 0
    status.value = 'config'
  }

  const averageScore = computed(() => {
    if (history.value.length === 0) return 0
    const total = history.value.reduce((sum, r) => sum + r.score, 0)
    return Math.round(total / history.value.length)
  })

  const totalInterviews = computed(() => history.value.length)

  const bestScore = computed(() => {
    if (history.value.length === 0) return 0
    return Math.max(...history.value.map((r) => r.score))
  })

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  function clearHistory() {
    history.value = []
    localStorage.removeItem(HISTORY_KEY)
  }

  return {
    status,
    config,
    questions,
    currentIndex,
    elapsedTime,
    questionTimer,
    currentQuestion,
    isLastQuestion,
    progress,
    answeredCount,
    history,
    averageScore,
    totalInterviews,
    bestScore,
    countdown,
    daysUntilInterview,
    startInterview,
    revealAnswer,
    rateAndNext,
    goToQuestion,
    finishInterview,
    resetInterview,
    formatTime,
    clearHistory,
    setCountdown,
    clearCountdown,
  }
})

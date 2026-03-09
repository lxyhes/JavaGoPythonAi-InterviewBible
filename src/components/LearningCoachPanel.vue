<template>
  <article class="coach-card">
    <div class="coach-head">
      <div>
        <p class="label">AI Coach</p>
        <h2>Personal Daily Plan</h2>
      </div>
      <button type="button" class="refresh-btn" :disabled="loading" @click="generatePlan(true)">
        {{ loading ? 'Generating...' : 'Regenerate' }}
      </button>
    </div>

    <p class="coach-meta">
      Status: {{ heatText }} | Next best action: {{ props.nextAction }} | Goal: {{ props.reviewedToday }} / {{ props.dailyGoalTarget }}
    </p>

    <div v-if="errorMessage" class="error-tip">{{ errorMessage }}</div>

    <div class="plan-body">
      <pre>{{ planContent }}</pre>
    </div>

    <div class="coach-actions">
      <router-link class="primary-btn" :to="primaryLink">Start now</router-link>
      <router-link class="ghost-btn" to="/dashboard">View metrics</router-link>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import interviewApi, { type CoachPlanRequest } from '@/services/api'
import type { LearningHeatLevel, LearningNextAction } from '@/stores/learning'

const CACHE_KEY = 'mianshi-coach-plan-v1'

type CoachPlanCache = {
  day: string
  content: string
  source: 'ai' | 'fallback'
}

const props = defineProps<{
  category?: string
  heatLevel: LearningHeatLevel
  nextAction: LearningNextAction
  level: number
  streakDays: number
  reviewedToday: number
  dailyGoalTarget: number
  weakCount: number
  dueCount: number
  unlockedAchievements: number
}>()

const loading = ref(false)
const errorMessage = ref('')
const planContent = ref('Building your plan...')

const heatText = computed(() => {
  if (props.heatLevel === 'cold') return 'Needs comeback'
  if (props.heatLevel === 'warm') return 'Momentum warning'
  return 'On track'
})

const primaryLink = computed(() => {
  if (props.nextAction === 'review') return '/review'
  if (props.nextAction === 'weak') return { path: '/practice', query: { mode: 'weak' } }
  if (props.nextAction === 'practice') return '/practice'
  return '/search'
})

const dayKey = () => {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

const toPayload = (): CoachPlanRequest => ({
  category: props.category,
  heatLevel: props.heatLevel,
  nextAction: props.nextAction,
  level: props.level,
  streakDays: props.streakDays,
  reviewedToday: props.reviewedToday,
  dailyGoalTarget: props.dailyGoalTarget,
  weakCount: props.weakCount,
  dueCount: props.dueCount,
  unlockedAchievements: props.unlockedAchievements,
})

const fallbackPlan = () => {
  const remaining = Math.max(0, props.dailyGoalTarget - props.reviewedToday)
  return [
    '## Today Focus',
    props.nextAction === 'review'
      ? `Clear due reviews first (${props.dueCount} pending) to protect retention.`
      : 'Push a focused learning block to keep daily consistency.',
    '',
    '## Next 3 Actions (with estimated minutes)',
    `1. 10 min: Quick warm-up on weak points (${props.weakCount} items).`,
    `2. 20 min: Main session for ${remaining > 0 ? remaining : 3} questions (active recall + answer aloud).`,
    '3. 10 min: Summarize mistakes and mark mastery for spaced repetition.',
    '',
    '## If You Only Have 15 Minutes',
    'Do 5 fast review cards and 1 weak question, then save one note for tomorrow.',
    '',
    '## Anti-drop Strategy (how to come back tomorrow)',
    'Set a fixed trigger time and finish the first 5 minutes only. Starting is the main goal.',
  ].join('\n')
}

const loadFromCache = () => {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null

  try {
    const data = JSON.parse(raw) as CoachPlanCache
    if (data.day !== dayKey()) return null
    return data
  } catch {
    return null
  }
}

const saveCache = (content: string, source: 'ai' | 'fallback') => {
  const data: CoachPlanCache = { day: dayKey(), content, source }
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
}

const generatePlan = async (force = false) => {
  if (!force) {
    const cache = loadFromCache()
    if (cache?.content) {
      planContent.value = cache.content
      return
    }
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await interviewApi.coachPlan(toPayload())
    const content = (res.data || '').trim()

    if (!content) {
      throw new Error('empty response from coach')
    }

    planContent.value = content
    saveCache(content, 'ai')
  } catch {
    const content = fallbackPlan()
    planContent.value = content
    errorMessage.value = 'AI service unavailable. Fallback plan generated locally.'
    saveCache(content, 'fallback')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  generatePlan()
})
</script>

<style scoped>
.coach-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 16px;
}

.coach-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.label {
  color: var(--text-muted);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.coach-head h2 {
  margin-top: 6px;
  font-size: 1.15rem;
}

.refresh-btn {
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  height: 32px;
  padding: 0 10px;
  font-size: 0.82rem;
  cursor: pointer;
}

.refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.coach-meta {
  margin-top: 10px;
  color: var(--text-tertiary);
  font-size: 0.84rem;
}

.error-tip {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  background: rgba(245, 158, 11, 0.14);
  color: #b45309;
  font-size: 0.82rem;
}

.plan-body {
  margin-top: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 12px;
  background: var(--bg-secondary);
}

.plan-body pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.coach-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.primary-btn,
.ghost-btn {
  text-decoration: none;
  border-radius: var(--radius-sm);
  height: 34px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  font-size: 0.86rem;
}

.primary-btn {
  background: var(--primary-gradient);
  color: #fff;
}

.ghost-btn {
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .coach-head {
    flex-direction: column;
  }
}
</style>

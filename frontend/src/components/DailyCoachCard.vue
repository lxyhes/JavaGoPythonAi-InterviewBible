<template>
  <a-card class="daily-coach-card" :loading="loading">
    <div class="coach-header">
      <div class="coach-avatar">
        <PhosphorIcon name="robot" :size="32" weight="fill" />
      </div>
      <div class="coach-title">
        <h3>{{ i18nStore.t('dashboard.coachTitle') }}</h3>
        <p>{{ i18nStore.t('dashboard.coachSubtitle') }}</p>
      </div>
      <a-button type="ghost" size="small" @click="fetchCoachPlan" :disabled="loading">
        <template #icon><PhosphorIcon name="arrow-clockwise" :size="16" /></template>
        {{ i18nStore.locale === 'zh' ? '刷新建议' : 'Refresh' }}
      </a-button>
    </div>

    <div v-if="error" class="error-msg">
      <a-alert type="warning" :message="error" banner />
    </div>

    <div v-else class="coach-content">
      <div v-if="plan" class="markdown-body" v-html="formattedPlan"></div>
      <div v-else class="placeholder-text">
        {{ i18nStore.locale === 'zh' ? '准备好开始今天的练习了吗？点击刷新获取个性化建议。' : 'Ready to start? Click refresh for AI coaching.' }}
      </div>
    </div>

    <div class="coach-footer">
      <div class="tip-pills">
        <span class="tip-pill">
          <PhosphorIcon name="target" :size="14" />
          {{ targetLabel }}
        </span>
        <span class="tip-pill">
          <PhosphorIcon name="calendar-check" :size="14" />
          {{ countdownLabel }}
        </span>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PhosphorIcon from '@/components/PhosphorIcon.vue'
import { interviewApi } from '@/services/api'
import { useLearningStore } from '@/stores/learning'
import { useMockInterviewStore } from '@/stores/mockInterview'
import { useI18nStore } from '@/stores/i18n'
import { message } from 'ant-design-vue'

const learningStore = useLearningStore()
const mockStore = useMockInterviewStore()
const i18nStore = useI18nStore()
const loading = ref(false)
const plan = ref('')
const error = ref('')

const targetLabel = computed(() => {
  const target = learningStore.careerTargetProfile?.label || '全栈工程师'
  return `目标: ${target}`
})

const countdownLabel = computed(() => {
  if (!mockStore.countdown) return '未设置面试倒计时'
  return `面试: ${mockStore.daysUntilInterview} 天后`
})

// Simple markdown to HTML since we don't have a full renderer easily available
const formattedPlan = computed(() => {
  if (!plan.value) return ''
  return plan.value
    .replace(/^## (.*$)/gim, '<h4 class="m-h4">$1</h4>')
    .replace(/^### (.*$)/gim, '<h5 class="m-h5">$1</h5>')
    .replace(/^\- (.*$)/gim, '<li class="m-li">$1</li>')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, '<br/>')
})

const fetchCoachPlan = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await interviewApi.coachPlan({
      category: learningStore.careerTarget,
      level: learningStore.level,
      streakDays: learningStore.streakDays,
      reviewedToday: learningStore.dailyGoalProgress,
      dailyGoalTarget: learningStore.dailyGoalTarget,
      weakCount: learningStore.weakQuestionCount,
      dueCount: learningStore.dueCount,
      unlockedAchievements: learningStore.unlockedAchievementCount,
      heatLevel: 'hot', // Fixed for demo
      nextAction: learningStore.nextAction,
      resumeText: learningStore.settings.resumeText
    })
    
    if (res.success) {
      plan.value = res.data
    } else {
      error.value = '无法获取建议: ' + res.message
    }
  } catch (err: any) {
    error.value = 'AI 服务连接失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Check if we have a cached version for today? Just load fresh for now
  fetchCoachPlan()
})
</script>

<style scoped>
.daily-coach-card {
  margin-bottom: 24px;
  border-radius: 16px;
  border: 1px solid var(--primary-200);
  background: linear-gradient(to bottom right, #ffffff, #fcfdff);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.coach-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.coach-avatar {
  background: var(--gradient-primary);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.coach-title h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.coach-title p {
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.coach-content {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 12px;
  min-height: 100px;
}

.markdown-body {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

:deep(.m-h4) {
  margin: 16px 0 8px;
  color: var(--primary-700);
  font-weight: 700;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 4px;
}

:deep(.m-li) {
  margin-left: 20px;
  list-style-type: disc;
}

.coach-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.tip-pills {
  display: flex;
  gap: 12px;
}

.tip-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  padding: 4px 10px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 99px;
  color: var(--text-muted);
}

.placeholder-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: var(--text-muted);
  font-style: italic;
}
</style>

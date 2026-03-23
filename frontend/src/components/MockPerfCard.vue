<template>
  <a-card class="mock-perf-card" title="模拟面试表现">
    <template #extra>
      <router-link to="/mock-interview" class="go-mock-link">
        <PhosphorIcon name="play-circle" :size="18" />
        去面试
      </router-link>
    </template>
    
    <div v-if="history.length === 0" class="empty-perf">
      <div class="empty-icon">
        <PhosphorIcon name="clipboard-text" :size="48" weight="light" />
      </div>
      <p>还没有进行过模拟面试</p>
      <a-button type="primary" ghost @click="$router.push('/mock-interview')">
        首次挑战
      </a-button>
    </div>

    <div v-else class="perf-content">
      <div class="perf-summary">
        <div class="perf-main-score">
          <span class="score-num">{{ latestScore }}</span>
          <span class="score-unit">分</span>
          <p class="score-label">最近得分</p>
        </div>
        <div class="perf-stats">
          <div class="perf-stat">
            <span class="label">平均成绩</span>
            <span class="value">{{ store.averageScore }}%</span>
          </div>
          <div class="perf-stat">
            <span class="label">最高成绩</span>
            <span class="value">{{ store.bestScore }}%</span>
          </div>
        </div>
      </div>

      <div class="recent-list">
        <div v-for="record in history.slice(0, 3)" :key="record.id" class="recent-item">
          <div class="recent-info">
            <span class="date">{{ formatDate(record.completedAt) }}</span>
            <span class="count">{{ record.questions.length }} 题 · {{ store.formatTime(record.totalTime) }}</span>
          </div>
          <div class="recent-score" :class="scoreClass(record.score)">
            {{ record.score }}分
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PhosphorIcon from '@/components/PhosphorIcon.vue'
import { useMockInterviewStore } from '@/stores/mockInterview'
import { useI18nStore } from '@/stores/i18n'

const store = useMockInterviewStore()
const i18nStore = useI18nStore()
const history = computed(() => store.history)
const latestScore = computed(() => history.value[0]?.score || 0)

function scoreClass(score: number) {
  if (score >= 80) return 'score-a'
  if (score >= 60) return 'score-b'
  if (score >= 40) return 'score-c'
  return 'score-d'
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.mock-perf-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.mock-perf-card :deep(.ant-card-head) {
  background: var(--primary-gradient);
  border-bottom: none;
}

.mock-perf-card :deep(.ant-card-head-title) {
  color: white;
  font-weight: 700;
}

.go-mock-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: white;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.go-mock-link:hover {
  opacity: 1;
}

.empty-perf {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  text-align: center;
}

.empty-icon {
  color: var(--text-muted);
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-perf p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.perf-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.perf-main-score {
  text-align: left;
}

.score-num {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary-color);
  line-height: 1;
}

.score-unit {
  font-size: 1rem;
  color: var(--text-tertiary);
  margin-left: 4px;
}

.score-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.perf-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: right;
}

.perf-stat {
  display: flex;
  flex-direction: column;
}

.perf-stat .label {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.perf-stat .value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-radius: 10px;
  font-size: 0.85rem;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.recent-item:hover {
  border-color: var(--primary-200);
  background: var(--card-bg);
}

.recent-info {
  display: flex;
  flex-direction: column;
}

.recent-info .date {
  font-weight: 600;
  color: var(--text-primary);
}

.recent-info .count {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.recent-score {
  font-weight: 700;
  font-size: 1rem;
}

.score-a { color: var(--success-color); }
.score-b { color: var(--info-color, #3b82f6); }
.score-c { color: var(--warning-color); }
.score-d { color: var(--error-color); }
</style>

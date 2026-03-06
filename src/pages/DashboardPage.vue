<template>
  <div class="dashboard-page">
    <header class="header">
      <router-link to="/" class="back-link">返回首页</router-link>
      <h1>学习看板</h1>
      <p>追踪你的学习进度和薄弱方向。</p>
    </header>

    <section class="stats-grid">
      <article class="stat-card">
        <div class="label">已追踪题目</div>
        <div class="value">{{ learningStore.totalTrackedQuestions }}</div>
      </article>
      <article class="stat-card">
        <div class="label">已掌握题目</div>
        <div class="value">{{ learningStore.masteredQuestionCount }}</div>
      </article>
      <article class="stat-card">
        <div class="label">今日复习</div>
        <div class="value">{{ learningStore.reviewedTodayCount }}</div>
      </article>
      <article class="stat-card">
        <div class="label">待复习</div>
        <div class="value">{{ learningStore.reviewQueueIds.length }}</div>
      </article>
      <article class="stat-card">
        <div class="label">连续学习</div>
        <div class="value">{{ learningStore.streakDays }} 天</div>
      </article>
      <article class="stat-card">
        <div class="label">总复习次数</div>
        <div class="value">{{ learningStore.totalReviewActions }}</div>
      </article>
    </section>

    <section class="category-panel">
      <h2>分类掌握率</h2>

      <div v-for="item in categoryStats" :key="item.category" class="category-row">
        <div class="row-head">
          <span>{{ item.label }}</span>
          <span>{{ item.mastered }} / {{ item.total }}（{{ item.rate }}%）</span>
        </div>
        <div class="track">
          <div class="fill" :style="{ width: `${item.rate}%` }"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { searchItems } from '@/data/search-index'
import { useLearningStore } from '@/stores/learning'
import type { SearchCategory } from '@/types/search'

const learningStore = useLearningStore()

const categoryLabelMap: Record<SearchCategory, string> = {
  frontend: '前端开发',
  backend: '后端开发',
  database: '数据库',
  algorithm: '算法',
  'system-design': '系统设计',
  devops: 'DevOps',
  network: '计算机网络',
  os: '操作系统',
  ai: '人工智能',
}

const categoryStats = computed(() => {
  const totals = new Map<SearchCategory, number>()
  const mastered = new Map<SearchCategory, number>()

  for (const item of searchItems) {
    totals.set(item.category, (totals.get(item.category) ?? 0) + 1)
    const record = learningStore.records[item.id]
    if (record?.mastery === 'mastered') {
      mastered.set(item.category, (mastered.get(item.category) ?? 0) + 1)
    }
  }

  return Array.from(totals.entries())
    .map(([category, total]) => {
      const masteredCount = mastered.get(category) ?? 0
      const rate = total ? Math.round((masteredCount / total) * 100) : 0
      return {
        category,
        label: categoryLabelMap[category],
        total,
        mastered: masteredCount,
        rate,
      }
    })
    .sort((a, b) => b.rate - a.rate)
})
</script>

<style scoped>
.dashboard-page {
  max-width: 980px;
  margin: 0 auto;
  padding: 36px 20px 56px;
}

.back-link {
  color: var(--text-tertiary);
  text-decoration: none;
}

.header h1 {
  margin-top: 10px;
  font-size: 2.1rem;
}

.header p {
  color: var(--text-tertiary);
}

.stats-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 14px;
}

.label {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.value {
  margin-top: 8px;
  font-size: 1.65rem;
  font-weight: 700;
}

.category-panel {
  margin-top: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 14px;
}

.category-panel h2 {
  font-size: 1.1rem;
}

.category-row {
  margin-top: 12px;
}

.row-head {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.track {
  margin-top: 6px;
  height: 8px;
  border-radius: 999px;
  background: var(--bg-secondary);
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--primary-gradient);
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

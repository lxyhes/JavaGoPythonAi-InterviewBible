<template>
  <div class="dashboard-page">
    <header class="header">
      <router-link to="/" class="back-link">Back to home</router-link>
      <h1>Learning Dashboard</h1>
      <p>Track momentum, growth, achievements, and weak areas in one place.</p>
    </header>

    <section class="stats-grid">
      <article class="stat-card">
        <div class="label">Current level</div>
        <div class="value">Lv.{{ learningStore.level }}</div>
      </article>
      <article class="stat-card">
        <div class="label">Total XP</div>
        <div class="value">{{ learningStore.totalXp }}</div>
      </article>
      <article class="stat-card">
        <div class="label">Mastered</div>
        <div class="value">{{ learningStore.masteredQuestionCount }}</div>
      </article>
      <article class="stat-card">
        <div class="label">Today goal</div>
        <div class="value">{{ learningStore.dailyGoalProgress }} / {{ learningStore.dailyGoalTarget }}</div>
      </article>
      <article class="stat-card">
        <div class="label">Streak</div>
        <div class="value">{{ learningStore.streakDays }} days</div>
      </article>
      <article class="stat-card">
        <div class="label">Total reviews</div>
        <div class="value">{{ learningStore.totalReviewActions }}</div>
      </article>
    </section>

    <section class="growth-panel">
      <h2>Level progress</h2>
      <div class="progress-line">
        <div class="progress-fill" :style="{ width: `${learningStore.levelProgressRate}%` }"></div>
      </div>
      <p class="progress-text">
        {{ learningStore.nextLevelRequiredXp - learningStore.currentLevelXp }} XP until Lv.{{ learningStore.level + 1 }}
      </p>
    </section>

    <section class="activity-panel">
      <h2>Last 7 days</h2>
      <div class="week-grid">
        <article v-for="item in learningStore.weeklyActivity" :key="item.date" class="day-card">
          <p class="day-date">{{ toShortDate(item.date) }}</p>
          <p class="day-count">{{ item.count }}</p>
          <div class="bar-track">
            <div class="bar-fill" :style="{ height: `${barHeight(item.count)}%` }"></div>
          </div>
        </article>
      </div>
    </section>

    <section class="achievement-panel">
      <h2>Achievements</h2>
      <div class="achievement-grid">
        <article
          v-for="item in learningStore.achievements"
          :key="item.id"
          :class="['achievement-card', { unlocked: item.unlocked }]"
        >
          <p class="title">{{ item.title }}</p>
          <p class="desc">{{ item.description }}</p>
          <p class="state">{{ item.unlocked ? 'Unlocked' : 'Locked' }}</p>
        </article>
      </div>
    </section>

    <section class="category-panel">
      <h2>Category mastery</h2>

      <div v-for="item in categoryStats" :key="item.category" class="category-row">
        <div class="row-head">
          <span>{{ item.label }}</span>
          <span>{{ item.mastered }} / {{ item.total }} ({{ item.rate }}%)</span>
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
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  algorithm: 'Algorithm',
  'system-design': 'System Design',
  devops: 'DevOps',
  network: 'Network',
  os: 'Operating System',
  ai: 'AI',
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

const maxWeeklyCount = computed(() => Math.max(1, ...learningStore.weeklyActivity.map((item) => item.count)))

const barHeight = (count: number) => Math.max(8, Math.round((count / maxWeeklyCount.value) * 100))

const toShortDate = (value: string) => value.slice(5)
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
  font-size: 1.55rem;
  font-weight: 700;
}

.growth-panel,
.activity-panel,
.achievement-panel,
.category-panel {
  margin-top: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 14px;
}

.progress-line {
  margin-top: 12px;
  height: 8px;
  border-radius: 999px;
  background: var(--bg-secondary);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
}

.progress-text {
  margin-top: 8px;
  color: var(--text-tertiary);
  font-size: 0.88rem;
}

.week-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}

.day-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  padding: 8px;
  text-align: center;
}

.day-date {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.day-count {
  margin-top: 4px;
  font-weight: 700;
  font-size: 1rem;
}

.bar-track {
  margin-top: 8px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: rgba(148, 163, 184, 0.15);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-fill {
  width: 12px;
  border-radius: 999px;
  background: var(--primary-gradient);
}

.achievement-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.achievement-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px;
  background: var(--bg-secondary);
}

.achievement-card.unlocked {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
}

.achievement-card .title {
  font-weight: 700;
}

.achievement-card .desc {
  margin-top: 4px;
  color: var(--text-tertiary);
  font-size: 0.84rem;
}

.achievement-card .state {
  margin-top: 6px;
  font-size: 0.78rem;
  color: var(--text-muted);
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

  .week-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .achievement-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid,
  .week-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="dashboard-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('dashboard.title') }}</h1>
        <p class="page-desc">查看你的学习统计和进度</p>
      </div>
      <div class="header-actions">
        <router-link to="/data-sync" class="action-link">
          <PhosphorIcon name="FloppyDisk" />
          数据同步
        </router-link>
      </div>
    </header>

    <!-- 核心统计卡片 -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-visual">
            <div class="stat-ring">
              <svg viewBox="0 0 36 36">
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6366f1" />
                    <stop offset="50%" style="stop-color:#8b5cf6" />
                    <stop offset="100%" style="stop-color:#a855f7" />
                  </linearGradient>
                </defs>
                <path
                  class="ring-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="ring-fill"
                  :stroke-dasharray="`${learningStore.levelProgressRate}, 100`"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="ring-content">
                <span class="ring-level">Lv.{{ learningStore.level }}</span>
              </div>
            </div>
          </div>
          <div class="stat-details">
            <span class="stat-label">当前等级</span>
            <span class="stat-value">{{ learningStore.totalXp }} XP</span>
            <span class="stat-sublabel">距离 Lv.{{ learningStore.level + 1 }} 还需 {{ learningStore.nextLevelRequiredXp - learningStore.currentLevelXp }} XP</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper mastered">
            <PhosphorIcon name="CheckCircle" class="stat-icon" />
          </div>
          <div class="stat-details">
            <span class="stat-label">已掌握题目</span>
            <span class="stat-value">{{ learningStore.masteredQuestionCount }}</span>
            <span class="stat-sublabel">道题目</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper streak">
            <PhosphorIcon name="Fire" class="stat-icon" />
          </div>
          <div class="stat-details">
            <span class="stat-label">连续学习</span>
            <span class="stat-value">{{ learningStore.streakDays }}</span>
            <span class="stat-sublabel">天</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper reviews">
            <PhosphorIcon name="ArrowCounterClockwise" class="stat-icon" />
          </div>
          <div class="stat-details">
            <span class="stat-label">总复习次数</span>
            <span class="stat-value">{{ learningStore.totalReviewActions }}</span>
            <span class="stat-sublabel">次复习</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper daily">
            <PhosphorIcon name="Target" class="stat-icon" />
          </div>
          <div class="stat-details">
            <span class="stat-label">今日目标</span>
            <span class="stat-value">{{ learningStore.dailyGoalProgress }}/{{ learningStore.dailyGoalTarget }}</span>
            <span class="stat-sublabel">{{ learningStore.dailyGoalDone ? '已完成' : '进行中' }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper weak">
            <PhosphorIcon name="WarningCircle" class="stat-icon" />
          </div>
          <div class="stat-details">
            <span class="stat-label">薄弱题目</span>
            <span class="stat-value">{{ learningStore.weakQuestionCount }}</span>
            <span class="stat-sublabel">道需加强</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区 -->
    <div class="dashboard-layout">
      <!-- 左侧：活动图表和分类进度 -->
      <div class="main-column">
        <!-- 最近7天活动 -->
        <section class="panel activity-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <PhosphorIcon name="ChartBar" class="panel-icon" />
              <h3 class="panel-title">最近7天学习活动</h3>
            </div>
          </div>
          <div class="panel-body">
            <div class="activity-chart">
              <div
                v-for="item in learningStore.weeklyActivity"
                :key="item.date"
                class="activity-bar-wrapper"
              >
                <div class="activity-bar-track">
                  <div
                    class="activity-bar"
                    :style="{ height: `${barHeight(item.count)}%` }"
                    :title="`${item.date}: ${item.count} 题`"
                  ></div>
                </div>
                <span class="activity-date">{{ toShortDate(item.date) }}</span>
                <span class="activity-count">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 分类掌握度 -->
        <section class="panel category-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <PhosphorIcon name="Books" class="panel-icon" />
              <h3 class="panel-title">分类掌握度</h3>
            </div>
          </div>
          <div class="panel-body">
            <div class="category-list">
              <div v-for="item in categoryStats" :key="item.category" class="category-item">
                <div class="category-info">
                  <div class="category-main">
                    <span class="category-name">{{ item.label }}</span>
                    <span class="category-count">{{ item.mastered }}/{{ item.total }}</span>
                  </div>
                  <span class="category-rate" :class="getRateClass(item.rate)">{{ item.rate }}%</span>
                </div>
                <div class="category-progress">
                  <div class="category-track">
                    <div
                      class="category-fill"
                      :style="{ width: `${item.rate}%` }"
                      :class="getRateClass(item.rate)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧：成就 -->
      <div class="side-column">
        <section class="panel achievements-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <PhosphorIcon name="Trophy" class="panel-icon" />
              <h3 class="panel-title">成就</h3>
              <span class="panel-badge">
                {{ learningStore.unlockedAchievementCount }}/{{ learningStore.achievements.length }}
              </span>
            </div>
          </div>
          <div class="panel-body">
            <div class="achievements-list">
              <div
                v-for="item in learningStore.achievements"
                :key="item.id"
                :class="['achievement-item', { unlocked: item.unlocked }]"
              >
                <div class="achievement-icon-wrapper">
                  <PhosphorIcon :name="item.unlocked ? 'Medal' : 'LockKey'" class="achievement-icon" />
                </div>
                <div class="achievement-info">
                  <span class="achievement-name">{{ item.title }}</span>
                  <span class="achievement-desc">{{ item.description }}</span>
                </div>
                <span v-if="item.unlocked" class="achievement-status">已解锁</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import { useLearningStore } from '@/stores/learning'
import type { SearchCategory } from '@/types/search'
import PhosphorIcon from '@/components/PhosphorIcon.vue'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

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
        label: t(`common.categories.${category}`),
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

const getRateClass = (rate: number) => {
  if (rate >= 80) return 'excellent'
  if (rate >= 50) return 'good'
  if (rate >= 20) return 'fair'
  return 'poor'
}
</script>

<style scoped>
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.page-desc {
  font-size: 1rem;
  color: var(--text-tertiary);
}

.header-actions {
  flex-shrink: 0;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.action-link:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 统计区域 */
.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.stat-card.primary {
  grid-column: span 1;
}

/* 环形进度条 */
.stat-visual {
  flex-shrink: 0;
}

.stat-ring {
  position: relative;
  width: 72px;
  height: 72px;
}

.stat-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--bg-secondary);
  stroke-width: 3;
}

.ring-fill {
  fill: none;
  stroke: url(#ringGradient);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray var(--transition-base);
}

.ring-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-level {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--primary-color);
}

/* 图标包装器 */
.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.stat-icon-wrapper.mastered {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%);
}

.stat-icon-wrapper.streak {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%);
}

.stat-icon-wrapper.reviews {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.stat-icon-wrapper.daily {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%);
}

.stat-icon-wrapper.weak {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.1) 100%);
}

.stat-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.stat-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-sublabel {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* 主布局 */
.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 面板样式 */
.panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-icon {
  font-size: 1.125rem;
  display: flex;
  align-items: center;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.panel-badge {
  padding: 2px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.panel-body {
  padding: 20px;
}

/* 活动图表 */
.activity-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  height: 200px;
  padding: 20px 0;
}

.activity-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.activity-bar-track {
  width: 100%;
  height: 140px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  position: relative;
}

.activity-bar {
  width: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  transition: height var(--transition-base);
  min-height: 4px;
}

.activity-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.activity-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* 分类列表 */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.category-count {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.category-rate {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
}

.category-rate.excellent {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.category-rate.good {
  background: rgba(6, 182, 212, 0.1);
  color: #0891b2;
}

.category-rate.fair {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.category-rate.poor {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.category-track {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  border-radius: 999px;
  transition: width var(--transition-base);
}

.category-fill.excellent {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.category-fill.good {
  background: linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%);
}

.category-fill.fair {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

.category-fill.poor {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}

/* 成就列表 */
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
}

.achievement-item.unlocked {
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.2);
}

.achievement-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.achievement-item.unlocked .achievement-icon-wrapper {
  background: rgba(16, 185, 129, 0.1);
}

.achievement-icon {
  font-size: 1.25rem;
  opacity: 0.5;
  display: flex;
  align-items: center;
}

.achievement-item.unlocked .achievement-icon {
  opacity: 1;
}

.achievement-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.achievement-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.achievement-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.achievement-status {
  font-size: 0.75rem;
  font-weight: 500;
  color: #059669;
  padding: 2px 8px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 999px;
  flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card.primary {
    grid-column: span 2;
  }

  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .side-column {
    order: -1;
  }
}

@media (max-width: 640px) {
  .dashboard-page {
    padding: 16px 16px 40px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card.primary {
    grid-column: span 1;
  }

  .stat-card {
    padding: 16px;
  }

  .activity-chart {
    height: 160px;
  }

  .activity-bar-track {
    height: 100px;
  }
}
</style>

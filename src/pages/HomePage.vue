<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <header class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <PhosphorIcon name="target" :size="16" />
          系统化面试准备平台
        </div>
        <h1 class="hero-title">面试指南</h1>
        <p class="hero-desc">覆盖前端、后端、数据库、算法等核心技术领域，助你高效备战技术面试</p>
        <div v-if="comebackMessage" class="comeback-banner">
          <PhosphorIcon name="hand-waving" :size="20" />
          {{ comebackMessage }}
        </div>
      </div>
    </header>

    <!-- 快捷操作区 -->
    <section class="quick-actions-section">
      <div class="section-header">
        <h2 class="section-title">快速开始</h2>
        <p class="section-subtitle">选择适合你的学习方式</p>
      </div>
      <div class="actions-grid">
        <router-link
          v-for="item in actionItems"
          :key="item.key"
          :to="item.to"
          class="action-card"
          :class="{ 'is-primary': item.isPrimary, 'is-highlight': item.isHighlight }"
        >
          <div class="action-icon-wrapper">
            <PhosphorIcon :name="item.icon" class="action-icon" :size="24" />
          </div>
          <div class="action-content">
            <h3 class="action-title">{{ item.title }}</h3>
            <p class="action-desc">{{ item.desc }}</p>
          </div>
          <PhosphorIcon name="arrow-right" class="action-arrow" :size="20" />
        </router-link>
      </div>
    </section>

    <!-- 学习数据概览 -->
    <section class="stats-overview-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-bg level">
            <PhosphorIcon name="star" :size="24" weight="fill" />
          </div>
          <div class="stat-info">
            <span class="stat-label">当前等级</span>
            <span class="stat-value">Lv.{{ learningStore.level }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-bg streak">
            <PhosphorIcon name="lightning" :size="24" weight="fill" />
          </div>
          <div class="stat-info">
            <span class="stat-label">连续学习</span>
            <span class="stat-value">{{ learningStore.streakDays }} 天</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-bg mastered">
            <PhosphorIcon name="check-circle" :size="24" weight="fill" />
          </div>
          <div class="stat-info">
            <span class="stat-label">已掌握</span>
            <span class="stat-value">{{ learningStore.masteredQuestionCount }} 题</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-bg weak">
            <PhosphorIcon name="warning-circle" :size="24" weight="fill" />
          </div>
          <div class="stat-info">
            <span class="stat-label">薄弱项</span>
            <span class="stat-value">{{ learningStore.weakQuestionCount }} 题</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区：两列布局 -->
    <div class="main-layout">
      <!-- 左侧：学习进度和任务 -->
      <div class="main-column">
        <!-- 每日任务 -->
        <section class="panel daily-mission-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <PhosphorIcon name="target" class="panel-icon" :size="20" />
              <h3 class="panel-title">每日任务</h3>
            </div>
            <router-link to="/review" class="panel-link">
              去复习
              <PhosphorIcon name="arrow-right" :size="14" />
            </router-link>
          </div>
          <div class="panel-body">
            <p class="mission-desc">完成今日学习目标，保持学习 streak</p>
            <div class="progress-wrapper">
              <div class="progress-info">
                <span class="progress-text">{{ learningStore.dailyGoalProgress }} / {{ learningStore.dailyGoalTarget }} 题</span>
                <span v-if="learningStore.dailyGoalDone" class="progress-badge done">已完成</span>
                <span v-else class="progress-badge">进行中</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${learningStore.dailyGoalRate}%` }"></div>
              </div>
            </div>
            <div class="goal-selector">
              <span class="selector-label">每日目标：</span>
              <button
                v-for="target in [10, 15, 20]"
                :key="target"
                type="button"
                :class="['goal-chip', { active: learningStore.dailyGoalTarget === target }]"
                @click="learningStore.updateDailyGoalTarget(target)"
              >
                {{ target }} 题
              </button>
            </div>
            <div class="mission-actions">
              <router-link class="btn btn-primary" to="/practice">开始练习</router-link>
              <router-link class="btn btn-secondary" :to="{ path: '/practice', query: { mode: 'weak' } }">薄弱专项</router-link>
            </div>
          </div>
        </section>

        <!-- AI 学习教练 -->
        <section class="panel coach-panel">
          <LearningCoachPanel
            category="mixed"
            :heat-level="learningStore.heatLevel"
            :next-action="learningStore.nextAction"
            :level="learningStore.level"
            :streak-days="learningStore.streakDays"
            :reviewed-today="learningStore.reviewedTodayCount"
            :daily-goal-target="learningStore.dailyGoalTarget"
            :weak-count="learningStore.weakQuestionCount"
            :due-count="learningStore.reviewQueueIds.length"
            :unlocked-achievements="learningStore.unlockedAchievementCount"
          />
        </section>

        <!-- 等级进度 -->
        <section class="panel level-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <PhosphorIcon name="trend-up" class="panel-icon" :size="20" />
              <h3 class="panel-title">成长进度</h3>
            </div>
            <router-link to="/dashboard" class="panel-link">
              查看详情
              <PhosphorIcon name="arrow-right" :size="14" />
            </router-link>
          </div>
          <div class="panel-body">
            <div class="level-display">
              <div class="current-level">
                <span class="level-badge">Lv.{{ learningStore.level }}</span>
                <span class="xp-value">{{ learningStore.totalXp }} XP</span>
              </div>
              <div class="next-level">Lv.{{ learningStore.level + 1 }}</div>
            </div>
            <div class="xp-progress-bar">
              <div class="xp-progress-fill" :style="{ width: `${learningStore.levelProgressRate}%` }"></div>
            </div>
            <p class="xp-remaining">距离下一级还需 {{ learningStore.nextLevelRequiredXp - learningStore.currentLevelXp }} XP</p>

            <div class="achievements-preview" v-if="nextLockedAchievement">
              <p class="achievements-count">已解锁 {{ learningStore.unlockedAchievementCount }}/{{ learningStore.achievements.length }} 个成就</p>
              <div class="next-achievement">
                <PhosphorIcon name="trophy" class="achievement-icon" :size="20" />
                <div class="achievement-info">
                  <span class="achievement-name">{{ nextLockedAchievement.title }}</span>
                  <span class="achievement-desc">{{ nextLockedAchievement.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧：待复习和最近活动 -->
      <div class="side-column">
        <!-- 今日待复习 -->
        <section class="panel review-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <PhosphorIcon name="arrow-counter-clockwise" class="panel-icon" :size="20" />
              <h3 class="panel-title">今日待复习</h3>
              <span v-if="duePreview.length" class="panel-badge">{{ duePreview.length }}</span>
            </div>
            <router-link to="/review" class="panel-link">
              查看全部
              <PhosphorIcon name="arrow-right" :size="14" />
            </router-link>
          </div>
          <div class="panel-body">
            <ul v-if="duePreview.length" class="item-list">
              <li v-for="item in duePreview" :key="item.id" class="item-row">
                <router-link :to="{ path: item.path, hash: `#${item.anchor}` }" class="item-link">
                  <span class="item-title">{{ item.question }}</span>
                  <span class="item-tag" :class="item.category">{{ categoryLabel(item.category) }}</span>
                </router-link>
              </li>
            </ul>
            <div v-else class="empty-state">
              <PhosphorIcon name="confetti" class="empty-icon" :size="40" />
              <p class="empty-text">今天没有待复习的题目</p>
              <router-link to="/practice" class="empty-action">去练习新题</router-link>
            </div>
          </div>
        </section>

        <!-- 最近学习 -->
        <section class="panel history-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <PhosphorIcon name="book-open" class="panel-icon" :size="20" />
              <h3 class="panel-title">最近学习</h3>
            </div>
            <router-link to="/dashboard" class="panel-link">
              学习看板
              <PhosphorIcon name="arrow-right" :size="14" />
            </router-link>
          </div>
          <div class="panel-body">
            <ul v-if="recentHistory.length" class="item-list">
              <li v-for="item in recentHistory" :key="`${item.id}-${item.reviewedAt}`" class="item-row">
                <div class="history-item">
                  <div class="history-main">
                    <span class="item-title">{{ item.question }}</span>
                    <span class="item-tag" :class="item.mastery">{{ masteryLabel(item.mastery) }}</span>
                  </div>
                  <div class="history-meta">
                    <span class="history-time">{{ formatTime(item.reviewedAt) }}</span>
                    <span class="history-category">{{ categoryLabel(item.category) }}</span>
                  </div>
                </div>
              </li>
            </ul>
            <div v-else class="empty-state">
              <PhosphorIcon name="notebook" class="empty-icon" :size="40" />
              <p class="empty-text">还没有学习记录</p>
              <router-link to="/practice" class="empty-action">开始第一题</router-link>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 题库分类 -->
    <section class="categories-section">
      <div class="section-header">
        <h2 class="section-title">题库分类</h2>
        <p class="section-subtitle">选择你感兴趣的领域开始学习</p>
      </div>
      <div class="categories-grid">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="category-card"
        >
          <div class="category-icon-wrapper">
            <PhosphorIcon :name="item.icon" class="category-icon" :size="28" />
          </div>
          <div class="category-content">
            <h3 class="category-name">{{ categoryLabel(item.category) }}</h3>
            <p class="category-desc">{{ item.desc }}</p>
          </div>
          <PhosphorIcon name="arrow-right" class="category-arrow" :size="20" />
        </router-link>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="home-footer">
      <p>© 2026 面试指南 - 让面试准备更高效</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import LearningCoachPanel from '@/components/LearningCoachPanel.vue'
import PhosphorIcon from '@/components/PhosphorIcon.vue'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import type { LearningAchievement, MasteryLevel } from '@/stores/learning'
import { useLearningStore } from '@/stores/learning'
import type { SearchCategory, SearchItem } from '@/types/search'
import { loadPracticeSession } from '@/utils/practiceSession'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t
const itemMap = new Map(searchItems.map((item) => [item.id, item]))
const practiceSessionUpdatedAt = ref<string | null>(null)

type RecentHistory = {
  id: string
  question: string
  category: SearchCategory
  reviewedAt: string
  mastery: MasteryLevel
}

type QuickAction = {
  key: string
  to: RouteLocationRaw
  icon: string
  title: string
  desc: string
  isPrimary?: boolean
  isHighlight?: boolean
}

const categoryLabel = (category: SearchCategory) => t(`common.categories.${category}`)
const masteryLabel = (mastery: MasteryLevel) => t(`common.mastery.${mastery}`)

const comebackMessage = computed(() => {
  if (learningStore.inactiveDays >= 3) return t('home.comebackLong', { days: learningStore.inactiveDays })
  if (learningStore.inactiveDays >= 1) return t('home.comebackShort')
  return ''
})

const duePreview = computed<SearchItem[]>(() => {
  return learningStore.reviewQueueIds.slice(0, 5).reduce<SearchItem[]>((acc, id) => {
    const item = itemMap.get(id)
    if (item) acc.push(item)
    return acc
  }, [])
})

const recentHistory = computed<RecentHistory[]>(() => {
  return learningStore.history.slice(0, 6).reduce<RecentHistory[]>((acc, entry) => {
    const source = itemMap.get(entry.questionId)
    if (source) {
      acc.push({
        id: entry.questionId,
        question: source.question,
        category: source.category,
        reviewedAt: entry.reviewedAt,
        mastery: entry.mastery,
      })
    }
    return acc
  }, [])
})

const nextLockedAchievement = computed<LearningAchievement | null>(() => {
  return learningStore.achievements.find((item) => !item.unlocked) ?? null
})

const formatTime = (value: string) => new Date(value).toLocaleString(i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US')

const baseActionItems = computed<QuickAction[]>(() => {
  const list: QuickAction[] = [
    { key: 'practice', to: '/practice', icon: 'pencil-simple', title: '开始练习', desc: '系统化的刷题训练', isPrimary: true },
    { key: 'review', to: '/review', icon: 'arrow-counter-clockwise', title: '复习队列', desc: '巩固已学内容' },
    { key: 'search', to: '/search', icon: 'magnifying-glass', title: '搜索题目', desc: '快速找到想学的知识点' },
    { key: 'dashboard', to: '/dashboard', icon: 'squares-four', title: '学习看板', desc: '查看学习统计和进度' },
  ]

  if (learningStore.weakQuestionCount > 0) {
    list.unshift({
      key: 'weak-practice',
      to: { path: '/practice', query: { mode: 'weak' } },
      icon: 'target',
      title: '薄弱专项',
      desc: `针对 ${learningStore.weakQuestionCount} 道薄弱题目强化训练`,
      isHighlight: true,
    })
  }

  if (learningStore.nextAction === 'review' && learningStore.reviewQueueIds.length > 0) {
    list.unshift({
      key: 'recommended',
      to: '/review',
      icon: 'clock-countdown',
      title: '推荐复习',
      desc: `${learningStore.reviewQueueIds.length} 道题待复习`,
      isHighlight: true,
    })
  }

  return list
})

const actionItems = computed<QuickAction[]>(() => {
  if (!practiceSessionUpdatedAt.value) return baseActionItems.value

  return [
    {
      key: 'resume-practice',
      to: { path: '/practice', query: { resume: '1' } },
      icon: 'play-circle',
      title: '继续练习',
      desc: `上次练习于 ${formatTime(practiceSessionUpdatedAt.value)}`,
      isPrimary: true,
    },
    ...baseActionItems.value,
  ]
})

const navItems = computed(() => [
  { path: '/frontend', icon: 'palette', category: 'frontend' as const, desc: t('home.nav.frontendDesc') },
  { path: '/backend', icon: 'gear', category: 'backend' as const, desc: t('home.nav.backendDesc') },
  { path: '/database', icon: 'database', category: 'database' as const, desc: t('home.nav.databaseDesc') },
  { path: '/algorithm', icon: 'function', category: 'algorithm' as const, desc: t('home.nav.algorithmDesc') },
  { path: '/system-design', icon: 'layers', category: 'system-design' as const, desc: t('home.nav.systemDesignDesc') },
  { path: '/devops', icon: 'rocket-launch', category: 'devops' as const, desc: t('home.nav.devopsDesc') },
  { path: '/network', icon: 'globe', category: 'network' as const, desc: t('home.nav.networkDesc') },
  { path: '/os', icon: 'desktop', category: 'os' as const, desc: t('home.nav.osDesc') },
  { path: '/ai', icon: 'brain', category: 'ai' as const, desc: t('home.nav.aiDesc') },
])

onMounted(() => {
  const session = loadPracticeSession()
  practiceSessionUpdatedAt.value = session?.updatedAt ?? null
})
</script>

<style scoped>
.home-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}

/* Hero 区域 */
.hero-section {
  text-align: center;
  padding: 40px 0 32px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 1.125rem;
  color: var(--text-tertiary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.comeback-banner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: var(--radius-lg);
  color: #92400e;
  font-size: 0.9375rem;
}

/* 区域标题 */
.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
}

/* 快捷操作区 */
.quick-actions-section {
  margin-bottom: 32px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-base);
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.action-card.is-primary {
  background: var(--primary-gradient);
  border-color: transparent;
  color: white;
}

.action-card.is-primary .action-desc {
  color: rgba(255, 255, 255, 0.8);
}

.action-card.is-highlight {
  border-color: var(--accent-color);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, var(--card-bg) 100%);
}

.action-icon-wrapper {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.action-card.is-primary .action-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

.action-icon {
  color: var(--primary-color);
}

.action-card.is-primary .action-icon {
  color: white;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.action-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.action-desc {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-arrow {
  color: var(--text-muted);
  opacity: 0;
  transition: all var(--transition-fast);
}

.action-card:hover .action-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* 统计数据概览 */
.stats-overview-section {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.stat-icon-bg {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.stat-icon-bg.level {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: #6366f1;
}

.stat-icon-bg.streak {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%);
  color: #f59e0b;
}

.stat-icon-bg.mastered {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%);
  color: #10b981;
}

.stat-icon-bg.weak {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.1) 100%);
  color: #ef4444;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* 主布局 */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  margin-bottom: 32px;
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
  color: var(--primary-color);
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

.panel-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: opacity var(--transition-fast);
}

.panel-link:hover {
  opacity: 0.8;
}

.panel-body {
  padding: 20px;
}

/* 每日任务面板 */
.mission-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.progress-wrapper {
  margin-bottom: 16px;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.progress-badge {
  padding: 4px 10px;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.progress-badge.done {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.progress-bar {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 999px;
  transition: width var(--transition-base);
}

.goal-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.selector-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.goal-chip {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-secondary);
  border-radius: 999px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.goal-chip:hover {
  border-color: var(--primary-light);
}

.goal-chip.active {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  font-weight: 500;
}

.mission-actions {
  display: flex;
  gap: 10px;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  flex: 1;
}

.btn-primary:hover {
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
}

/* 等级面板 */
.level-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.current-level {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-badge {
  padding: 6px 12px;
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 700;
}

.xp-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.next-level {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}

.xp-progress-bar {
  height: 10px;
  background: var(--bg-secondary);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 8px;
}

.xp-progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 999px;
  transition: width var(--transition-base);
}

.xp-remaining {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.achievements-preview {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.achievements-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.next-achievement {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.achievement-icon {
  color: var(--accent-color);
}

.achievement-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.achievement-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.achievement-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 列表样式 */
.item-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.item-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.item-link:hover {
  background: var(--border-color);
}

.item-title {
  font-size: 0.875rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.item-tag {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  flex-shrink: 0;
}

.item-tag.frontend {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.item-tag.backend {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.item-tag.database {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.item-tag.algorithm {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
}

.item-tag.system-design {
  background: rgba(236, 72, 153, 0.1);
  color: #db2777;
}

.item-tag.devops {
  background: rgba(6, 182, 212, 0.1);
  color: #0891b2;
}

.item-tag.network {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
}

.item-tag.os {
  background: rgba(75, 85, 99, 0.1);
  color: #374151;
}

.item-tag.ai {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.item-tag.unknown {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.item-tag.vague {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.item-tag.mastered {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

/* 历史记录项 */
.history-item {
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.history-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.history-time {
  white-space: nowrap;
}

.history-category {
  padding: 2px 8px;
  background: var(--card-bg);
  border-radius: 999px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 32px 20px;
}

.empty-icon {
  color: var(--primary-color);
  margin-bottom: 12px;
  display: block;
}

.empty-text {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  margin-bottom: 12px;
}

.empty-action {
  display: inline-flex;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.empty-action:hover {
  background: var(--primary-dark);
}

/* 题库分类 */
.categories-section {
  margin-bottom: 40px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-base);
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.category-icon-wrapper {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.category-icon {
  color: var(--primary-color);
}

.category-content {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.category-desc {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-arrow {
  color: var(--text-muted);
  opacity: 0;
  transition: all var(--transition-fast);
}

.category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* 页脚 */
.home-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .side-column {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 16px 16px 40px;
  }

  .hero-section {
    padding: 24px 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-desc {
    font-size: 1rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-icon-bg {
    width: 40px;
    height: 40px;
  }

  .side-column {
    grid-template-columns: 1fr;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .mission-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

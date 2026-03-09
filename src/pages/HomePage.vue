<template>
  <div class="home-page">
    <header class="hero">
      <p class="eyebrow">Mianshi Guide</p>
      <h1>{{ t('home.heroTitle') }}</h1>
      <p class="hero-desc">{{ t('home.heroDesc') }}</p>
      <p v-if="comebackMessage" class="comeback-tip">{{ comebackMessage }}</p>
    </header>

    <section class="quick-actions">
      <router-link v-for="item in actionItems" :key="item.key" :to="item.to" class="action-card">
        <div class="action-icon" aria-hidden="true">{{ item.icon }}</div>
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </router-link>
    </section>

    <section class="stats-panel">
      <article class="stat-item">
        <p>{{ t('common.level') }}</p>
        <strong>Lv.{{ learningStore.level }}</strong>
      </article>
      <article class="stat-item">
        <p>{{ t('common.todayGoal') }}</p>
        <strong>{{ learningStore.dailyGoalProgress }} / {{ learningStore.dailyGoalTarget }}</strong>
      </article>
      <article class="stat-item">
        <p>{{ t('common.weakItems') }}</p>
        <strong>{{ learningStore.weakQuestionCount }}</strong>
      </article>
      <article class="stat-item">
        <p>{{ t('common.streak') }}</p>
        <strong>{{ learningStore.streakDays }} {{ t('common.days') }}</strong>
      </article>
    </section>

    <section class="retention-grid">
      <article class="focus-card">
        <div class="focus-head">
          <h2>{{ t('home.dailyMission') }}</h2>
          <router-link to="/review">{{ t('home.openReview') }}</router-link>
        </div>

        <p class="mission-desc">{{ t('home.missionDesc') }}</p>

        <div class="goal-bar">
          <div class="goal-fill" :style="{ width: `${learningStore.dailyGoalRate}%` }"></div>
        </div>
        <p class="goal-text">
          {{ learningStore.dailyGoalProgress }} / {{ learningStore.dailyGoalTarget }}
          <span v-if="learningStore.dailyGoalDone" class="done">{{ t('home.done') }}</span>
        </p>

        <div class="goal-preset">
          <button
            v-for="target in [10, 15, 20]"
            :key="target"
            type="button"
            :class="['chip', { active: learningStore.dailyGoalTarget === target }]"
            @click="learningStore.updateDailyGoalTarget(target)"
          >
            {{ target }} {{ t('home.perDay') }}
          </button>
        </div>

        <div class="mission-actions">
          <router-link class="primary-btn" to="/practice">{{ t('home.practice') }}</router-link>
          <router-link class="ghost-btn" :to="{ path: '/practice', query: { mode: 'weak' } }">{{ t('home.weakMode') }}</router-link>
        </div>
      </article>

      <article class="focus-card">
        <div class="focus-head">
          <h2>{{ t('home.growth') }}</h2>
          <router-link to="/dashboard">{{ t('home.openDashboard') }}</router-link>
        </div>

        <p class="growth-level">Lv.{{ learningStore.level }} 路 {{ learningStore.totalXp }} XP</p>
        <div class="goal-bar">
          <div class="goal-fill" :style="{ width: `${learningStore.levelProgressRate}%` }"></div>
        </div>
        <p class="goal-text">{{ t('home.xpToNext', { xp: learningStore.nextLevelRequiredXp - learningStore.currentLevelXp }) }}</p>

        <div class="achievements-preview">
          <p>{{ t('home.achievements', { unlocked: learningStore.unlockedAchievementCount, total: learningStore.achievements.length }) }}</p>
          <p v-if="nextLockedAchievement">{{ t('home.nextAchievement', { title: nextLockedAchievement.title, description: nextLockedAchievement.description }) }}</p>
          <p v-else>{{ t('home.allUnlocked') }}</p>
        </div>
      </article>
    </section>    <section class="coach-section">
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

    <section class="focus-grid">
      <article class="focus-card">
        <div class="focus-head">
          <h2>{{ t('home.dueToday') }}</h2>
          <router-link to="/review">{{ t('home.seeAll') }}</router-link>
        </div>

        <ul v-if="duePreview.length" class="question-list">
          <li v-for="item in duePreview" :key="item.id">
            <router-link :to="{ path: item.path, hash: `#${item.anchor}` }">{{ item.question }}</router-link>
            <span>{{ categoryLabel(item.category) }}</span>
          </li>
        </ul>

        <div v-else class="empty-tip">{{ t('home.noDue') }}</div>
      </article>

      <article class="focus-card">
        <div class="focus-head">
          <h2>{{ t('home.recentActivity') }}</h2>
          <router-link to="/dashboard">{{ t('home.learningBoard') }}</router-link>
        </div>

        <ul v-if="recentHistory.length" class="history-list">
          <li v-for="item in recentHistory" :key="`${item.id}-${item.reviewedAt}`">
            <div>
              <p class="history-question">{{ item.question }}</p>
              <p class="history-meta">{{ formatTime(item.reviewedAt) }} 路 {{ masteryLabel(item.mastery) }}</p>
            </div>
            <span class="history-category">{{ categoryLabel(item.category) }}</span>
          </li>
        </ul>

        <div v-else class="empty-tip">{{ t('home.noHistory') }}</div>
      </article>
    </section>

    <section class="category-section">
      <div class="section-head">
        <h2>{{ t('home.topicLibrary') }}</h2>
        <p>{{ t('home.topicLibraryDesc') }}</p>
      </div>

      <nav class="main-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-card">
          <span class="icon">{{ item.icon }}</span>
          <h3>{{ categoryLabel(item.category) }}</h3>
          <p>{{ item.desc }}</p>
        </router-link>
      </nav>
    </section>

    <footer class="home-footer">
      <p>{{ t('home.footer') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import LearningCoachPanel from '@/components/LearningCoachPanel.vue'
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
    { key: 'search', to: '/search', icon: 'Explore', title: t('home.actions.searchTitle'), desc: t('home.actions.searchDesc') },
    { key: 'practice', to: '/practice', icon: 'Train', title: t('home.actions.practiceTitle'), desc: t('home.actions.practiceDesc') },
    { key: 'review', to: '/review', icon: 'Repeat', title: t('home.actions.reviewTitle'), desc: t('home.actions.reviewDesc') },
    { key: 'dashboard', to: '/dashboard', icon: 'Track', title: t('home.actions.dashboardTitle'), desc: t('home.actions.dashboardDesc') },
    { key: 'community', to: '/community', icon: 'Chat', title: t('home.actions.communityTitle'), desc: t('home.actions.communityDesc') },
    { key: 'leaderboard', to: '/leaderboard', icon: 'Trophy', title: t('home.actions.leaderboardTitle'), desc: t('home.actions.leaderboardDesc') },
  ]

  if (learningStore.weakQuestionCount > 0) {
    list.unshift({
      key: 'weak-practice',
      to: { path: '/practice', query: { mode: 'weak' } },
      icon: 'Focus',
      title: t('home.actions.weakTitle'),
      desc: t('home.actions.weakDesc', { count: learningStore.weakQuestionCount }),
    })
  }

  if (learningStore.nextAction === 'review' && learningStore.reviewQueueIds.length > 0) {
    list.unshift({
      key: 'recommended',
      to: '/review',
      icon: 'Next',
      title: t('home.actions.recommendedTitle'),
      desc: t('home.actions.recommendedDesc', { count: learningStore.reviewQueueIds.length }),
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
      icon: 'Resume',
      title: t('home.actions.resumeTitle'),
      desc: t('home.actions.resumeDesc', { time: formatTime(practiceSessionUpdatedAt.value) }),
    },
    ...baseActionItems.value,
  ]
})

const navItems = computed(() => [
  { path: '/frontend', icon: 'UI', category: 'frontend' as const, desc: t('home.nav.frontendDesc') },
  { path: '/backend', icon: 'API', category: 'backend' as const, desc: t('home.nav.backendDesc') },
  { path: '/database', icon: 'Data', category: 'database' as const, desc: t('home.nav.databaseDesc') },
  { path: '/algorithm', icon: 'Algo', category: 'algorithm' as const, desc: t('home.nav.algorithmDesc') },
  { path: '/system-design', icon: 'Arch', category: 'system-design' as const, desc: t('home.nav.systemDesignDesc') },
  { path: '/devops', icon: 'Ops', category: 'devops' as const, desc: t('home.nav.devopsDesc') },
  { path: '/network', icon: 'Net', category: 'network' as const, desc: t('home.nav.networkDesc') },
  { path: '/os', icon: 'OS', category: 'os' as const, desc: t('home.nav.osDesc') },
  { path: '/ai', icon: 'AI', category: 'ai' as const, desc: t('home.nav.aiDesc') },
])

onMounted(() => {
  const session = loadPracticeSession()
  practiceSessionUpdatedAt.value = session?.updatedAt ?? null
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 44px 24px 60px;
  max-width: 1220px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 26px;
}

.eyebrow {
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.hero h1 {
  margin-top: 8px;
  font-size: 3rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  margin: 14px auto 0;
  max-width: 720px;
  color: var(--text-tertiary);
  font-size: 1.08rem;
}

.comeback-tip {
  margin-top: 14px;
  color: #92400e;
  background: rgba(245, 158, 11, 0.16);
  display: inline-block;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.82rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.action-card {
  display: flex;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 14px;
}

.action-icon {
  min-width: 52px;
  font-size: 0.78rem;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary-color);
}

.action-card h3 {
  font-size: 1rem;
}

.action-card p {
  margin-top: 6px;
  color: var(--text-tertiary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.stats-panel {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.stat-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 12px 14px;
}

.stat-item p {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.stat-item strong {
  display: block;
  margin-top: 8px;
  font-size: 1.45rem;
}

.retention-grid,
.focus-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.coach-section {
  margin-top: 14px;
}

.focus-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 14px;
}

.focus-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.focus-head h2 {
  font-size: 1rem;
}

.focus-head a {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
}

.mission-desc,
.growth-level {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.goal-bar {
  margin-top: 10px;
  height: 8px;
  border-radius: 999px;
  background: var(--bg-secondary);
  overflow: hidden;
}

.goal-fill {
  height: 100%;
  background: var(--primary-gradient);
}

.goal-text {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.goal-text .done {
  margin-left: 6px;
  color: #059669;
}

.goal-preset {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 999px;
  height: 30px;
  padding: 0 10px;
  font-size: 0.82rem;
  cursor: pointer;
}

.chip.active {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.mission-actions {
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

.achievements-preview {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 0.86rem;
  display: grid;
  gap: 6px;
}

.question-list,
.history-list {
  margin-top: 10px;
  list-style: none;
  display: grid;
  gap: 8px;
}

.question-list li,
.history-list li {
  padding: 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.question-list li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.question-list a {
  text-decoration: none;
  color: var(--text-primary);
}

.question-list span,
.history-category {
  color: var(--text-muted);
  font-size: 0.8125rem;
  white-space: nowrap;
}

.history-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.history-question {
  font-size: 0.92rem;
}

.history-meta {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.empty-tip {
  margin-top: 10px;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.category-section {
  margin-top: 22px;
}

.section-head h2 {
  font-size: 1.35rem;
}

.section-head p {
  color: var(--text-tertiary);
  margin-top: 6px;
}

.main-nav {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.nav-card {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 18px;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.22s ease;
}

.nav-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.nav-card .icon {
  font-size: 1rem;
  margin-bottom: 8px;
  display: block;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.nav-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.nav-card p {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  line-height: 1.55;
}

.home-footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.88rem;
  margin-top: 24px;
}

.tomorrow-plan-section {
  margin-top: 14px;
}

.tomorrow-plan-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 18px;
}

.plan-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.plan-badge {
  background: var(--primary-gradient);
  color: #fff;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
}

.plan-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
}

.plan-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.plan-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.plan-stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary-color);
}

.plan-stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.plan-focus {
  margin-bottom: 16px;
}

.plan-focus-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.plan-focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.focus-tag {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.plan-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.plan-actions .primary-btn,
.plan-actions .ghost-btn {
  border: none;
  cursor: pointer;
}

.text-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.86rem;
  cursor: pointer;
  padding: 0 12px;
  height: 34px;
}

.text-btn:hover {
  color: var(--text-secondary);
}

.plan-empty {
  text-align: center;
  padding: 20px 0;
}

.plan-empty p {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

@media (max-width: 980px) {
  .quick-actions,
  .stats-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .retention-grid,
  .focus-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .home-page {
    padding: 28px 16px 44px;
  }

  .hero h1 {
    font-size: 2.2rem;
  }

  .quick-actions,
  .stats-panel {
    grid-template-columns: 1fr;
  }
}
</style>

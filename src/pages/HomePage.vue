<template>
  <div class="home-page">
    <header class="hero">
      <p class="eyebrow">Mianshi Guide</p>
      <h1>Build Interview Momentum Every Day</h1>
      <p class="hero-desc">Practice, review, and follow a clear next step instead of random browsing.</p>
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
        <p>Level</p>
        <strong>Lv.{{ learningStore.level }}</strong>
      </article>
      <article class="stat-item">
        <p>Today Goal</p>
        <strong>{{ learningStore.dailyGoalProgress }} / {{ learningStore.dailyGoalTarget }}</strong>
      </article>
      <article class="stat-item">
        <p>Weak Items</p>
        <strong>{{ learningStore.weakQuestionCount }}</strong>
      </article>
      <article class="stat-item">
        <p>Streak</p>
        <strong>{{ learningStore.streakDays }} days</strong>
      </article>
    </section>

    <section class="retention-grid">
      <article class="focus-card">
        <div class="focus-head">
          <h2>Daily Mission</h2>
          <router-link to="/review">Open review</router-link>
        </div>

        <p class="mission-desc">Finish your target to lock your streak and reduce forgetting.</p>

        <div class="goal-bar">
          <div class="goal-fill" :style="{ width: `${learningStore.dailyGoalRate}%` }"></div>
        </div>
        <p class="goal-text">
          Done {{ learningStore.dailyGoalProgress }} / {{ learningStore.dailyGoalTarget }}
          <span v-if="learningStore.dailyGoalDone" class="done">done</span>
        </p>

        <div class="goal-preset">
          <button
            v-for="target in [10, 15, 20]"
            :key="target"
            type="button"
            :class="['chip', { active: learningStore.dailyGoalTarget === target }]"
            @click="learningStore.updateDailyGoalTarget(target)"
          >
            {{ target }} / day
          </button>
        </div>

        <div class="mission-actions">
          <router-link class="primary-btn" to="/practice">Practice</router-link>
          <router-link class="ghost-btn" :to="{ path: '/practice', query: { mode: 'weak' } }">Weak mode</router-link>
        </div>
      </article>

      <article class="focus-card">
        <div class="focus-head">
          <h2>Growth</h2>
          <router-link to="/dashboard">Open dashboard</router-link>
        </div>

        <p class="growth-level">Lv.{{ learningStore.level }} · {{ learningStore.totalXp }} XP</p>
        <div class="goal-bar">
          <div class="goal-fill" :style="{ width: `${learningStore.levelProgressRate}%` }"></div>
        </div>
        <p class="goal-text">{{ learningStore.nextLevelRequiredXp - learningStore.currentLevelXp }} XP to next level</p>

        <div class="achievements-preview">
          <p>Achievements {{ learningStore.unlockedAchievementCount }} / {{ learningStore.achievements.length }}</p>
          <p v-if="nextLockedAchievement">Next: {{ nextLockedAchievement.title }} ({{ nextLockedAchievement.description }})</p>
          <p v-else>All unlocked. Keep the pace.</p>
        </div>
      </article>
    </section>

    <section class="coach-section">
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
          <h2>Due Today</h2>
          <router-link to="/review">See all</router-link>
        </div>

        <ul v-if="duePreview.length" class="question-list">
          <li v-for="item in duePreview" :key="item.id">
            <router-link :to="{ path: item.path, hash: `#${item.anchor}` }">{{ item.question }}</router-link>
            <span>{{ categoryLabelMap[item.category] }}</span>
          </li>
        </ul>

        <div v-else class="empty-tip">No due items now. Add more practice items first.</div>
      </article>

      <article class="focus-card">
        <div class="focus-head">
          <h2>Recent Activity</h2>
          <router-link to="/dashboard">Learning board</router-link>
        </div>

        <ul v-if="recentHistory.length" class="history-list">
          <li v-for="item in recentHistory" :key="`${item.id}-${item.reviewedAt}`">
            <div>
              <p class="history-question">{{ item.question }}</p>
              <p class="history-meta">{{ formatTime(item.reviewedAt) }} · {{ masteryLabelMap[item.mastery] }}</p>
            </div>
            <span class="history-category">{{ categoryLabelMap[item.category] }}</span>
          </li>
        </ul>

        <div v-else class="empty-tip">No history yet. Start from practice mode.</div>
      </article>
    </section>

    <section class="category-section">
      <div class="section-head">
        <h2>Topic Library</h2>
        <p>Jump into a focused knowledge area.</p>
      </div>

      <nav class="main-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-card">
          <span class="icon">{{ item.icon }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </router-link>
      </nav>
    </section>

    <footer class="home-footer">
      <p>Shortcut: Ctrl/Cmd + K for search. Use 1/2/3 in practice mode to rate mastery.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import LearningCoachPanel from '@/components/LearningCoachPanel.vue'
import { searchItems } from '@/data/search-index'
import type { LearningAchievement, MasteryLevel } from '@/stores/learning'
import { useLearningStore } from '@/stores/learning'
import type { SearchCategory, SearchItem } from '@/types/search'
import { loadPracticeSession } from '@/utils/practiceSession'

const learningStore = useLearningStore()
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

const masteryLabelMap: Record<MasteryLevel, string> = {
  unknown: 'Unknown',
  vague: 'Vague',
  mastered: 'Mastered',
}

const categoryLabelMap: Record<SearchCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  algorithm: 'Algorithm',
  'system-design': 'System Design',
  devops: 'DevOps',
  network: 'Network',
  os: 'OS',
  ai: 'AI',
}

const comebackMessage = computed(() => {
  if (learningStore.inactiveDays >= 3) {
    return `You have been away for ${learningStore.inactiveDays} days. Start with 10 minutes to restart momentum.`
  }

  if (learningStore.inactiveDays >= 1) {
    return 'Keep your streak alive today with one short session.'
  }

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

const formatTime = (value: string) => new Date(value).toLocaleString()

const baseActionItems = computed<QuickAction[]>(() => {
  const list: QuickAction[] = [
    { key: 'search', to: '/search', icon: 'Explore', title: 'Global Search', desc: 'Find by keyword, category and tag' },
    { key: 'practice', to: '/practice', icon: 'Train', title: 'Practice Mode', desc: 'Think first, then reveal and score' },
    { key: 'review', to: '/review', icon: 'Repeat', title: 'Review Queue', desc: 'Auto schedule by 1/3/7 day rules' },
    { key: 'dashboard', to: '/dashboard', icon: 'Track', title: 'Growth Board', desc: 'Track progress and weak points' },
  ]

  if (learningStore.weakQuestionCount > 0) {
    list.unshift({
      key: 'weak-practice',
      to: { path: '/practice', query: { mode: 'weak' } },
      icon: 'Focus',
      title: 'Weak Focus',
      desc: `${learningStore.weakQuestionCount} items to reinforce`,
    })
  }

  if (learningStore.nextAction === 'review' && learningStore.reviewQueueIds.length > 0) {
    list.unshift({
      key: 'recommended',
      to: '/review',
      icon: 'Next',
      title: 'Recommended Now',
      desc: `Clear ${learningStore.reviewQueueIds.length} due reviews first`,
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
      title: 'Resume Session',
      desc: `Last practice: ${formatTime(practiceSessionUpdatedAt.value)}`,
    },
    ...baseActionItems.value,
  ]
})

const navItems = [
  { path: '/frontend', icon: 'UI', title: 'Frontend', desc: 'HTML/CSS/JS, React, Vue, Vite' },
  { path: '/backend', icon: 'API', title: 'Backend', desc: 'Java, Python, Go, Node, microservices' },
  { path: '/database', icon: 'Data', title: 'Database', desc: 'MySQL, Redis, MongoDB' },
  { path: '/algorithm', icon: 'Algo', title: 'Algorithm', desc: 'Data structures and LeetCode' },
  { path: '/system-design', icon: 'Arch', title: 'System Design', desc: 'Concurrency and distributed systems' },
  { path: '/devops', icon: 'Ops', title: 'DevOps', desc: 'Docker, Kubernetes, CI/CD' },
  { path: '/network', icon: 'Net', title: 'Network', desc: 'TCP/IP, HTTP/HTTPS, sockets' },
  { path: '/os', icon: 'OS', title: 'OS', desc: 'Process, memory, Linux' },
  { path: '/ai', icon: 'AI', title: 'AI', desc: 'ML, DL, LLM apps' },
]

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

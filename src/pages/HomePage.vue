<template>
  <div class="home-page">
    <header class="hero">
      <p class="eyebrow">Mianshi Guide</p>
      <h1>面试准备，不止看题库</h1>
      <p class="hero-desc">从搜索定位到刷题训练，再到复习与看板追踪，形成可执行的冲刺闭环。</p>
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
        <p>已追踪题目</p>
        <strong>{{ learningStore.totalTrackedQuestions }}</strong>
      </article>
      <article class="stat-item">
        <p>已掌握题目</p>
        <strong>{{ learningStore.masteredQuestionCount }}</strong>
      </article>
      <article class="stat-item">
        <p>薄弱题</p>
        <strong>{{ learningStore.weakQuestionCount }}</strong>
      </article>
      <article class="stat-item">
        <p>连续学习</p>
        <strong>{{ learningStore.streakDays }} 天</strong>
      </article>
    </section>

    <section class="focus-grid">
      <article class="focus-card">
        <div class="focus-head">
          <h2>今日待复习</h2>
          <router-link to="/review">查看全部</router-link>
        </div>

        <ul v-if="duePreview.length" class="question-list">
          <li v-for="item in duePreview" :key="item.id">
            <router-link :to="{ path: item.path, hash: `#${item.anchor}` }">{{ item.question }}</router-link>
            <span>{{ categoryLabelMap[item.category] }}</span>
          </li>
        </ul>

        <div v-else class="empty-tip">当前没有到期复习题，可先去刷题增加训练样本。</div>
      </article>

      <article class="focus-card">
        <div class="focus-head">
          <h2>最近复习记录</h2>
          <router-link to="/dashboard">学习看板</router-link>
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

        <div v-else class="empty-tip">还没有复习记录，先从“刷题模式”开始。</div>
      </article>
    </section>

    <section class="category-section">
      <div class="section-head">
        <h2>分类题库</h2>
        <p>按岗位知识域快速进入专题。</p>
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
      <p>快捷键：Ctrl/Cmd + K 打开搜索，1/2/3 在刷题页标记掌握度。</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { searchItems } from '@/data/search-index'
import type { MasteryLevel } from '@/stores/learning'
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
  unknown: '不会',
  vague: '模糊',
  mastered: '会讲',
}

const categoryLabelMap: Record<SearchCategory, string> = {
  frontend: '前端',
  backend: '后端',
  database: '数据库',
  algorithm: '算法',
  'system-design': '系统设计',
  devops: 'DevOps',
  network: '网络',
  os: '操作系统',
  ai: 'AI',
}

const duePreview = computed<SearchItem[]>(() => {
  return learningStore.reviewQueueIds.slice(0, 5).reduce<SearchItem[]>((acc, id) => {
    const item = itemMap.get(id)
    if (item) {
      acc.push(item)
    }
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

const formatTime = (value: string) => {
  const date = new Date(value)
  return date.toLocaleString()
}

const baseActionItems = computed<QuickAction[]>(() => {
  const list: QuickAction[] = [
    { key: 'search', to: '/search', icon: '🔎', title: '全局搜索', desc: '关键词、分类、标签快速定位题目' },
    { key: 'practice', to: '/practice', icon: '📝', title: '刷题模式', desc: '先思考后看答案，完成掌握度标记' },
    { key: 'review', to: '/review', icon: '📌', title: '复习队列', desc: '按 1/3/7 天规则自动复习' },
    { key: 'dashboard', to: '/dashboard', icon: '📊', title: '学习看板', desc: '查看掌握率、今日进度和连续学习' },
  ]

  if (learningStore.weakQuestionCount > 0) {
    list.unshift({
      key: 'weak-practice',
      to: { path: '/practice', query: { mode: 'weak' } },
      icon: '🎯',
      title: '薄弱专项',
      desc: `待强化 ${learningStore.weakQuestionCount} 题`,
    })
  }

  return list
})

const actionItems = computed<QuickAction[]>(() => {
  if (!practiceSessionUpdatedAt.value) {
    return baseActionItems.value
  }

  return [
    {
      key: 'resume-practice',
      to: { path: '/practice', query: { resume: '1' } },
      icon: '⏯️',
      title: '继续上次训练',
      desc: `上次训练：${formatTime(practiceSessionUpdatedAt.value)}`,
    },
    ...baseActionItems.value,
  ]
})

const navItems = [
  { path: '/frontend', icon: '📚', title: '前端开发', desc: 'HTML/CSS/JavaScript、React、Vue、Webpack' },
  { path: '/backend', icon: '☕', title: '后端开发', desc: 'Java、Python、Go、Node.js、微服务' },
  { path: '/database', icon: '🗄️', title: '数据库', desc: 'MySQL、Redis、MongoDB' },
  { path: '/algorithm', icon: '🧮', title: '算法', desc: '数据结构、算法思想、LeetCode' },
  { path: '/system-design', icon: '🏗️', title: '系统设计', desc: '高并发、分布式、微服务架构' },
  { path: '/devops', icon: '🚀', title: 'DevOps', desc: 'Docker、Kubernetes、CI/CD' },
  { path: '/network', icon: '🌐', title: '计算机网络', desc: 'TCP/IP、HTTP/HTTPS、Socket 编程' },
  { path: '/os', icon: '💻', title: '操作系统', desc: '进程线程、内存管理、Linux' },
  { path: '/ai', icon: '🤖', title: '人工智能', desc: '机器学习、深度学习、大语言模型' },
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
  font-size: 1.45rem;
  line-height: 1;
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

.focus-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
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
  font-size: 2rem;
  margin-bottom: 8px;
  display: block;
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
  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

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

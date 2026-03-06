<template>
  <div class="review-page">
    <header class="header">
      <router-link to="/" class="back-link">返回首页</router-link>
      <h1>复习队列</h1>
      <p>根据 1/3/7 天规则自动生成待复习题目。</p>
    </header>

    <section class="summary">
      <div class="card">
        <div class="label">今日待复习</div>
        <div class="value">{{ dueItems.length }}</div>
      </div>
      <div class="card">
        <div class="label">今日已复习</div>
        <div class="value">{{ learningStore.reviewedTodayCount }}</div>
      </div>
      <div class="card action">
        <button type="button" class="start-btn" :disabled="!dueItems.length" @click="startReviewPractice">
          开始复习模式
        </button>
      </div>
    </section>

    <section v-if="dueItems.length" class="list">
      <article v-for="item in dueItems" :key="item.id" class="item-card">
        <div class="meta">
          <span>{{ categoryLabelMap[item.category] }}</span>
          <span>/</span>
          <span>{{ item.sectionTitle }}</span>
        </div>

        <h2>{{ item.question }}</h2>

        <p class="due-time">到期时间：{{ formatDueTime(item.id) }}</p>

        <div class="btn-row">
          <button type="button" class="btn ghost" @click="goToSource(item.path, item.anchor)">查看原题</button>
          <button type="button" class="btn unknown" @click="quickMark(item.id, 'unknown')">不会</button>
          <button type="button" class="btn vague" @click="quickMark(item.id, 'vague')">模糊</button>
          <button type="button" class="btn mastered" @click="quickMark(item.id, 'mastered')">会讲</button>
        </div>
      </article>
    </section>

    <section v-else class="empty">
      <p>当前没有到期复习题，继续保持。</p>
      <router-link class="go-practice" to="/practice">去刷题</router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { searchItems } from '@/data/search-index'
import type { SearchCategory, SearchItem } from '@/types/search'
import type { MasteryLevel } from '@/stores/learning'
import { useLearningStore } from '@/stores/learning'

const router = useRouter()
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

const itemMap = new Map(searchItems.map((item) => [item.id, item]))

const dueItems = computed<SearchItem[]>(() => {
  return learningStore.reviewQueueIds
    .map((id) => itemMap.get(id))
    .filter((item): item is SearchItem => Boolean(item))
})

const formatDueTime = (questionId: string) => {
  const record = learningStore.getRecord(questionId)
  if (!record) return '-'

  return new Date(record.nextReviewAt).toLocaleString()
}

const quickMark = (questionId: string, mastery: MasteryLevel) => {
  learningStore.markMastery(questionId, mastery)
}

const goToSource = (path: string, anchor: string) => {
  void router.push({ path, hash: `#${anchor}` })
}

const startReviewPractice = () => {
  void router.push({ path: '/practice', query: { mode: 'review' } })
}
</script>

<style scoped>
.review-page {
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

.summary {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.card {
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
  font-size: 1.8rem;
  font-weight: 700;
}

.card.action {
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-btn {
  width: 100%;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  cursor: pointer;
}

.list {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.item-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  padding: 14px;
}

.meta {
  color: var(--text-muted);
  font-size: 0.85rem;
  display: flex;
  gap: 8px;
}

.item-card h2 {
  margin-top: 8px;
  font-size: 1.05rem;
}

.due-time {
  margin-top: 6px;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.btn-row {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
}

.btn.unknown { border-color: #2563eb; color: #2563eb; }
.btn.vague { border-color: #d97706; color: #d97706; }
.btn.mastered { border-color: #059669; color: #059669; }

.empty {
  margin-top: 20px;
  color: var(--text-tertiary);
  text-align: center;
}

.go-practice {
  margin-top: 10px;
  display: inline-block;
  color: var(--primary-color);
}

@media (max-width: 760px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>

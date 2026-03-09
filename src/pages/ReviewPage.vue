<template>
  <div class="review-page">
    <header class="header">
      <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
      <h1>{{ t('review.title') }}</h1>
      <p>{{ t('review.desc') }}</p>
    </header>

    <section class="summary">
      <div class="card"><div class="label">{{ t('review.dueToday') }}</div><div class="value">{{ dueItems.length }}</div></div>
      <div class="card"><div class="label">{{ t('review.reviewedToday') }}</div><div class="value">{{ learningStore.reviewedTodayCount }}</div></div>
      <div class="card action"><button type="button" class="start-btn" :disabled="!dueItems.length" @click="startReviewPractice">{{ t('review.startReview') }}</button></div>
    </section>

    <section v-if="dueItems.length" class="list">
      <article v-for="item in dueItems" :key="item.id" class="item-card">
        <div class="meta"><span>{{ categoryLabel(item.category) }}</span><span>/</span><span>{{ item.sectionTitle }}</span></div>
        <h2>{{ item.question }}</h2>
        <p class="due-time">{{ t('review.dueTime', { time: formatDueTime(item.id) }) }}</p>
        <div class="btn-row">
          <button type="button" class="btn ghost" @click="goToSource(item.path, item.anchor)">{{ t('review.source') }}</button>
          <button type="button" class="btn unknown" @click="quickMark(item.id, 'unknown')">{{ t('common.mastery.unknown') }}</button>
          <button type="button" class="btn vague" @click="quickMark(item.id, 'vague')">{{ t('common.mastery.vague') }}</button>
          <button type="button" class="btn mastered" @click="quickMark(item.id, 'mastered')">{{ t('common.mastery.mastered') }}</button>
        </div>
      </article>
    </section>

    <section v-else class="empty">
      <p>{{ t('review.empty') }}</p>
      <router-link class="go-practice" to="/practice">{{ t('review.goPractice') }}</router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import type { SearchCategory, SearchItem } from '@/types/search'
import type { MasteryLevel } from '@/stores/learning'
import { useLearningStore } from '@/stores/learning'

const router = useRouter()
const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t
const itemMap = new Map(searchItems.map((item) => [item.id, item]))
const categoryLabel = (category: SearchCategory) => t(`common.categories.${category}`)
const dueItems = computed<SearchItem[]>(() => learningStore.reviewQueueIds.map((id) => itemMap.get(id)).filter((item): item is SearchItem => Boolean(item)))
const formatDueTime = (questionId: string) => { const record = learningStore.getRecord(questionId); return record ? new Date(record.nextReviewAt).toLocaleString(i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US') : '-' }
const quickMark = (questionId: string, mastery: MasteryLevel) => learningStore.markMastery(questionId, mastery)
const goToSource = (path: string, anchor: string) => { void router.push({ path, hash: `#${anchor}` }) }
const startReviewPractice = () => { void router.push({ path: '/practice', query: { mode: 'review' } }) }
</script>

<style scoped>
.review-page { max-width: 980px; margin: 0 auto; padding: 36px 20px 56px; }
.back-link { color: var(--text-tertiary); text-decoration: none; }
.header h1 { margin-top: 10px; font-size: 2.1rem; }
.header p { color: var(--text-tertiary); }
.summary { margin-top: 16px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.card { border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--card-bg); padding: 14px; }
.label { color: var(--text-muted); font-size: 0.875rem; }
.value { margin-top: 8px; font-size: 1.8rem; font-weight: 700; }
.card.action { display: flex; align-items: center; justify-content: center; }
.start-btn { width: 100%; height: 40px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--card-bg); cursor: pointer; }
.list { margin-top: 14px; display: grid; gap: 10px; }
.item-card { border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--card-bg); padding: 14px; }
.meta { color: var(--text-muted); font-size: 0.85rem; display: flex; gap: 8px; }
.item-card h2 { margin-top: 8px; font-size: 1.05rem; }
.due-time { margin-top: 6px; color: var(--text-tertiary); font-size: 0.875rem; }
.btn-row { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
.btn { height: 34px; padding: 0 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: transparent; cursor: pointer; }
.btn.unknown { border-color: #2563eb; color: #2563eb; } .btn.vague { border-color: #d97706; color: #d97706; } .btn.mastered { border-color: #059669; color: #059669; }
.empty { margin-top: 20px; color: var(--text-tertiary); text-align: center; }
.go-practice { margin-top: 10px; display: inline-block; color: var(--primary-color); }
@media (max-width: 760px) { .summary { grid-template-columns: 1fr; } }
</style>

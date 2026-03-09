<template>
  <div class="practice-page">
    <header class="practice-header">
      <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
      <h1>{{ t('practice.title') }}</h1>
      <p>{{ t('practice.desc') }}</p>
    </header>

    <section class="toolbar">
      <label>
        {{ t('practice.keyword') }}
        <input v-model.trim="keyword" type="search" :placeholder="t('practice.keywordPlaceholder')" />
      </label>
      <label>
        {{ t('practice.category') }}
        <select v-model="selectedCategory">
          <option value="all">{{ t('practice.all') }}</option>
          <option v-for="option in categoryOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>
      <label>
        {{ t('practice.tag') }}
        <select v-model="selectedTag">
          <option value="all">{{ t('practice.all') }}</option>
          <option value="must">{{ t('common.tags.must') }}</option>
          <option value="frequent">{{ t('common.tags.frequent') }}</option>
          <option value="important">{{ t('common.tags.important') }}</option>
        </select>
      </label>
      <label>
        {{ t('practice.mode') }}
        <select v-model="mode">
          <option value="all">{{ t('practice.allQuestions') }}</option>
          <option value="review">{{ t('practice.reviewOnly') }}</option>
          <option value="weak">{{ t('practice.weakOnly') }}</option>
        </select>
      </label>
    </section>

    <p v-if="mode === 'weak'" class="mode-tip">{{ t('practice.weakTip') }}</p>

    <section v-if="items.length" class="progress-panel">
      <div>{{ t('practice.currentQuestion', { current: currentIndex + 1, total: items.length }) }}</div>
      <div class="progress-track"><div class="progress-fill" :style="{ width: `${((currentIndex + 1) / items.length) * 100}%` }"></div></div>
    </section>

    <section v-if="currentItem" class="card">
      <div class="meta"><span>{{ categoryLabel(currentItem.category) }}</span><span>/</span><span>{{ currentItem.sectionTitle }}</span></div>
      <h2>{{ currentItem.question }}</h2>
      <div class="tag-row">
        <span v-for="tag in currentItem.tags" :key="`${currentItem.id}-${tag}`" :class="['tag', tag]">{{ tagLabel(tag) }}</span>
        <span v-if="record" class="tag status">{{ t('practice.currentStatus', { status: masteryLabel(record.mastery) }) }}</span>
      </div>
      <div class="actions">
        <button class="btn" type="button" @click="showAnswer = !showAnswer">{{ showAnswer ? t('practice.hideAnswer') : t('practice.showAnswer') }}</button>
        <button class="btn ghost" type="button" @click="goToSource">{{ t('practice.source') }}</button>
      </div>
      <div v-if="showAnswer" class="answer"><pre>{{ currentItem.answer }}</pre></div>
      <div class="mark-row">
        <button class="mark unknown" type="button" @click="markAndNext('unknown')">{{ t('practice.markUnknownBtn') }}</button>
        <button class="mark vague" type="button" @click="markAndNext('vague')">{{ t('practice.markVagueBtn') }}</button>
        <button class="mark mastered" type="button" @click="markAndNext('mastered')">{{ t('practice.markMasteredBtn') }}</button>
      </div>
      <div class="nav-row">
        <button class="btn ghost" type="button" :disabled="currentIndex === 0" @click="prev">{{ t('practice.prev') }}</button>
        <button class="btn ghost" type="button" :disabled="currentIndex >= items.length - 1" @click="next">{{ t('practice.next') }}</button>
      </div>
    </section>

    <section v-else class="empty"><p>{{ t('practice.empty') }}</p></section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import { useLearningStore } from '@/stores/learning'
import type { MasteryLevel } from '@/stores/learning'
import type { SearchCategory, SearchItem, SearchTag } from '@/types/search'
import { loadPracticeSession, savePracticeSession } from '@/utils/practiceSession'

const route = useRoute()
const router = useRouter()
const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t
const MAX_REVISITS_PER_ITEM = 2
const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCategory = ref<'all' | SearchCategory>(typeof route.query.category === 'string' ? (route.query.category as 'all' | SearchCategory) : 'all')
const selectedTag = ref<'all' | SearchTag>(typeof route.query.tag === 'string' ? (route.query.tag as 'all' | SearchTag) : 'all')
const mode = ref<'all' | 'review' | 'weak'>(typeof route.query.mode === 'string' ? (route.query.mode as 'all' | 'review' | 'weak') : 'all')
const currentIndex = ref(0)
const showAnswer = ref(false)
const isApplyingSession = ref(false)
const revisitQueue = ref<string[]>([])
const revisitCounts = ref<Record<string, number>>({})
const itemLookup = new Map(searchItems.map((item) => [item.id, item]))
const categoryOptions = computed(() => [
  { value: 'frontend' as const, label: t('common.categories.frontend') },
  { value: 'backend' as const, label: t('common.categories.backend') },
  { value: 'database' as const, label: t('common.categories.database') },
  { value: 'algorithm' as const, label: t('common.categories.algorithm') },
  { value: 'system-design' as const, label: t('common.categories.system-design') },
  { value: 'devops' as const, label: t('common.categories.devops') },
  { value: 'network' as const, label: t('common.categories.network') },
  { value: 'os' as const, label: t('common.categories.os') },
  { value: 'ai' as const, label: t('common.categories.ai') },
])
const categoryLabel = (category: SearchCategory) => t(`common.categories.${category}`)
const tagLabel = (tag: SearchTag) => t(`common.tags.${tag}`)
const masteryLabel = (mastery: MasteryLevel) => t(`common.mastery.${mastery}`)
const normalize = (value: string) => value.toLowerCase().trim()
const baseItems = computed(() => {
  const q = normalize(keyword.value)
  const tokens = q ? q.split(/\s+/).filter(Boolean) : []
  let list = searchItems
  if (selectedCategory.value !== 'all') list = list.filter((item) => item.category === selectedCategory.value)
  if (selectedTag.value !== 'all') list = list.filter((item) => item.tags.includes(selectedTag.value as SearchTag))
  if (mode.value === 'review') list = list.filter((item) => new Set(learningStore.reviewQueueIds).has(item.id))
  if (mode.value === 'weak') list = list.filter((item) => new Set(learningStore.weakQuestionIds).has(item.id))
  if (!tokens.length) return list
  return list.filter((item) => `${item.question} ${item.answer} ${item.sectionTitle} ${item.tags.join(' ')}`.toLowerCase().includes(tokens.join(' ')) || tokens.every((token) => `${item.question} ${item.answer} ${item.sectionTitle} ${item.tags.join(' ')}`.toLowerCase().includes(token)))
})
const items = computed(() => mode.value !== 'weak' ? baseItems.value : [...baseItems.value, ...revisitQueue.value.map((id) => itemLookup.get(id)).filter((item): item is SearchItem => Boolean(item))])
const currentItem = computed<SearchItem | null>(() => items.value[currentIndex.value] ?? null)
const record = computed(() => currentItem.value ? learningStore.getRecord(currentItem.value.id) : null)
const resetWeakRevisitState = () => { revisitQueue.value = []; revisitCounts.value = {} }
watch(items, (list) => { if (!list.length) currentIndex.value = 0; else if (currentIndex.value >= list.length) currentIndex.value = list.length - 1 })
watch([keyword, selectedCategory, selectedTag, mode], () => { currentIndex.value = 0; showAnswer.value = false; if (mode.value !== 'weak') resetWeakRevisitState(); void router.replace({ path: '/practice', query: { q: keyword.value || undefined, category: selectedCategory.value === 'all' ? undefined : selectedCategory.value, tag: selectedTag.value === 'all' ? undefined : selectedTag.value, mode: mode.value === 'all' ? undefined : mode.value } }) })
const persistSession = () => savePracticeSession({ keyword: keyword.value, category: selectedCategory.value, tag: selectedTag.value, mode: mode.value, currentItemId: currentItem.value?.id ?? null, updatedAt: new Date().toISOString() })
watch([keyword, selectedCategory, selectedTag, mode, currentIndex, items], () => { if (!isApplyingSession.value) persistSession() })
const next = () => { if (currentIndex.value < items.value.length - 1) { currentIndex.value += 1; showAnswer.value = false } }
const prev = () => { if (currentIndex.value > 0) { currentIndex.value -= 1; showAnswer.value = false } }
const enqueueRevisit = (questionId: string) => { const count = revisitCounts.value[questionId] ?? 0; if (count < MAX_REVISITS_PER_ITEM) { revisitQueue.value.push(questionId); revisitCounts.value[questionId] = count + 1 } }
const clearRevisit = (questionId: string) => { const nextCounts = { ...revisitCounts.value }; delete nextCounts[questionId]; revisitCounts.value = nextCounts; revisitQueue.value = revisitQueue.value.filter((id) => id !== questionId) }
const markAndNext = (mastery: MasteryLevel) => { if (!currentItem.value) return; const questionId = currentItem.value.id; learningStore.markMastery(questionId, mastery); if (mode.value === 'weak') mastery === 'mastered' ? clearRevisit(questionId) : enqueueRevisit(questionId); next() }
const goToSource = () => { if (currentItem.value) void router.push({ path: currentItem.value.path, hash: `#${currentItem.value.anchor}` }) }
const handleKeydown = (event: KeyboardEvent) => { if (!currentItem.value) return; if (event.key === ' ') { event.preventDefault(); showAnswer.value = !showAnswer.value; return } if (event.key === 'ArrowRight') return next(); if (event.key === 'ArrowLeft') return prev(); if (event.key === '1') markAndNext('unknown'); if (event.key === '2') markAndNext('vague'); if (event.key === '3') markAndNext('mastered') }
onMounted(() => { window.addEventListener('keydown', handleKeydown); if (route.query.resume !== '1') return; const session = loadPracticeSession(); if (!session) return; isApplyingSession.value = true; keyword.value = session.keyword; selectedCategory.value = session.category; selectedTag.value = session.tag; mode.value = session.mode; void nextTick(() => { currentIndex.value = session.currentItemId ? Math.max(0, items.value.findIndex((item) => item.id === session.currentItemId)) : 0; isApplyingSession.value = false; persistSession() }) })
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.practice-page { max-width: 980px; margin: 0 auto; padding: 36px 20px 60px; }
.back-link { color: var(--text-tertiary); text-decoration: none; }
.practice-header h1 { font-size: 2.2rem; margin-top: 10px; }
.practice-header p { color: var(--text-tertiary); }
.toolbar { margin-top: 18px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.toolbar label { display: flex; flex-direction: column; gap: 6px; font-size: 0.875rem; }
.toolbar input, .toolbar select { height: 40px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); padding: 0 10px; background: var(--card-bg); color: var(--text-primary); }
.mode-tip { margin-top: 12px; color: var(--text-tertiary); font-size: 0.875rem; }
.progress-panel { margin-top: 14px; }
.progress-track { margin-top: 8px; height: 8px; background: var(--bg-secondary); border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--primary-gradient); }
.card { margin-top: 16px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 20px; }
.meta { color: var(--text-muted); font-size: 0.875rem; display: flex; gap: 8px; }
.card h2 { margin-top: 10px; font-size: 1.3rem; }
.tag-row { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
.tag { color: #fff; border-radius: 999px; padding: 4px 10px; font-size: 0.75rem; }
.tag.must { background: #2563eb; } .tag.frequent { background: #059669; } .tag.important { background: #d97706; } .tag.status { background: #334155; }
.actions, .mark-row, .nav-row { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
.btn, .mark { height: 38px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); padding: 0 12px; cursor: pointer; }
.btn.ghost { background: transparent; }
.answer { margin-top: 14px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-secondary); padding: 12px; }
.answer pre { margin: 0; white-space: pre-wrap; line-height: 1.6; }
.mark.unknown { border-color: #2563eb; color: #2563eb; } .mark.vague { border-color: #d97706; color: #d97706; } .mark.mastered { border-color: #059669; color: #059669; }
.empty { margin-top: 24px; color: var(--text-tertiary); }
@media (max-width: 900px) { .toolbar { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .toolbar { grid-template-columns: 1fr; } }
</style>

<template>
  <div class="practice-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('practice.title') }}</h1>
        <p class="page-desc">{{ t('practice.desc') }}</p>
      </div>
      <div class="header-stats" v-if="items.length">
        <div class="stat-badge">
          <PhosphorIcon name="ClipboardText" class="stat-icon" />
          <span class="stat-text">{{ items.length }} 题</span>
        </div>
        <div class="stat-badge">
          <PhosphorIcon name="MapPin" class="stat-icon" />
          <span class="stat-text">第 {{ currentIndex + 1 }} 题</span>
        </div>
      </div>
    </header>

    <!-- 筛选工具栏 -->
    <section class="filter-panel">
      <div class="filter-grid">
        <div class="filter-item">
          <label class="filter-label">
            <PhosphorIcon name="MagnifyingGlass" class="label-icon" />
            {{ t('practice.keyword') }}
          </label>
          <div class="input-wrapper">
            <input
              v-model.trim="keyword"
              type="search"
              :placeholder="t('practice.keywordPlaceholder')"
              class="filter-input"
            />
            <span v-if="keyword" class="input-clear" @click="keyword = ''">×</span>
          </div>
        </div>

        <div class="filter-item">
          <label class="filter-label">
            <PhosphorIcon name="Folder" class="label-icon" />
            {{ t('practice.category') }}
          </label>
          <select v-model="selectedCategory" class="filter-select">
            <option value="all">{{ t('practice.all') }}</option>
            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label class="filter-label">
            <PhosphorIcon name="Tag" class="label-icon" />
            {{ t('practice.tag') }}
          </label>
          <select v-model="selectedTag" class="filter-select">
            <option value="all">{{ t('practice.all') }}</option>
            <option value="must">{{ t('common.tags.must') }}</option>
            <option value="frequent">{{ t('common.tags.frequent') }}</option>
            <option value="important">{{ t('common.tags.important') }}</option>
          </select>
        </div>

        <div class="filter-item">
          <label class="filter-label">
            <PhosphorIcon name="Target" class="label-icon" />
            {{ t('practice.mode') }}
          </label>
          <select v-model="mode" class="filter-select">
            <option value="all">{{ t('practice.allQuestions') }}</option>
            <option value="review">{{ t('practice.reviewOnly') }}</option>
            <option value="weak">{{ t('practice.weakOnly') }}</option>
          </select>
        </div>
      </div>

      <!-- 模式提示 -->
      <div v-if="mode === 'weak'" class="mode-alert">
        <PhosphorIcon name="Lightbulb" class="alert-icon" />
        <span class="alert-text">{{ t('practice.weakTip') }}</span>
      </div>
    </section>

    <!-- 进度条 -->
    <section v-if="items.length > 1" class="progress-section">
      <div class="progress-header">
        <span class="progress-text">学习进度</span>
        <span class="progress-fraction">{{ currentIndex + 1 }} / {{ items.length }}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${((currentIndex + 1) / items.length) * 100}%` }"></div>
      </div>
    </section>

    <!-- 题目卡片 -->
    <section v-if="currentItem" class="question-card">
      <!-- 题目头部 -->
      <div class="question-header">
        <div class="breadcrumb">
          <span class="breadcrumb-item category">{{ categoryLabel(currentItem.category) }}</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item section">{{ currentItem.sectionTitle }}</span>
        </div>
        <div class="question-tags">
          <span
            v-for="tag in currentItem.tags"
            :key="`${currentItem.id}-${tag}`"
            :class="['tag-badge', tag]"
          >
            {{ tagLabel(tag) }}
          </span>
          <span v-if="record" class="tag-badge status" :class="record.mastery">
            {{ masteryLabel(record.mastery) }}
          </span>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="question-body">
        <h2 class="question-title">{{ currentItem.question }}</h2>

        <!-- 答案区域 -->
        <div class="answer-section" :class="{ 'is-visible': showAnswer }">
          <div class="answer-toggle">
            <button
              type="button"
              class="toggle-btn"
              :class="{ 'is-active': showAnswer }"
              @click="showAnswer = !showAnswer"
            >
              <PhosphorIcon :name="showAnswer ? 'Eye' : 'EyeClosed'" class="toggle-icon" />
              <span class="toggle-text">{{ showAnswer ? t('practice.hideAnswer') : t('practice.showAnswer') }}</span>
              <span class="toggle-hint">(空格键)</span>
            </button>
            <button type="button" class="source-btn" @click="goToSource">
              <PhosphorIcon name="FileText" />
              {{ t('practice.source') }}
            </button>
          </div>

          <Transition name="slide">
            <div v-show="showAnswer" class="answer-content">
              <pre class="answer-text">{{ currentItem.answer }}</pre>
            </div>
          </Transition>
        </div>
      </div>

      <!-- 操作区域 -->
      <div class="question-footer">
        <!-- 掌握程度标记 -->
        <div class="mastery-actions">
          <span class="actions-label">标记掌握程度：</span>
          <div class="actions-buttons">
            <button
              type="button"
              class="mastery-btn unknown"
              :class="{ 'is-active': record?.mastery === 'unknown' }"
              @click="markAndNext('unknown')"
            >
              <PhosphorIcon name="Question" class="btn-icon" />
              <span class="btn-text">不会</span>
              <span class="btn-key">1</span>
            </button>
            <button
              type="button"
              class="mastery-btn vague"
              :class="{ 'is-active': record?.mastery === 'vague' }"
              @click="markAndNext('vague')"
            >
              <PhosphorIcon name="Confused" class="btn-icon" />
              <span class="btn-text">模糊</span>
              <span class="btn-key">2</span>
            </button>
            <button
              type="button"
              class="mastery-btn mastered"
              :class="{ 'is-active': record?.mastery === 'mastered' }"
              @click="markAndNext('mastered')"
            >
              <PhosphorIcon name="CheckCircle" class="btn-icon" />
              <span class="btn-text">掌握</span>
              <span class="btn-key">3</span>
            </button>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="nav-actions">
          <button
            type="button"
            class="nav-btn prev"
            :disabled="currentIndex === 0"
            @click="prev"
          >
            <PhosphorIcon name="ArrowLeft" class="nav-icon" />
            <span class="nav-text">上一题</span>
            <span class="nav-key">←</span>
          </button>

          <div class="nav-indicators">
            <button
              v-for="(_, idx) in items.slice(Math.max(0, currentIndex - 2), Math.min(items.length, currentIndex + 3))"
              :key="idx + Math.max(0, currentIndex - 2)"
              type="button"
              class="indicator-dot"
              :class="{
                active: idx + Math.max(0, currentIndex - 2) === currentIndex,
                answered: getMasteryForIndex(idx + Math.max(0, currentIndex - 2))
              }"
              @click="goToQuestion(idx + Math.max(0, currentIndex - 2))"
            ></button>
          </div>

          <button
            type="button"
            class="nav-btn next"
            :disabled="currentIndex >= items.length - 1"
            @click="next"
          >
            <span class="nav-text">下一题</span>
            <PhosphorIcon name="ArrowRight" class="nav-icon" />
            <span class="nav-key">→</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 空状态 -->
    <section v-else class="empty-state">
      <div class="empty-content">
        <PhosphorIcon name="MagnifyingGlass" class="empty-icon" />
        <h3 class="empty-title">没有找到符合条件的题目</h3>
        <p class="empty-desc">尝试调整筛选条件或清除关键词</p>
        <button type="button" class="reset-btn" @click="resetFilters">
          重置筛选条件
        </button>
      </div>
    </section>
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
import PhosphorIcon from '@/components/PhosphorIcon.vue'

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

  if (selectedCategory.value !== 'all') {
    list = list.filter((item) => item.category === selectedCategory.value)
  }
  if (selectedTag.value !== 'all') {
    list = list.filter((item) => item.tags.includes(selectedTag.value as SearchTag))
  }
  if (mode.value === 'review') {
    list = list.filter((item) => new Set(learningStore.reviewQueueIds).has(item.id))
  }
  if (mode.value === 'weak') {
    list = list.filter((item) => new Set(learningStore.weakQuestionIds).has(item.id))
  }

  if (!tokens.length) return list

  return list.filter((item) => {
    const content = `${item.question} ${item.answer} ${item.sectionTitle} ${item.tags.join(' ')}`.toLowerCase()
    return content.includes(tokens.join(' ')) || tokens.every((token) => content.includes(token))
  })
})

const items = computed(() => {
  if (mode.value !== 'weak') return baseItems.value
  return [
    ...baseItems.value,
    ...revisitQueue.value
      .map((id) => itemLookup.get(id))
      .filter((item): item is SearchItem => Boolean(item)),
  ]
})

const currentItem = computed<SearchItem | null>(() => items.value[currentIndex.value] ?? null)
const record = computed(() => (currentItem.value ? learningStore.getRecord(currentItem.value.id) : null))

const getMasteryForIndex = (index: number) => {
  const item = items.value[index]
  if (!item) return null
  const rec = learningStore.getRecord(item.id)
  return rec?.mastery || null
}

const resetWeakRevisitState = () => {
  revisitQueue.value = []
  revisitCounts.value = {}
}

watch(items, (list) => {
  if (!list.length) currentIndex.value = 0
  else if (currentIndex.value >= list.length) currentIndex.value = list.length - 1
})

watch([keyword, selectedCategory, selectedTag, mode], () => {
  currentIndex.value = 0
  showAnswer.value = false
  if (mode.value !== 'weak') resetWeakRevisitState()

  void router.replace({
    path: '/practice',
    query: {
      q: keyword.value || undefined,
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      tag: selectedTag.value === 'all' ? undefined : selectedTag.value,
      mode: mode.value === 'all' ? undefined : mode.value,
    },
  })
})

const persistSession = () => {
  savePracticeSession({
    keyword: keyword.value,
    category: selectedCategory.value,
    tag: selectedTag.value,
    mode: mode.value,
    currentItemId: currentItem.value?.id ?? null,
    updatedAt: new Date().toISOString(),
  })
}

watch([keyword, selectedCategory, selectedTag, mode, currentIndex, items], () => {
  if (!isApplyingSession.value) persistSession()
})

const next = () => {
  if (currentIndex.value < items.value.length - 1) {
    currentIndex.value += 1
    showAnswer.value = false
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    showAnswer.value = false
  }
}

const goToQuestion = (index: number) => {
  if (index >= 0 && index < items.value.length) {
    currentIndex.value = index
    showAnswer.value = false
  }
}

const enqueueRevisit = (questionId: string) => {
  const count = revisitCounts.value[questionId] ?? 0
  if (count < MAX_REVISITS_PER_ITEM) {
    revisitQueue.value.push(questionId)
    revisitCounts.value[questionId] = count + 1
  }
}

const clearRevisit = (questionId: string) => {
  const nextCounts = { ...revisitCounts.value }
  delete nextCounts[questionId]
  revisitCounts.value = nextCounts
  revisitQueue.value = revisitQueue.value.filter((id) => id !== questionId)
}

const markAndNext = (mastery: MasteryLevel) => {
  if (!currentItem.value) return
  const questionId = currentItem.value.id
  learningStore.markMastery(questionId, mastery)

  if (mode.value === 'weak') {
    if (mastery === 'mastered') {
      clearRevisit(questionId)
    } else {
      enqueueRevisit(questionId)
    }
  }

  next()
}

const goToSource = () => {
  if (currentItem.value) {
    void router.push({ path: currentItem.value.path, hash: `#${currentItem.value.anchor}` })
  }
}

const resetFilters = () => {
  keyword.value = ''
  selectedCategory.value = 'all'
  selectedTag.value = 'all'
  mode.value = 'all'
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!currentItem.value) return

  if (event.key === ' ') {
    event.preventDefault()
    showAnswer.value = !showAnswer.value
    return
  }

  if (event.key === 'ArrowRight') {
    next()
    return
  }
  if (event.key === 'ArrowLeft') {
    prev()
    return
  }
  if (event.key === '1') {
    markAndNext('unknown')
    return
  }
  if (event.key === '2') {
    markAndNext('vague')
    return
  }
  if (event.key === '3') {
    markAndNext('mastered')
    return
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  if (route.query.resume !== '1') return

  const session = loadPracticeSession()
  if (!session) return

  isApplyingSession.value = true
  keyword.value = session.keyword
  selectedCategory.value = session.category
  selectedTag.value = session.tag
  mode.value = session.mode

  void nextTick(() => {
    currentIndex.value = session.currentItemId
      ? Math.max(0, items.value.findIndex((item) => item.id === session.currentItemId))
      : 0
    isApplyingSession.value = false
    persistSession()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.practice-page {
  max-width: 900px;
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

.header-stats {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-icon {
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.stat-text {
  font-weight: 500;
}

/* 筛选面板 */
.filter-panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.label-icon {
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.input-wrapper {
  position: relative;
}

.filter-input,
.filter-select {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--card-bg);
}

.filter-input {
  padding-right: 32px;
}

.input-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--text-muted);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.input-clear:hover {
  background: var(--error-color);
}

/* 模式提示 */
.mode-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.04) 100%);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: var(--radius-md);
  color: #92400e;
  font-size: 0.875rem;
}

.alert-icon {
  font-size: 1.125rem;
  display: flex;
  align-items: center;
}

/* 进度区域 */
.progress-section {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.progress-fraction {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.progress-track {
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

/* 题目卡片 */
.question-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.breadcrumb-item {
  font-weight: 500;
}

.breadcrumb-item.category {
  color: var(--primary-color);
}

.breadcrumb-item.section {
  color: var(--text-secondary);
}

.breadcrumb-separator {
  color: var(--text-muted);
}

.question-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tag-badge.must {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.tag-badge.frequent {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
}

.tag-badge.important {
  background: rgba(217, 119, 6, 0.1);
  color: #d97706;
}

.tag-badge.status {
  background: rgba(51, 65, 85, 0.1);
  color: #334155;
}

.tag-badge.status.unknown {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.tag-badge.status.vague {
  background: rgba(217, 119, 6, 0.1);
  color: #d97706;
}

.tag-badge.status.mastered {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
}

/* 题目内容 */
.question-body {
  padding: 24px 20px;
}

.question-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 20px;
}

/* 答案区域 */
.answer-section {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.answer-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toggle-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.toggle-btn.is-active {
  background: var(--primary-gradient);
  border-color: transparent;
  color: white;
}

.toggle-icon {
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.toggle-hint {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-left: 4px;
}

.source-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.source-btn:hover {
  background: var(--card-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.answer-content {
  padding: 20px;
  background: var(--bg-secondary);
}

.answer-text {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.8;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.9375rem;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all var(--transition-base);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 题目底部 */
.question-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.mastery-actions {
  margin-bottom: 20px;
}

.actions-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.actions-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mastery-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mastery-btn:hover {
  transform: translateY(-2px);
}

.mastery-btn.unknown {
  color: #2563eb;
  border-color: rgba(37, 99, 235, 0.3);
}

.mastery-btn.unknown:hover,
.mastery-btn.unknown.is-active {
  background: rgba(37, 99, 235, 0.1);
  border-color: #2563eb;
}

.mastery-btn.vague {
  color: #d97706;
  border-color: rgba(217, 119, 6, 0.3);
}

.mastery-btn.vague:hover,
.mastery-btn.vague.is-active {
  background: rgba(217, 119, 6, 0.1);
  border-color: #d97706;
}

.mastery-btn.mastered {
  color: #059669;
  border-color: rgba(5, 150, 105, 0.3);
}

.mastery-btn.mastered:hover,
.mastery-btn.mastered.is-active {
  background: rgba(5, 150, 105, 0.1);
  border-color: #059669;
}

.btn-icon {
  font-size: 1.125rem;
  display: flex;
  align-items: center;
}

.btn-key {
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xs);
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.7;
}

/* 导航操作 */
.nav-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn.next {
  background: var(--primary-gradient);
  border-color: transparent;
  color: white;
}

.nav-btn.next:hover:not(:disabled) {
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.nav-key {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xs);
  font-size: 0.75rem;
  font-weight: 600;
}

.nav-indicators {
  display: flex;
  gap: 8px;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-color);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.indicator-dot:hover {
  background: var(--text-muted);
}

.indicator-dot.active {
  background: var(--primary-color);
  transform: scale(1.2);
}

.indicator-dot.answered {
  background: var(--success-color);
}

/* 空状态 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

.empty-content {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  margin-bottom: 20px;
}

.reset-btn {
  padding: 10px 20px;
  background: var(--primary-color);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reset-btn:hover {
  background: var(--primary-dark);
}

/* 响应式 */
@media (max-width: 900px) {
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header {
    flex-direction: column;
    gap: 12px;
  }

  .header-stats {
    width: 100%;
  }

  .stat-badge {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .practice-page {
    padding: 16px 16px 40px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filter-panel {
    padding: 16px;
  }

  .question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .question-title {
    font-size: 1.1rem;
  }

  .answer-toggle {
    flex-direction: column;
    gap: 10px;
  }

  .toggle-btn,
  .source-btn {
    width: 100%;
    justify-content: center;
  }

  .actions-buttons {
    grid-template-columns: 1fr;
  }

  .mastery-btn {
    padding: 14px;
  }

  .nav-actions {
    flex-wrap: wrap;
  }

  .nav-indicators {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 12px;
  }

  .nav-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>

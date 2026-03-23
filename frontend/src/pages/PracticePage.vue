<template>
  <div class="practice-page">
    <!-- 页面头部 -->
    <div class="sticky-header">
      <a-page-header
        :title="t('practice.title')"
        :sub-title="t('practice.desc')"
        @back="() => $router.push('/dashboard')"
      >
        <template #extra>
          <a-space v-if="items.length">
            <a-tag color="blue">
              <FileTextOutlined /> {{ items.length }} 题
            </a-tag>
            <a-tag color="green">
              <EnvironmentOutlined /> 第 {{ currentIndex + 1 }} 题
            </a-tag>
          </a-space>
        </template>
      </a-page-header>
    </div>

    <!-- 筛选工具栏 -->
    <a-card class="filter-card" :bordered="false">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="filter-item">
            <label class="filter-label">
              <SearchOutlined /> {{ t('practice.keyword') }}
            </label>
            <a-input-search
              v-model:value="keyword"
              :placeholder="t('practice.keywordPlaceholder')"
              allow-clear
              @search="() => {}"
            />
          </div>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <div class="filter-item">
            <label class="filter-label">
              <FolderOutlined /> {{ t('practice.category') }}
            </label>
            <a-select
              v-model:value="selectedCategory"
              style="width: 100%"
              :placeholder="t('practice.all')"
            >
              <a-select-option value="all">{{ t('practice.all') }}</a-select-option>
              <a-select-option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </div>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <div class="filter-item">
            <label class="filter-label">
              <TagOutlined /> {{ t('practice.tag') }}
            </label>
            <a-select v-model:value="selectedTag" style="width: 100%">
              <a-select-option value="all">{{ t('practice.all') }}</a-select-option>
              <a-select-option value="must">{{ t('common.tags.must') }}</a-select-option>
              <a-select-option value="frequent">{{ t('common.tags.frequent') }}</a-select-option>
              <a-select-option value="important">{{ t('common.tags.important') }}</a-select-option>
            </a-select>
          </div>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <div class="filter-item">
            <label class="filter-label">
              <AimOutlined /> {{ t('practice.mode') }}
            </label>
            <a-select v-model:value="mode" style="width: 100%">
              <a-select-option value="all">{{ t('practice.allQuestions') }}</a-select-option>
              <a-select-option value="review">{{ t('practice.reviewOnly') }}</a-select-option>
              <a-select-option value="weak">{{ t('practice.weakOnly') }}</a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row>

      <!-- 模式提示 -->
      <a-alert
        v-if="mode === 'weak'"
        class="mode-alert"
        type="warning"
        show-icon
        :message="t('practice.weakTip')"
      />
    </a-card>

    <!-- 进度条 -->
    <div v-if="items.length > 1" class="progress-section">
      <div class="progress-header">
        <span class="progress-text">学习进度</span>
        <span class="progress-fraction">{{ currentIndex + 1 }} / {{ items.length }}</span>
      </div>
      <a-progress
        :percent="Math.round(((currentIndex + 1) / items.length) * 100)"
        :show-info="false"
        status="active"
      />
    </div>

    <!-- 题目卡片 -->
    <a-card v-if="currentItem" class="question-card" :bordered="false">
      <!-- 题目头部 -->
      <div class="question-header">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a-tag color="blue">{{ categoryLabel(currentItem.category) }}</a-tag>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ currentItem.sectionTitle }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="question-tags">
          <a-tag
            v-for="tag in currentItem.tags"
            :key="`${currentItem.id}-${tag}`"
            :color="tagColor(tag)"
          >
            {{ tagLabel(tag) }}
          </a-tag>
          <a-tag v-if="record" :color="masteryColor(record.mastery)">
            {{ masteryLabel(record.mastery) }}
          </a-tag>
        </div>
      </div>

      <a-divider />

      <!-- 题目内容 -->
      <div class="question-body">
        <h2 class="question-title">{{ currentItem.question }}</h2>

        <!-- 答案区域 -->
        <div class="answer-section">
          <div class="answer-toggle">
            <a-button
              type="primary"
              :ghost="!showAnswer"
              @click="showAnswer = !showAnswer"
            >
              <template #icon>
                <EyeOutlined v-if="!showAnswer" />
                <EyeInvisibleOutlined v-else />
              </template>
              {{ showAnswer ? t('practice.hideAnswer') : t('practice.showAnswer') }}
              <span class="keyboard-hint">(空格键)</span>
            </a-button>
            <a-button @click="goToSource">
              <template #icon><FileTextOutlined /></template>
              {{ t('practice.source') }}
            </a-button>
          </div>

          <a-collapse v-model:activeKey="answerKey" :bordered="false">
            <a-collapse-panel v-if="showAnswer" key="1" :show-arrow="false">
              <div class="answer-markdown markdown-body" v-html="formattedAnswer"></div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>

      <div class="note-section" style="margin-top: 24px;">
        <NoteEditor :question-id="currentItem.id" />
      </div>

      <a-divider />

      <!-- 操作区域 -->
      <div class="question-footer">
        <!-- 掌握程度标记 -->
        <div class="mastery-actions">
          <span class="actions-label">标记掌握程度：</span>
          <a-space :size="12">
            <a-button
              size="large"
              :type="record?.mastery === 'unknown' ? 'primary' : 'default'"
              :class="{ 'active-btn': record?.mastery === 'unknown' }"
              @click="markAndNext('unknown')"
            >
              <template #icon><QuestionCircleOutlined /></template>
              不会
              <span class="keyboard-hint">[1]</span>
            </a-button>
            <a-button
              size="large"
              :type="record?.mastery === 'vague' ? 'primary' : 'default'"
              :class="{ 'active-btn': record?.mastery === 'vague' }"
              @click="markAndNext('vague')"
            >
              <template #icon><ExclamationCircleOutlined /></template>
              模糊
              <span class="keyboard-hint">[2]</span>
            </a-button>
            <a-button
              size="large"
              type="success"
              :ghost="record?.mastery !== 'mastered'"
              :class="{ 'active-btn': record?.mastery === 'mastered' }"
              @click="markAndNext('mastered')"
            >
              <template #icon><CheckCircleOutlined /></template>
              掌握
              <span class="keyboard-hint">[3]</span>
            </a-button>
          </a-space>
        </div>

        <!-- 导航按钮 -->
        <div class="nav-actions">
          <a-button
            size="large"
            :disabled="currentIndex === 0"
            @click="prev"
          >
            <template #icon><LeftOutlined /></template>
            上一题
            <span class="keyboard-hint">[←]</span>
          </a-button>

          <div class="nav-indicators">
            <a-tooltip
              v-for="(_, idx) in items.slice(Math.max(0, currentIndex - 2), Math.min(items.length, currentIndex + 3))"
              :key="idx + Math.max(0, currentIndex - 2)"
              :title="`第 ${idx + Math.max(0, currentIndex - 2) + 1} 题`"
            >
              <a-button
                type="text"
                shape="circle"
                size="small"
                :class="{
                  'indicator-active': idx + Math.max(0, currentIndex - 2) === currentIndex,
                  'indicator-answered': getMasteryForIndex(idx + Math.max(0, currentIndex - 2))
                }"
                @click="goToQuestion(idx + Math.max(0, currentIndex - 2))"
              >
                {{ idx + Math.max(0, currentIndex - 2) + 1 }}
              </a-button>
            </a-tooltip>
          </div>

          <a-button
            size="large"
            type="primary"
            :disabled="currentIndex >= items.length - 1"
            @click="next"
          >
            下一题
            <template #icon><RightOutlined /></template>
            <span class="keyboard-hint">[→]</span>
          </a-button>
        </div>
      </div>
    </a-card>

    <!-- 空状态 -->
    <a-card v-else class="empty-card" :bordered="false">
      <a-empty
        image="simple"
        description="没有找到符合条件的题目"
      >
        <template #extra>
          <p class="empty-desc">尝试调整筛选条件或清除关键词</p>
          <a-button type="primary" @click="resetFilters">
            重置筛选条件
          </a-button>
        </template>
      </a-empty>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { marked } from 'marked'
import { useRoute, useRouter } from 'vue-router'
import {
  FileTextOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  FolderOutlined,
  TagOutlined,
  AimOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons-vue'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import { useLearningStore } from '@/stores/learning'
import { useAuthStore } from '@/stores/auth'
import type { MasteryLevel } from '@/stores/learning'
import type { SearchCategory, SearchItem, SearchTag } from '@/types/search'
import { loadPracticeSession, savePracticeSession } from '@/utils/practiceSession'
import NoteEditor from '@/components/NoteEditor.vue'

const route = useRoute()
const router = useRouter()
const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const authStore = useAuthStore()
const t = i18nStore.t

const formattedAnswer = computed(() => {
  if (!currentItem.value?.answer) return ''
  return marked.parse(currentItem.value.answer, {
    breaks: true,
    gfm: true
  })
})

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
const answerKey = ref<string[]>([])

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

const tagColor = (tag: SearchTag) => {
  const colors: Record<string, string> = {
    must: 'red',
    frequent: 'green',
    important: 'orange',
  }
  return colors[tag] || 'default'
}

const masteryColor = (mastery: MasteryLevel) => {
  const colors: Record<string, string> = {
    unknown: 'blue',
    vague: 'orange',
    mastered: 'success',
  }
  return colors[mastery] || 'default'
}

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
  answerKey.value = []
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

watch(showAnswer, (val) => {
  answerKey.value = val ? ['1'] : []
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
  padding: 0 20px 40px;
}

.filter-card {
  margin-bottom: 20px;
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
  color: #666;
}

.mode-alert {
  margin-top: 16px;
}

.progress-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
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
  color: #666;
}

.progress-fraction {
  font-size: 0.875rem;
  color: #999;
}

.question-card {
  margin-bottom: 20px;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.question-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.question-body {
  padding: 20px 0;
}

.question-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
}

.answer-markdown {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
}

:deep(.markdown-body) {
  font-family: inherit;
}

:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
  color: var(--primary-700);
  border-bottom: none;
}

:deep(.markdown-body code) {
  background-color: rgba(99, 102, 241, 0.08);
  color: var(--primary-600);
  padding: 0.1em 0.3em;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.85em;
  word-break: break-word;
}

:deep(.markdown-body pre) {
  background-color: #1e293b; /* 深色极客风背景 */
  color: #e2e8f0;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #334155;
  margin: 20px 0;
  overflow-x: auto;
  line-height: 1.45;
}

:deep(.markdown-body pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'Lucida Console', Monaco, monospace;
  font-size: 0.9rem;
  white-space: pre; /* 关键：保留 ASCII 画图的空格对齐 */
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

:deep(.markdown-body li) {
  margin-bottom: 0.5em;
}

:deep(.markdown-body strong) {
  color: var(--primary-600);
}

.answer-section {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.answer-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  flex-wrap: wrap;
  gap: 10px;
}

.keyboard-hint {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-left: 4px;
}

.answer-text {
  margin: 0;
  padding: 20px;
  white-space: pre-wrap;
  line-height: 1.8;
  color: #666;
  font-family: inherit;
  font-size: 0.9375rem;
  background: #fafafa;
}

.question-footer {
  padding-top: 20px;
}

.mastery-actions {
  margin-bottom: 20px;
}

.actions-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 12px;
}

.active-btn {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.nav-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.nav-indicators {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.indicator-active {
  background: #1890ff;
  color: white;
}

.indicator-answered {
  background: #52c41a;
  color: white;
}

.empty-card {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-desc {
  color: #999;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .practice-page {
    padding: 0 16px 40px;
  }

  .question-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .answer-toggle {
    flex-direction: column;
  }

  .nav-actions {
    flex-direction: column;
  }

  .nav-indicators {
    order: -1;
  }
}
</style>

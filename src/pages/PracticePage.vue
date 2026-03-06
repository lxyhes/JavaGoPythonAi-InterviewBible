<template>
  <div class="practice-page">
    <header class="practice-header">
      <router-link to="/" class="back-link">返回首页</router-link>
      <h1>刷题模式</h1>
      <p>先思考再看答案，标记你的掌握程度。</p>
    </header>

    <section class="toolbar">
      <label>
        关键词
        <input v-model.trim="keyword" type="search" placeholder="例如：线程池 / Redis" />
      </label>
      <label>
        分类
        <select v-model="selectedCategory">
          <option value="all">全部</option>
          <option v-for="option in categoryOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>
      <label>
        标签
        <select v-model="selectedTag">
          <option value="all">全部</option>
          <option value="must">必问</option>
          <option value="frequent">高频</option>
          <option value="important">重要</option>
        </select>
      </label>
      <label>
        模式
        <select v-model="mode">
          <option value="all">全部题目</option>
          <option value="review">待复习</option>
          <option value="weak">薄弱题</option>
        </select>
      </label>
    </section>

    <section v-if="items.length" class="progress-panel">
      <div>
        第 <strong>{{ currentIndex + 1 }}</strong> / {{ items.length }} 题
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${((currentIndex + 1) / items.length) * 100}%` }"></div>
      </div>
    </section>

    <section v-if="currentItem" class="card">
      <div class="meta">
        <span>{{ categoryLabelMap[currentItem.category] }}</span>
        <span>/</span>
        <span>{{ currentItem.sectionTitle }}</span>
      </div>

      <h2>{{ currentItem.question }}</h2>

      <div class="tag-row">
        <span v-for="tag in currentItem.tags" :key="`${currentItem.id}-${tag}`" :class="['tag', tag]">{{ tagLabelMap[tag] }}</span>
        <span v-if="record" class="tag status">当前状态：{{ masteryLabelMap[record.mastery] }}</span>
      </div>

      <div class="actions">
        <button class="btn" type="button" @click="showAnswer = !showAnswer">
          {{ showAnswer ? '隐藏答案' : '显示答案（空格）' }}
        </button>
        <button class="btn ghost" type="button" @click="goToSource">跳转原题</button>
      </div>

      <div v-if="showAnswer" class="answer">
        <pre>{{ currentItem.answer }}</pre>
      </div>

      <div class="mark-row">
        <button class="mark unknown" type="button" @click="markAndNext('unknown')">不会（1）</button>
        <button class="mark vague" type="button" @click="markAndNext('vague')">模糊（2）</button>
        <button class="mark mastered" type="button" @click="markAndNext('mastered')">会讲（3）</button>
      </div>

      <div class="nav-row">
        <button class="btn ghost" type="button" :disabled="currentIndex === 0" @click="prev">上一题</button>
        <button class="btn ghost" type="button" :disabled="currentIndex >= items.length - 1" @click="next">下一题</button>
      </div>
    </section>

    <section v-else class="empty">
      <p>当前筛选条件下没有题目。</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchItems } from '@/data/search-index'
import { useLearningStore } from '@/stores/learning'
import type { MasteryLevel } from '@/stores/learning'
import type { SearchCategory, SearchItem, SearchTag } from '@/types/search'
import { loadPracticeSession, savePracticeSession } from '@/utils/practiceSession'

const route = useRoute()
const router = useRouter()
const learningStore = useLearningStore()

const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCategory = ref<'all' | SearchCategory>(
  typeof route.query.category === 'string' ? (route.query.category as 'all' | SearchCategory) : 'all'
)
const selectedTag = ref<'all' | SearchTag>(typeof route.query.tag === 'string' ? (route.query.tag as 'all' | SearchTag) : 'all')
const mode = ref<'all' | 'review' | 'weak'>(
  typeof route.query.mode === 'string' ? (route.query.mode as 'all' | 'review' | 'weak') : 'all'
)

const currentIndex = ref(0)
const showAnswer = ref(false)
const isApplyingSession = ref(false)

const categoryOptions: { value: SearchCategory; label: string }[] = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'database', label: '数据库' },
  { value: 'algorithm', label: '算法' },
  { value: 'system-design', label: '系统设计' },
  { value: 'devops', label: 'DevOps' },
  { value: 'network', label: '计算机网络' },
  { value: 'os', label: '操作系统' },
  { value: 'ai', label: '人工智能' },
]

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

const tagLabelMap: Record<SearchTag, string> = {
  must: '必问',
  frequent: '高频',
  important: '重要',
}

const masteryLabelMap: Record<MasteryLevel, string> = {
  unknown: '不会',
  vague: '模糊',
  mastered: '会讲',
}

const normalize = (value: string) => value.toLowerCase().trim()

const items = computed(() => {
  const q = normalize(keyword.value)
  const tokens = q ? q.split(/\s+/).filter(Boolean) : []

  let list = searchItems

  if (selectedCategory.value !== 'all') {
    list = list.filter((item) => item.category === selectedCategory.value)
  }

  if (selectedTag.value !== 'all') {
    const activeTag = selectedTag.value as SearchTag
    list = list.filter((item) => item.tags.includes(activeTag))
  }

  if (mode.value === 'review') {
    const reviewSet = new Set(learningStore.reviewQueueIds)
    list = list.filter((item) => reviewSet.has(item.id))
  }

  if (mode.value === 'weak') {
    const weakSet = new Set(learningStore.weakQuestionIds)
    list = list.filter((item) => weakSet.has(item.id))
  }

  if (!tokens.length) {
    return list
  }

  return list.filter((item) => {
    const text = `${item.question} ${item.answer} ${item.sectionTitle} ${item.tags.join(' ')}`.toLowerCase()
    return tokens.every((token) => text.includes(token))
  })
})

const currentItem = computed<SearchItem | null>(() => {
  if (!items.value.length) return null
  return items.value[currentIndex.value] ?? null
})

const record = computed(() => {
  if (!currentItem.value) return null
  return learningStore.getRecord(currentItem.value.id)
})

watch(items, (list) => {
  if (!list.length) {
    currentIndex.value = 0
    return
  }

  if (currentIndex.value >= list.length) {
    currentIndex.value = list.length - 1
  }
})

watch([keyword, selectedCategory, selectedTag, mode], () => {
  currentIndex.value = 0
  showAnswer.value = false
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
  if (isApplyingSession.value) return
  persistSession()
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

const markAndNext = (mastery: MasteryLevel) => {
  if (!currentItem.value) return
  learningStore.markMastery(currentItem.value.id, mastery)
  next()
}

const goToSource = () => {
  if (!currentItem.value) return
  void router.push({ path: currentItem.value.path, hash: `#${currentItem.value.anchor}` })
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

  if (event.key === '1') markAndNext('unknown')
  if (event.key === '2') markAndNext('vague')
  if (event.key === '3') markAndNext('mastered')
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
    if (session.currentItemId) {
      const index = items.value.findIndex((item) => item.id === session.currentItemId)
      currentIndex.value = index >= 0 ? index : 0
    } else {
      currentIndex.value = 0
    }

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
  max-width: 980px;
  margin: 0 auto;
  padding: 36px 20px 60px;
}

.back-link {
  color: var(--text-tertiary);
  text-decoration: none;
}

.practice-header h1 {
  font-size: 2.2rem;
  margin-top: 10px;
}

.practice-header p {
  color: var(--text-tertiary);
}

.toolbar {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.toolbar label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.875rem;
}

.toolbar input,
.toolbar select {
  height: 40px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  padding: 0 10px;
  background: var(--card-bg);
  color: var(--text-primary);
}

.progress-panel {
  margin-top: 14px;
}

.progress-track {
  margin-top: 8px;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
}

.card {
  margin-top: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.meta {
  color: var(--text-muted);
  font-size: 0.875rem;
  display: flex;
  gap: 8px;
}

.card h2 {
  margin-top: 10px;
  font-size: 1.3rem;
}

.tag-row {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  color: #fff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.75rem;
}

.tag.must { background: #2563eb; }
.tag.frequent { background: #059669; }
.tag.important { background: #d97706; }
.tag.status { background: #334155; }

.actions,
.mark-row,
.nav-row {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn,
.mark {
  height: 38px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 0 12px;
  cursor: pointer;
}

.btn.ghost {
  background: transparent;
}

.answer {
  margin-top: 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  padding: 12px;
}

.answer pre {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.6;
}

.mark.unknown { border-color: #2563eb; color: #2563eb; }
.mark.vague { border-color: #d97706; color: #d97706; }
.mark.mastered { border-color: #059669; color: #059669; }

.empty {
  margin-top: 24px;
  color: var(--text-tertiary);
}

@media (max-width: 900px) {
  .toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="search-page">
    <header class="search-header">
      <router-link to="/" class="back-link">返回首页</router-link>
      <h1>全局搜索</h1>
      <p>按关键词、分类、标签快速定位面试题。</p>
    </header>

    <section class="search-panel">
      <input
        v-model.trim="keyword"
        class="search-input"
        type="search"
        placeholder="输入关键词，例如：线程池、Redis、索引、提示工程..."
      />

      <div class="filter-row">
        <label class="filter-item">
          <span>分类</span>
          <select v-model="selectedCategory">
            <option value="all">全部分类</option>
            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="filter-item">
          <span>标签</span>
          <select v-model="selectedTag">
            <option value="all">全部标签</option>
            <option value="must">必问</option>
            <option value="frequent">高频</option>
            <option value="important">重要</option>
          </select>
        </label>
      </div>
    </section>

    <section class="result-summary">
      <p>共找到 <strong>{{ filteredResults.length }}</strong> 条结果</p>
      <button class="practice-btn" type="button" @click="startPractice">按当前筛选开始刷题</button>
    </section>

    <section v-if="filteredResults.length" class="result-list">
      <article v-for="item in filteredResults" :key="item.id" class="result-card">
        <div class="result-meta">
          <span class="category">{{ categoryLabelMap[item.category] }}</span>
          <span class="divider">/</span>
          <span>{{ item.sectionTitle }}</span>
        </div>

        <h2>
          <button class="result-link" type="button" @click="goToQuestion(item.path, item.anchor)">
            {{ item.question }}
          </button>
        </h2>

        <p class="snippet">{{ toSnippet(item.answer) }}</p>

        <div class="tags">
          <span v-for="tag in item.tags" :key="`${item.id}-${tag}`" :class="['tag', tag]">
            {{ tagLabelMap[tag] }}
          </span>
        </div>
      </article>
    </section>

    <section v-else class="empty-state">
      <p>没有匹配结果，试试换个关键词或筛选条件。</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchItems } from '@/data/search-index'
import type { SearchCategory, SearchItem, SearchTag } from '@/types/search'

const router = useRouter()
const route = useRoute()

const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCategory = ref<'all' | SearchCategory>(
  typeof route.query.category === 'string' ? (route.query.category as 'all' | SearchCategory) : 'all'
)
const selectedTag = ref<'all' | SearchTag>(
  typeof route.query.tag === 'string' ? (route.query.tag as 'all' | SearchTag) : 'all'
)

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

const normalize = (text: string) => text.toLowerCase().trim()

const filteredResults = computed(() => {
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

  if (!tokens.length) {
    return list.slice(0, 150)
  }

  const scored: { item: SearchItem; score: number }[] = []

  for (const item of list) {
    const qText = normalize(item.question)
    const tagText = normalize(item.tags.join(' '))
    const sectionText = normalize(item.sectionTitle)
    const answerText = normalize(item.answer)

    let score = 0
    let matchedAll = true

    for (const token of tokens) {
      const inQuestion = qText.includes(token)
      const inSection = sectionText.includes(token)
      const inTag = tagText.includes(token)
      const inAnswer = answerText.includes(token)

      if (!inQuestion && !inSection && !inTag && !inAnswer) {
        matchedAll = false
        break
      }

      if (inQuestion) score += 6
      if (inSection) score += 4
      if (inTag) score += 3
      if (inAnswer) score += 1
    }

    if (matchedAll) {
      scored.push({ item, score })
    }
  }

  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.item).slice(0, 150)
})

watch([keyword, selectedCategory, selectedTag], () => {
  void router.replace({
    path: '/search',
    query: {
      q: keyword.value || undefined,
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      tag: selectedTag.value === 'all' ? undefined : selectedTag.value,
    },
  })
})

const toSnippet = (answer: string) => {
  const plain = answer
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, ' ')
    .replace(/[-*#>_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= 120) return plain
  return `${plain.slice(0, 120)}...`
}

const goToQuestion = (path: string, anchor: string) => {
  void router.push({ path, hash: `#${anchor}` })
}

const startPractice = () => {
  void router.push({
    path: '/practice',
    query: {
      q: keyword.value || undefined,
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      tag: selectedTag.value === 'all' ? undefined : selectedTag.value,
    },
  })
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 40px 24px 56px;
  max-width: 1080px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 20px;
}

.back-link {
  display: inline-block;
  margin-bottom: 14px;
  color: var(--text-tertiary);
  text-decoration: none;
}

.search-header h1 {
  font-size: 2.25rem;
  margin-bottom: 10px;
}

.search-header p {
  color: var(--text-tertiary);
}

.search-panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 18px;
  box-shadow: var(--shadow-sm);
}

.search-input {
  width: 100%;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  padding: 0 14px;
  color: var(--text-primary);
  font-size: 1rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.filter-item select {
  height: 40px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-primary);
  padding: 0 10px;
}

.result-summary {
  margin: 16px 2px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.practice-btn {
  height: 34px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
}

.result-list {
  display: grid;
  gap: 12px;
}

.result-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
}

.result-meta {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.divider {
  margin: 0 8px;
}

.result-link {
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 1.06rem;
  text-align: left;
  cursor: pointer;
  padding: 0;
}

.result-link:hover {
  color: var(--primary-color);
}

.snippet {
  color: var(--text-secondary);
  margin-top: 8px;
}

.tags {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  border-radius: var(--radius-full);
  padding: 4px 10px;
  color: white;
}

.tag.must {
  background: #2563eb;
}

.tag.frequent {
  background: #059669;
}

.tag.important {
  background: #d97706;
}

.empty-state {
  margin-top: 20px;
  color: var(--text-tertiary);
  text-align: center;
}

@media (max-width: 768px) {
  .search-page {
    padding: 24px 16px 40px;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }
}
</style>





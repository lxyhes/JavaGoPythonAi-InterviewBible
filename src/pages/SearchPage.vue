<template>
  <div class="search-page">
    <a-page-header
      :title="t('search.title')"
      :sub-title="t('search.subtitle')"
      @back="() => $router.push('/dashboard')"
    />

    <a-card class="search-panel" :bordered="true">
      <a-input-search
        v-model:value="keyword"
        :placeholder="t('search.placeholder')"
        allow-clear
        size="large"
        class="search-input"
      />

      <a-row :gutter="[16, 16]" class="filter-row">
        <a-col :xs="24" :sm="12">
          <a-space direction="vertical" style="width: 100%">
            <span class="filter-label">{{ t('search.category') }}</span>
            <a-select v-model:value="selectedCategory" style="width: 100%">
              <a-select-option value="all">{{ t('search.allCategories') }}</a-select-option>
              <a-select-option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-space>
        </a-col>

        <a-col :xs="24" :sm="12">
          <a-space direction="vertical" style="width: 100%">
            <span class="filter-label">{{ t('search.tag') }}</span>
            <a-select v-model:value="selectedTag" style="width: 100%">
              <a-select-option value="all">{{ t('search.allTags') }}</a-select-option>
              <a-select-option value="must">{{ t('common.tags.must') }}</a-select-option>
              <a-select-option value="frequent">{{ t('common.tags.frequent') }}</a-select-option>
              <a-select-option value="important">{{ t('common.tags.important') }}</a-select-option>
            </a-select>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <a-row justify="space-between" align="middle" class="result-summary">
      <a-typography-text>
        <FileSearchOutlined />
        {{ t('search.results', { count: filteredResults.length }) }}
      </a-typography-text>
      <a-button type="primary" @click="startPractice">
        <PlayCircleOutlined />
        {{ t('search.startPractice') }}
      </a-button>
    </a-row>

    <a-list
      v-if="filteredResults.length"
      :data-source="filteredResults"
      :pagination="{ pageSize: 20 }"
      class="result-list"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card class="result-card" hoverable @click="goToQuestion(item.path, item.anchor)">
            <a-space direction="vertical" style="width: 100%">
              <a-space>
                <a-tag color="blue">{{ categoryLabelMap[item.category as SearchCategory] }}</a-tag>
                <a-typography-text type="secondary">{{ item.sectionTitle }}</a-typography-text>
              </a-space>

              <a-typography-title :level="4" class="question-title">
                {{ item.question }}
              </a-typography-title>

              <a-typography-paragraph
                type="secondary"
                :ellipsis="{ rows: 2 }"
                class="snippet"
              >
                {{ toSnippet(item.answer) }}
              </a-typography-paragraph>

              <a-space wrap>
                <a-tag
                  v-for="tag in item.tags"
                  :key="`${item.id}-${tag}`"
                  :color="tagColorMap[tag as SearchTag]"
                >
                  {{ tagLabelMap[tag as SearchTag] }}
                </a-tag>
              </a-space>
            </a-space>
          </a-card>
        </a-list-item>
      </template>
    </a-list>

    <a-empty
      v-else
      :description="t('search.noResults')"
      class="empty-state"
    >
      <template #image>
        <SearchOutlined style="font-size: 64px; color: #bfbfbf" />
      </template>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
import {
  FileSearchOutlined,
  PlayCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import type { SearchCategory, SearchItem, SearchTag } from '@/types/search'

const router = useRouter()
const route = useRoute()
const i18nStore = useI18nStore()
const t = i18nStore.t

const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCategory = ref<'all' | SearchCategory>(
  typeof route.query.category === 'string' ? (route.query.category as 'all' | SearchCategory) : 'all'
)
const selectedTag = ref<'all' | SearchTag>(
  typeof route.query.tag === 'string' ? (route.query.tag as 'all' | SearchTag) : 'all'
)

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

const categoryLabelMap = computed<Record<SearchCategory, string>>(() => ({
  frontend: t('common.categories.frontend'),
  backend: t('common.categories.backend'),
  database: t('common.categories.database'),
  algorithm: t('common.categories.algorithm'),
  'system-design': t('common.categories.system-design'),
  devops: t('common.categories.devops'),
  network: t('common.categories.network'),
  os: t('common.categories.os'),
  ai: t('common.categories.ai'),
}))

const tagLabelMap: Record<SearchTag, string> = {
  must: t('common.tags.must'),
  frequent: t('common.tags.frequent'),
  important: t('common.tags.important'),
}

const tagColorMap: Record<SearchTag, string> = {
  must: 'red',
  frequent: 'green',
  important: 'orange',
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
  padding: 0 24px 56px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-panel {
  margin-top: 16px;
}

.search-input {
  margin-bottom: 16px;
}

.filter-row {
  margin-top: 8px;
}

.filter-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.result-summary {
  margin: 16px 0;
  padding: 0 8px;
}

.result-list {
  margin-top: 8px;
}

.result-card {
  width: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.result-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.question-title {
  margin: 0 !important;
  font-size: 1.1rem !important;
  line-height: 1.5 !important;
}

.snippet {
  margin-bottom: 0 !important;
}

.empty-state {
  margin-top: 60px;
}

:deep(.ant-list-item) {
  padding: 8px 0;
}

@media (max-width: 768px) {
  .search-page {
    padding: 0 16px 40px;
  }
}
</style>

<template>
  <div class="content-section">
    <h2>{{ title }}</h2>
    <div class="qa-list">
      <QAItem
        v-for="(item, index) in items"
        :id="getQuestionAnchor(item.question, index)"
        :key="index"
        :question="item.question"
        :tags="item.tags"
        :category="category"
        :show-ai="showAI"
      >
        <div class="markdown-body" v-html="renderAnswer(item.answer)"></div>
      </QAItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import QAItem from './QAItem.vue'
import { marked } from 'marked'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import { buildQuestionAnchor } from '@/utils/questionAnchor'

interface Tag {
  text: string
  type: 'must' | 'frequent' | 'important'
}

interface QAItemData {
  question: string
  tags: Tag[]
  answer: string
}

const props = withDefaults(defineProps<{
  title: string
  items: QAItemData[]
  anchorPrefix?: string
  category?: string
  showAI?: boolean
}>(), {
  category: '通用',
  showAI: true
})

const getQuestionAnchor = (question: string, index: number) => {
  if (!props.anchorPrefix) {
    return undefined
  }
  return buildQuestionAnchor(props.anchorPrefix, question, index)
}

const renderAnswer = (answer: string) => {
  if (!answer) return ''
  
  try {
    // marked v11+ 推荐直接使用 parseSync 或 parse
    const rawHtml = marked.parse(answer, {
      gfm: true,
      breaks: true
    }) as string
    
    return sanitizeHtml(rawHtml, 'markdown')
  } catch (e) {
    console.error('Markdown parse error:', e)
    return answer
  }
}
</script>

<style scoped>
.content-section {
  padding: 20px;
}

h2 {
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

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
      >
        <div v-html="renderAnswer(item.answer)"></div>
      </QAItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import QAItem from './QAItem.vue'
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

const props = defineProps<{
  title: string
  items: QAItemData[]
  anchorPrefix?: string
}>()

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const getQuestionAnchor = (question: string, index: number) => {
  if (!props.anchorPrefix) {
    return undefined
  }
  return buildQuestionAnchor(props.anchorPrefix, question, index)
}

const renderAnswer = (answer: string) => {
  const tokens: string[] = []

  const tokenized = answer
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, _lang, code) => {
      const token = `__HTML_TOKEN_${tokens.length}__`
      tokens.push(`<pre><code>${escapeHtml(code)}</code></pre>`)
      return token
    })
    .replace(/`([^`]+)`/g, (_match, code) => {
      const token = `__HTML_TOKEN_${tokens.length}__`
      tokens.push(`<code>${escapeHtml(code)}</code>`)
      return token
    })

  let rendered = escapeHtml(tokenized)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')

  tokens.forEach((html, index) => {
    rendered = rendered.replace(`__HTML_TOKEN_${index}__`, html)
  })

  return sanitizeHtml(rendered, 'markdown')
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

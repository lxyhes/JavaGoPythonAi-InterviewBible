<template>
  <div class="content-section">
    <h2>{{ title }}</h2>
    <div class="qa-list">
      <QAItem 
        v-for="(item, index) in items" 
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

interface Tag {
  text: string
  type: 'must' | 'frequent' | 'important'
}

interface QAItemData {
  question: string
  tags: Tag[]
  answer: string
}

defineProps<{
  title: string
  items: QAItemData[]
}>()

const renderAnswer = (answer: string) => {
  // 简单的 markdown 转换
  return answer
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
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

<template>
  <div class="qa-item">
    <div class="question">
      <span class="q-mark">Q</span>
      <span class="q-text">{{ question }}</span>
    </div>
    <div class="answer">
      <div class="tags" v-if="tags.length">
        <span v-for="tag in tags" :key="tag" :class="['tag', tag.type]">{{ tag.text }}</span>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tag {
  text: string
  type: 'must' | 'frequent' | 'important'
}

defineProps<{
  question: string
  tags?: Tag[]
}>()
</script>

<style scoped>
.qa-item {
  background: var(--bg-color);
  border-radius: var(--radius-md);
  padding: 24px;
  border-left: 4px solid var(--primary-color);
  transition: var(--transition-base);
  margin-bottom: 20px;
}

.qa-item:hover {
  transform: translateX(6px);
  box-shadow: var(--shadow-md);
  background: var(--card-bg);
}

.question {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.q-mark {
  background: var(--primary-gradient);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 800;
  flex-shrink: 0;
}

.q-text {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.125rem;
  line-height: 1.6;
}

.answer {
  padding-left: 40px;
}

.tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.tag.must {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.tag.frequent {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.tag.important {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.content {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.8;
}

.content :deep(p) {
  margin: 12px 0;
}

.content :deep(ul),
.content :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.content :deep(li) {
  margin: 8px 0;
}

.content :deep(pre) {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 12px 0;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
}

.content :deep(code) {
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  font-size: 0.875em;
  color: var(--primary-dark);
}

.content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.content :deep(table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 16px 0;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.content :deep(th) {
  background: var(--bg-secondary);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
}

.content :deep(td) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
}

.content :deep(tr:last-child td) {
  border-bottom: none;
}

@media (max-width: 768px) {
  .qa-item {
    padding: 16px;
  }

  .answer {
    padding-left: 0;
  }

  .q-text {
    font-size: 1rem;
  }
}
</style>

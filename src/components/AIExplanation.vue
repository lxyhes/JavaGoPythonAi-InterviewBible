<template>
  <div class="ai-explanation">
    <button v-if="!showExplanation" class="ai-btn" @click="getExplanation" :disabled="loading">
      <span v-if="loading" class="loading-spinner"></span>
      <span v-else class="ai-icon">🤖</span>
      {{ loading ? 'AI 思考中...' : 'AI 解释' }}
    </button>

    <div v-else class="explanation-content">
      <div class="explanation-header">
        <span class="ai-icon">🤖</span>
        <span class="title">AI 解释</span>
        <button class="close-btn" @click="showExplanation = false">×</button>
      </div>
      <div class="explanation-body" v-html="formattedExplanation"></div>
      <div class="explanation-actions">
        <button class="action-btn" @click="getExplanation" :disabled="loading">
          {{ loading ? '重新生成中...' : '重新解释' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { interviewApi } from '@/services/api'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

interface Props {
  question: string
  category: string
}

const props = defineProps<Props>()

const loading = ref(false)
const showExplanation = ref(false)
const explanation = ref('')
let stopStream: (() => void) | null = null

const formattedExplanation = computed(() => {
  if (!explanation.value) return ''
  const html = explanation.value
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
  return sanitizeHtml(html)
})

const resetStream = () => {
  if (stopStream) {
    stopStream()
    stopStream = null
  }
}

function getExplanation() {
  resetStream()
  loading.value = true
  showExplanation.value = true
  explanation.value = ''

  stopStream = interviewApi.explainStream(props.question, props.category, {
    onChunk: (chunk) => {
      explanation.value += chunk
    },
    onDone: () => {
      loading.value = false
      stopStream = null
    },
    onError: (message) => {
      loading.value = false
      explanation.value = `AI 服务暂时不可用。\n\n错误信息：${message}`
      stopStream = null
    },
  })
}

onUnmounted(() => {
  resetStream()
})
</script>

<style scoped>
.ai-explanation {
  margin-top: 16px;
}

.ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ai-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ai-icon {
  font-size: 18px;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.explanation-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.explanation-header .title {
  font-weight: 600;
  color: #333;
  flex: 1;
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.explanation-body {
  color: #444;
  line-height: 1.8;
  font-size: 14px;
}

.explanation-body :deep(pre) {
  background: #2d3748;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.explanation-body :deep(code) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
}

.explanation-body :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
}

.explanation-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

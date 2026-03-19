<template>
  <div class="question-generator">
    <button class="generate-btn" @click="showModal = true">
      <span class="icon">✨</span>
      AI 生成题目
    </button>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>🤖 AI 题目生成</h3>
            <button class="close-btn" @click="showModal = false">×</button>
          </div>

          <div class="modal-body">
            <div class="input-section">
              <label>主题/技术栈</label>
              <input v-model="topic" type="text" placeholder="例如: Spring Boot、React、微服务" class="text-input" />
            </div>

            <div class="input-section">
              <label>生成数量</label>
              <div class="count-selector">
                <button v-for="n in [3, 5, 10]" :key="n" :class="['count-btn', { active: count === n }]" @click="count = n">
                  {{ n }} 道
                </button>
              </div>
            </div>

            <button class="submit-btn" @click="generateQuestions" :disabled="!topic.trim() || loading">
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? '生成中...' : '开始生成' }}
            </button>

            <div v-if="result" class="result-section">
              <div class="result-header">
                <span class="icon">📋</span>
                <span>生成结果</span>
              </div>
              <div class="result-content" v-html="formattedResult"></div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { interviewApi } from '@/services/api'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

const showModal = ref(false)
const topic = ref('')
const count = ref(5)
const loading = ref(false)
const result = ref('')
let stopStream: (() => void) | null = null

const formattedResult = computed(() => {
  if (!result.value) return ''
  const html = result.value
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

function generateQuestions() {
  if (!topic.value.trim()) return

  resetStream()
  loading.value = true
  result.value = ''

  stopStream = interviewApi.generateStream(topic.value, count.value, {
    onChunk: (chunk) => {
      result.value += chunk
    },
    onDone: () => {
      loading.value = false
      stopStream = null
    },
    onError: (message) => {
      loading.value = false
      result.value = `生成失败：${message}`
      stopStream = null
    },
  })
}

onUnmounted(() => {
  resetStream()
})
</script>

<style scoped>
.question-generator {
  display: inline-block;
}

.generate-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  font-size: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.input-section {
  margin-bottom: 20px;
}

.input-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.text-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.text-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.count-selector {
  display: flex;
  gap: 12px;
}

.count-btn {
  flex: 1;
  padding: 12px;
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.count-btn:hover {
  background: #e5e7eb;
}

.count-btn.active {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  color: #667eea;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
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

.result-section {
  margin-top: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #111827;
}

.result-content {
  color: #374151;
  line-height: 1.8;
  font-size: 14px;
}

.result-content :deep(pre) {
  background: #1f2937;
  color: #f3f4f6;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.result-content :deep(code) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
}

.result-content :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
}
</style>

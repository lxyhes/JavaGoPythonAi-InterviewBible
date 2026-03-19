<template>
  <div class="code-analyzer">
    <button class="analyze-btn" @click="showModal = true">
      <span class="icon">🔍</span>
      代码分析
    </button>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>🤖 AI 代码分析</h3>
            <button class="close-btn" @click="showModal = false">×</button>
          </div>

          <div class="modal-body">
            <div class="input-section">
              <label>文件路径（可选）</label>
              <input
                v-model="filePath"
                type="text"
                placeholder="例如: src/main/java/UserService.java"
                class="text-input"
              />
            </div>

            <div class="input-section">
              <label>代码内容</label>
              <textarea
                v-model="codeContent"
                rows="10"
                placeholder="在此粘贴需要分析的代码..."
                class="code-textarea"
              ></textarea>
            </div>

            <button
              class="submit-btn"
              @click="analyzeCode"
              :disabled="!codeContent.trim() || loading"
            >
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? '分析中...' : '开始分析' }}
            </button>

            <div v-if="result" class="result-section">
              <div class="result-header">
                <span class="icon">📋</span>
                <span>分析结果</span>
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
import { ref, computed } from 'vue'
import { interviewApi } from '@/services/api'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

const showModal = ref(false)
const filePath = ref('')
const codeContent = ref('')
const loading = ref(false)
const result = ref('')

const formattedResult = computed(() => {
  if (!result.value) return ''
  let html = result.value
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
  return sanitizeHtml(html)
})

async function analyzeCode() {
  if (!codeContent.value.trim()) return

  loading.value = true
  result.value = ''

  try {
    const response = await interviewApi.analyzeCode({
      filePath: filePath.value || '未命名文件',
      codeContent: codeContent.value,
    })

    if (response.success) {
      result.value = response.data
    } else {
      result.value = `分析失败：${response.error || '未知错误'}`
    }
  } catch (err) {
    result.value = `服务暂时不可用。请确保：\n1. 后端服务已启动\n2. iFlow CLI 已启动\n\n错误：${err instanceof Error ? err.message : '网络错误'}`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.code-analyzer {
  display: inline-block;
}

.analyze-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.analyze-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);
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

.text-input,
.code-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  font-family: 'Fira Code', monospace;
}

.text-input:focus,
.code-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.code-textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
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

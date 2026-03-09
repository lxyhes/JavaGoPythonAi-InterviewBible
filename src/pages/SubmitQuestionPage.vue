<template>
  <div class="submit-page">
    <header class="page-header">
      <h1>📝 提交面试题</h1>
      <p class="subtitle">分享你遇到的热点面试题，帮助更多求职者</p>
    </header>

    <form class="submit-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="category">分类 <span class="required">*</span></label>
        <select id="category" v-model="form.category" required>
          <option value="">请选择分类</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="sectionId">章节ID <span class="required">*</span></label>
        <input
          id="sectionId"
          v-model="form.sectionId"
          type="text"
          placeholder="例如：java-basics, react-hooks"
          required
        />
        <span class="hint">用于归类到具体章节，使用小写字母和连字符</span>
      </div>

      <div class="form-group">
        <label for="question">问题 <span class="required">*</span></label>
        <textarea
          id="question"
          v-model="form.question"
          rows="3"
          placeholder="请输入面试题内容"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="answer">答案 <span class="required">*</span></label>
        <textarea
          id="answer"
          v-model="form.answer"
          rows="10"
          placeholder="请输入详细答案，支持 Markdown 格式"
          required
        ></textarea>
        <span class="hint">建议包含：核心概念、代码示例、注意事项</span>
      </div>

      <div class="form-group">
        <label>标签</label>
        <div class="tag-selector">
          <button
            v-for="tag in availableTags"
            :key="tag"
            type="button"
            :class="['tag-btn', { active: form.tags.includes(tag) }]"
            @click="toggleTag(tag)"
          >
            {{ tagLabelMap[tag] || tag }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="source">来源</label>
        <input
          id="source"
          v-model="form.source"
          type="url"
          placeholder="https://example.com/interview-question"
        />
        <span class="hint">题目来源链接（可选）</span>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="handleReset">重置</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交题目' }}
        </button>
      </div>
    </form>

    <div v-if="submitResult" :class="['result-message', submitResult.type]">
      {{ submitResult.message }}
    </div>

    <section class="tips-section">
      <h2>💡 提交建议</h2>
      <ul>
        <li>确保题目是真实面试中出现过的热点问题</li>
        <li>答案要详细，包含原理说明和代码示例</li>
        <li>标注正确的分类和标签，方便其他用户查找</li>
        <li>如有来源链接，请填写以方便追溯</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { questionApi } from '@/services/questionApi'
import type { QuestionSubmission } from '@/types'

const categories = [
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

const availableTags = ['must', 'frequent', 'important']

const tagLabelMap: Record<string, string> = {
  must: '必问',
  frequent: '高频',
  important: '重要',
}

const form = reactive<QuestionSubmission>({
  category: '',
  sectionId: '',
  question: '',
  answer: '',
  tags: [],
  source: '',
})

const isSubmitting = ref(false)
const submitResult = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const toggleTag = (tag: string) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  } else {
    form.tags.push(tag)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitResult.value = null

  try {
    const response = await questionApi.submit(form)
    if (response.success) {
      submitResult.value = {
        type: 'success',
        message: '题目提交成功！审核通过后将加入题库。',
      }
      handleReset()
    } else {
      submitResult.value = {
        type: 'error',
        message: response.error || '提交失败，请重试',
      }
    }
  } catch (error) {
    submitResult.value = {
      type: 'error',
      message: error instanceof Error ? error.message : '提交失败，请重试',
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleReset = () => {
  form.category = ''
  form.sectionId = ''
  form.question = ''
  form.answer = ''
  form.tags = []
  form.source = ''
}
</script>

<style scoped>
.submit-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 1.75rem;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-muted);
}

.submit-form {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}

.hint {
  display: block;
  margin-top: 4px;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.tag-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-btn {
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.tag-btn:hover {
  border-color: var(--primary-color);
}

.tag-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.btn-secondary,
.btn-primary {
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--border-color);
}

.btn-primary {
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-message {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  margin-bottom: 24px;
}

.result-message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.result-message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.tips-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px 24px;
}

.tips-section h2 {
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.tips-section ul {
  list-style: none;
  padding: 0;
}

.tips-section li {
  padding: 6px 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: 20px;
}

.tips-section li::before {
  content: '•';
  position: absolute;
  left: 6px;
  color: var(--primary-color);
}

@media (max-width: 640px) {
  .submit-page {
    padding: 16px;
  }

  .submit-form {
    padding: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-secondary,
  .btn-primary {
    width: 100%;
  }
}
</style>

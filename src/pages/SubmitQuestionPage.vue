<template>
  <div class="submit-page">
    <header class="page-header">
      <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
      <h1>{{ t('submitQuestion.title') }}</h1>
      <p>{{ t('submitQuestion.subtitle') }}</p>
    </header>

    <form class="submit-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="category">
          {{ t('submitQuestion.category') }}
          <span class="required">{{ t('submitQuestion.required') }}</span>
        </label>
        <select id="category" v-model="form.category" required>
          <option value="">{{ t('submitQuestion.selectCategory') }}</option>
          <option value="frontend">{{ t('common.categories.frontend') }}</option>
          <option value="backend">{{ t('common.categories.backend') }}</option>
          <option value="database">{{ t('common.categories.database') }}</option>
          <option value="algorithm">{{ t('common.categories.algorithm') }}</option>
          <option value="system-design">{{ t('common.categories.system-design') }}</option>
          <option value="devops">{{ t('common.categories.devops') }}</option>
          <option value="network">{{ t('common.categories.network') }}</option>
          <option value="os">{{ t('common.categories.os') }}</option>
          <option value="ai">{{ t('common.categories.ai') }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="sectionId">
          {{ t('submitQuestion.sectionId') }}
          <span class="required">{{ t('submitQuestion.required') }}</span>
        </label>
        <input
          id="sectionId"
          v-model="form.sectionId"
          type="text"
          :placeholder="t('submitQuestion.sectionPlaceholder')"
          required
        />
        <p class="hint">{{ t('submitQuestion.sectionHint') }}</p>
      </div>

      <div class="form-group">
        <label for="question">
          {{ t('submitQuestion.question') }}
          <span class="required">{{ t('submitQuestion.required') }}</span>
        </label>
        <textarea
          id="question"
          v-model="form.question"
          rows="3"
          :placeholder="t('submitQuestion.questionPlaceholder')"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="answer">
          {{ t('submitQuestion.answer') }}
          <span class="required">{{ t('submitQuestion.required') }}</span>
        </label>
        <textarea
          id="answer"
          v-model="form.answer"
          rows="10"
          :placeholder="t('submitQuestion.answerPlaceholder')"
          required
        ></textarea>
        <p class="hint">{{ t('submitQuestion.answerHint') }}</p>
      </div>

      <div class="form-group">
        <label for="tags">{{ t('submitQuestion.tags') }}</label>
        <div class="tags-input">
          <label v-for="tag in availableTags" :key="tag" class="tag-checkbox">
            <input v-model="form.tags" type="checkbox" :value="tag" />
            <span :class="['tag', tag]">{{ tagLabelMap[tag] }}</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="source">{{ t('submitQuestion.source') }}</label>
        <input
          id="source"
          v-model="form.source"
          type="url"
          :placeholder="t('submitQuestion.sourcePlaceholder')"
        />
        <p class="hint">{{ t('submitQuestion.sourceHint') }}</p>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="resetForm">
          {{ t('submitQuestion.reset') }}
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? t('submitQuestion.submitting') : t('submitQuestion.submit') }}
        </button>
      </div>
    </form>

    <section class="tips-section">
      <h2>{{ t('submitQuestion.tipsTitle') }}</h2>
      <ul>
        <li>{{ t('submitQuestion.tip1') }}</li>
        <li>{{ t('submitQuestion.tip2') }}</li>
        <li>{{ t('submitQuestion.tip3') }}</li>
        <li>{{ t('submitQuestion.tip4') }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'

const i18nStore = useI18nStore()
const t = i18nStore.t

const availableTags = ['must', 'frequent', 'important'] as const

const tagLabelMap = computed(() => ({
  must: t('common.tags.must'),
  frequent: t('common.tags.frequent'),
  important: t('common.tags.important'),
}))

const form = reactive({
  category: '',
  sectionId: '',
  question: '',
  answer: '',
  tags: [] as string[],
  source: '',
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  // Submit logic here
  console.log('Submitting:', form)
  isSubmitting.value = false
  alert(t('submitQuestion.submitSuccess'))
  resetForm()
}

const resetForm = () => {
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
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--text-tertiary);
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary-color);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.submit-form {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.required {
  color: #ef4444;
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.2s ease;
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
}

.hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.tags-input {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.tag-checkbox input {
  width: auto;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
}

.tag.must {
  background: #dbeafe;
  color: #1e40af;
}

.tag.frequent {
  background: #d1fae5;
  color: #065f46;
}

.tag.important {
  background: #fef3c7;
  color: #92400e;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
}

.tips-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.tips-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tips-section ul {
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

.tips-section li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

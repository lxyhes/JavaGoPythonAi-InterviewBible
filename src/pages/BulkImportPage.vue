<template>
  <div class="bulk-import-page">
    <header class="page-header">
      <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
      <h1>{{ t('bulkImport.title') }}</h1>
      <p>{{ t('bulkImport.subtitle') }}</p>
    </header>

    <section class="upload-section">
      <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
        <input ref="fileInput" type="file" accept=".json,.csv" hidden @change="handleFileSelect" />
        <div class="dropzone-content">
          <span class="icon">📁</span>
          <p class="hint">{{ t('bulkImport.uploadHint') }}</p>
          <p class="formats">{{ t('bulkImport.supportedFormats') }}</p>
          <button class="btn btn-secondary" type="button">{{ t('bulkImport.selectFile') }}</button>
        </div>
      </div>
    </section>

    <section v-if="previewData.length" class="preview-section">
      <h2>{{ t('bulkImport.dataPreview', { count: previewData.length }) }}</h2>
      <button class="btn btn-text" type="button" @click="resetFile">{{ t('bulkImport.reselect') }}</button>

      <div class="preview-table-wrapper">
        <table class="preview-table">
          <thead>
            <tr>
              <th>{{ t('bulkImport.category') }}</th>
              <th>{{ t('bulkImport.section') }}</th>
              <th>{{ t('bulkImport.question') }}</th>
              <th>{{ t('bulkImport.tags') }}</th>
              <th>{{ t('bulkImport.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in previewData.slice(0, 5)" :key="index" :class="{ error: item.errors?.length }">
              <td>{{ item.category }}</td>
              <td>{{ item.sectionId }}</td>
              <td class="question-cell">{{ item.question }}</td>
              <td>{{ item.tags?.join(', ') }}</td>
              <td>
                <span v-if="item.errors?.length" class="status error">{{ t('bulkImport.error') }}</span>
                <span v-else class="status valid">{{ t('bulkImport.valid') }}</span>
              </td>
            </tr>
            <tr v-if="previewData.length > 5">
              <td colspan="5" class="more-data">{{ t('bulkImport.moreData', { count: previewData.length - 5 }) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="validationErrors.length" class="validation-errors">
        <p>{{ t('bulkImport.validationError', { count: validationErrors.length }) }}</p>
      </div>
      <div v-else class="validation-success">
        <p>{{ t('bulkImport.validationSuccess') }}</p>
      </div>

      <div class="actions">
        <button class="btn btn-secondary" type="button" @click="resetFile">{{ t('bulkImport.cancel') }}</button>
        <button class="btn btn-primary" type="button" :disabled="isImporting || validationErrors.length > 0" @click="importData">
          {{ isImporting ? t('bulkImport.importing') : t('bulkImport.importCount', { count: validData.length }) }}
        </button>
      </div>
    </section>

    <section v-if="importResult" class="result-section">
      <h2>{{ importResult.success ? t('bulkImport.importSuccess') : t('bulkImport.importPartial') }}</h2>
      <div class="result-stats">
        <div class="stat success">
          <span class="number">{{ importResult.successCount }}</span>
          <span class="label">{{ t('bulkImport.success') }}</span>
        </div>
        <div class="stat skip">
          <span class="number">{{ importResult.skipCount }}</span>
          <span class="label">{{ t('bulkImport.skip') }}</span>
        </div>
        <div class="stat fail">
          <span class="number">{{ importResult.failCount }}</span>
          <span class="label">{{ t('bulkImport.fail') }}</span>
        </div>
      </div>

      <div v-if="importResult.errors.length" class="error-details">
        <h3>{{ t('bulkImport.errorDetails') }}</h3>
        <ul>
          <li v-for="(error, index) in importResult.errors.slice(0, 5)" :key="index">{{ error }}</li>
          <li v-if="importResult.errors.length > 5">{{ t('bulkImport.moreErrors', { count: importResult.errors.length - 5 }) }}</li>
        </ul>
      </div>

      <div class="actions">
        <button class="btn btn-secondary" type="button" @click="resetImport">{{ t('bulkImport.continueImport') }}</button>
        <router-link to="/" class="btn btn-primary">{{ t('bulkImport.viewQuestions') }}</router-link>
      </div>
    </section>

    <section class="guide-section">
      <h2>{{ t('bulkImport.guideTitle') }}</h2>
      <div class="format-tabs">
        <div class="format-content">
          <h3>{{ t('bulkImport.jsonFormat') }}</h3>
          <pre><code>[{
  "category": "frontend",
  "sectionId": "html-css",
  "question": "What is the box model?",
  "answer": "The CSS box model...",
  "tags": ["must", "frequent"],
  "source": "https://..."
}]</code></pre>
          <a href="/templates/questions-template.json" download class="btn btn-text">{{ t('bulkImport.downloadTemplate', { format: 'JSON' }) }}</a>
        </div>
        <div class="format-content">
          <h3>{{ t('bulkImport.csvFormat') }}</h3>
          <pre><code>category,sectionId,question,answer,tags,source
frontend,html-css,What is the box model?,The CSS box model...,must;frequent,https://...</code></pre>
          <a href="/templates/questions-template.csv" download class="btn btn-text">{{ t('bulkImport.downloadTemplate', { format: 'CSV' }) }}</a>
        </div>
      </div>

      <div class="tips">
        <h3>{{ t('bulkImport.tipsTitle') }}</h3>
        <ul>
          <li>{{ t('bulkImport.tip1') }}</li>
          <li>{{ t('bulkImport.tip2') }}</li>
          <li>{{ t('bulkImport.tip3', { separator: ';' }) }}</li>
          <li>{{ t('bulkImport.tip4') }}</li>
          <li>{{ t('bulkImport.tip5') }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18nStore } from '@/stores/i18n'

const i18nStore = useI18nStore()
const t = i18nStore.t

const fileInput = ref<HTMLInputElement | null>(null)
const previewData = ref<any[]>([])
const validationErrors = ref<string[]>([])
const validData = ref<any[]>([])
const isImporting = ref(false)
const importResult = ref<any>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    processFile(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  // File processing logic
  console.log('Processing file:', file.name)
}

const resetFile = () => {
  previewData.value = []
  validationErrors.value = []
  validData.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const importData = async () => {
  isImporting.value = true
  // Import logic
  isImporting.value = false
}

const resetImport = () => {
  importResult.value = null
  resetFile()
}
</script>

<style scoped>
.bulk-import-page {
  max-width: 1000px;
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

.upload-section {
  margin-bottom: 2rem;
}

.dropzone {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropzone:hover {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.05);
}

.dropzone-content .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.dropzone-content .hint {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.dropzone-content .formats {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.preview-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.preview-table-wrapper {
  overflow-x: auto;
  margin: 1rem 0;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.preview-table th {
  font-weight: 600;
  color: var(--text-secondary);
}

.question-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.status.valid {
  background: #d1fae5;
  color: #065f46;
}

.status.error {
  background: #fee2e2;
  color: #991b1b;
}

.more-data {
  text-align: center;
  color: var(--text-secondary);
}

.validation-errors {
  color: #ef4444;
  margin: 1rem 0;
}

.validation-success {
  color: #22c55e;
  margin: 1rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.result-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.result-stats {
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
}

.stat {
  text-align: center;
}

.stat .number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
}

.stat .label {
  color: var(--text-secondary);
}

.stat.success .number {
  color: #22c55e;
}

.stat.skip .number {
  color: #f59e0b;
}

.stat.fail .number {
  color: #ef4444;
}

.error-details {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #fee2e2;
  border-radius: var(--radius-md);
}

.error-details h3 {
  color: #991b1b;
  margin-bottom: 0.5rem;
}

.error-details ul {
  color: #991b1b;
  padding-left: 1.5rem;
}

.guide-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.format-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 1rem 0;
}

.format-content pre {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 0.5rem 0;
}

.tips {
  margin-top: 1.5rem;
}

.tips ul {
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

.tips li {
  margin-bottom: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
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

.btn-text {
  background: transparent;
  color: var(--primary-color);
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .format-tabs {
    grid-template-columns: 1fr;
  }

  .result-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style>

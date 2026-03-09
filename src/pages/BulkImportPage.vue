<template>
  <div class="bulk-import-page">
    <header class="page-header">
      <h1>📥 批量导入题目</h1>
      <p class="subtitle">支持 JSON、CSV 格式文件，一键导入多条面试题</p>
    </header>

    <!-- 上传区域 -->
    <div
      v-if="!importResult"
      class="upload-area"
      :class="{ dragging: isDragging, error: uploadError }"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".json,.csv"
        class="file-input"
        @change="handleFileSelect"
      />

      <div v-if="!previewData.length" class="upload-placeholder">
        <div class="upload-icon">📁</div>
        <h3>拖拽文件到此处，或点击上传</h3>
        <p class="upload-hint">支持格式：JSON、CSV</p>
        <button class="btn-select" @click="triggerFileSelect">选择文件</button>
      </div>

      <div v-else class="preview-section">
        <div class="preview-header">
          <h3>📋 数据预览 ({{ previewData.length }} 条)</h3>
          <button class="btn-text" @click="clearPreview">重新选择</button>
        </div>

        <div class="preview-table-wrapper">
          <table class="preview-table">
            <thead>
              <tr>
                <th>#</th>
                <th>分类</th>
                <th>章节</th>
                <th>问题</th>
                <th>标签</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in previewData.slice(0, 10)"
                :key="index"
                :class="{ error: item.errors?.length }"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.sectionId }}</td>
                <td class="question-cell" :title="item.question">
                  {{ truncate(item.question, 50) }}
                </td>
                <td>
                  <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
                </td>
                <td>
                  <span v-if="item.errors?.length" class="status-error" :title="item.errors.join('; ')">
                    ❌ 错误
                  </span>
                  <span v-else class="status-valid">✓ 有效</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="previewData.length > 10" class="preview-more">
            还有 {{ previewData.length - 10 }} 条数据...
          </div>
        </div>

        <div class="preview-actions">
          <div class="validation-summary">
            <span v-if="validationStats.errors > 0" class="error-count">
              ⚠️ {{ validationStats.errors }} 条数据有误
            </span>
            <span v-else class="success-count">
              ✓ 所有数据验证通过
            </span>
          </div>
          <button class="btn-secondary" @click="clearPreview">取消</button>
          <button
            class="btn-primary"
            :disabled="validationStats.valid === 0 || isImporting"
            @click="handleImport"
          >
            {{ isImporting ? '导入中...' : `导入 ${validationStats.valid} 条数据` }}
          </button>
        </div>
      </div>
    </div>

    <!-- 上传错误提示 -->
    <div v-if="uploadError" class="error-message">
      {{ uploadError }}
    </div>

    <!-- 导入结果 -->
    <div v-if="importResult" class="result-section">
      <div class="result-card" :class="importResult.success ? 'success' : 'partial'">
        <div class="result-icon">{{ importResult.success ? '🎉' : '⚠️' }}</div>
        <h3>{{ importResult.success ? '导入成功！' : '部分导入成功' }}</h3>

        <div class="result-stats">
          <div class="stat-item success">
            <span class="stat-value">{{ importResult.successCount }}</span>
            <span class="stat-label">成功</span>
          </div>
          <div v-if="importResult.skipCount > 0" class="stat-item skip">
            <span class="stat-value">{{ importResult.skipCount }}</span>
            <span class="stat-label">跳过(重复)</span>
          </div>
          <div v-if="importResult.errorCount > 0" class="stat-item error">
            <span class="stat-value">{{ importResult.errorCount }}</span>
            <span class="stat-label">失败</span>
          </div>
        </div>

        <div v-if="importResult.errors?.length" class="error-list">
          <h4>错误详情：</h4>
          <ul>
            <li v-for="(error, idx) in importResult.errors.slice(0, 5)" :key="idx">{{ error }}</li>
            <li v-if="importResult.errors.length > 5">...还有 {{ importResult.errors.length - 5 }} 条错误</li>
          </ul>
        </div>

        <div class="result-actions">
          <button class="btn-secondary" @click="resetImport">继续导入</button>
          <router-link to="/search" class="btn-primary">查看题库</router-link>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <section class="guide-section">
      <h2>📖 使用指南</h2>

      <div class="guide-grid">
        <div class="guide-card">
          <h3>JSON 格式</h3>
          <pre class="code-block">[
  {
    "category": "backend",
    "sectionId": "java-basics",
    "question": "Java 中 == 和 equals() 的区别？",
    "answer": "详细答案内容...",
    "tags": ["must", "frequent"],
    "source": "https://example.com"
  }
]</pre>
          <button class="btn-text" @click="downloadTemplate('json')">下载 JSON 模板</button>
        </div>

        <div class="guide-card">
          <h3>CSV 格式</h3>
          <pre class="code-block">category,sectionId,question,answer,tags,source
backend,java-basics,Java中==和equals()的区别？,详细答案...,must;frequent,https://example.com</pre>
          <button class="btn-text" @click="downloadTemplate('csv')">下载 CSV 模板</button>
        </div>
      </div>

      <div class="tips-list">
        <h3>💡 注意事项</h3>
        <ul>
          <li>分类必须是：frontend、backend、database、algorithm、system-design、devops、network、os、ai</li>
          <li>问题内容至少 5 个字符，答案至少 10 个字符</li>
          <li>CSV 中多个标签用分号 <code>;</code> 分隔</li>
          <li>重复题目会自动跳过</li>
          <li>导入前会显示预览，确认无误后再导入</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QuestionSubmission } from '@/types'

interface PreviewItem extends QuestionSubmission {
  errors?: string[]
}

interface ImportResult {
  success: boolean
  successCount: number
  skipCount: number
  errorCount: number
  errors: string[]
}

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploadError = ref('')
const previewData = ref<PreviewItem[]>([])
const isImporting = ref(false)
const importResult = ref<ImportResult | null>(null)

const validationStats = computed(() => {
  const valid = previewData.value.filter((item) => !item.errors?.length).length
  const errors = previewData.value.filter((item) => item.errors?.length).length
  return { valid, errors }
})

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) {
    processFile(files[0])
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  uploadError.value = ''

  // 验证文件类型
  if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
    uploadError.value = '不支持的文件格式，请上传 JSON 或 CSV 文件'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      if (file.name.endsWith('.json')) {
        parseJSON(content)
      } else {
        parseCSV(content)
      }
    } catch (error) {
      uploadError.value = `文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
  reader.readAsText(file)
}

const parseJSON = (content: string) => {
  const data = JSON.parse(content)
  const items = Array.isArray(data) ? data : [data]
  previewData.value = items.map(validateItem)
}

const parseCSV = (content: string) => {
  const lines = content.split('\n').filter((line) => line.trim())
  if (lines.length < 2) {
    uploadError.value = 'CSV 文件至少需要包含表头和一行数据'
    return
  }

  const headers = lines[0].split(',').map((h) => h.trim())
  const items: PreviewItem[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const item: Record<string, unknown> = {}

    headers.forEach((header, index) => {
      const value = values[index]?.trim() || ''
      switch (header.toLowerCase()) {
        case 'category':
          item.category = value
          break
        case 'sectionid':
        case 'section_id':
          item.sectionId = value
          break
        case 'question':
          item.question = value
          break
        case 'answer':
          item.answer = value
          break
        case 'tags':
          item.tags = value.split(';').filter((t) => t.trim())
          break
        case 'source':
          item.source = value
          break
      }
    })

    items.push(validateItem(item as unknown as QuestionSubmission))
  }

  previewData.value = items
}

const parseCSVLine = (line: string): string[] => {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  values.push(current)

  return values
}

const validateItem = (item: QuestionSubmission): PreviewItem => {
  const errors: string[] = []
  const validCategories = ['frontend', 'backend', 'database', 'algorithm', 'system-design', 'devops', 'network', 'os', 'ai']

  if (!item.category) {
    errors.push('分类不能为空')
  } else if (!validCategories.includes(item.category)) {
    errors.push(`无效分类: ${item.category}`)
  }

  if (!item.sectionId) {
    errors.push('章节ID不能为空')
  }

  if (!item.question || item.question.length < 5) {
    errors.push('问题至少5个字符')
  }

  if (!item.answer || item.answer.length < 10) {
    errors.push('答案至少10个字符')
  }

  return { ...item, errors: errors.length > 0 ? errors : undefined }
}

const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

const clearPreview = () => {
  previewData.value = []
  uploadError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleImport = async () => {
  if (isImporting.value) return

  isImporting.value = true
  const validItems = previewData.value.filter((item) => !item.errors?.length)

  try {
    // 这里模拟导入过程，实际应该调用后端 API
    // const response = await fetch('/api/questions/bulk-import', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(validItems)
    // })

    // 模拟导入结果
    await new Promise((resolve) => setTimeout(resolve, 1500))

    importResult.value = {
      success: true,
      successCount: validItems.length,
      skipCount: 0,
      errorCount: 0,
      errors: []
    }
  } catch (error) {
    importResult.value = {
      success: false,
      successCount: 0,
      skipCount: 0,
      errorCount: validItems.length,
      errors: [error instanceof Error ? error.message : '导入失败']
    }
  } finally {
    isImporting.value = false
  }
}

const resetImport = () => {
  importResult.value = null
  clearPreview()
}

const downloadTemplate = (format: 'json' | 'csv') => {
  const template = {
    category: 'backend',
    sectionId: 'java-basics',
    question: 'Java 中 == 和 equals() 的区别？',
    answer: '== 比较内存地址，equals 比较内容值。对于基本类型，== 比较值；对于引用类型，== 比较引用地址。String 和包装类重写了 equals 方法，用于比较内容。',
    tags: ['must', 'frequent'],
    source: 'https://github.com/CyC2018/CS-Notes'
  }

  let content: string
  let filename: string
  let mimeType: string

  if (format === 'json') {
    content = JSON.stringify([template], null, 2)
    filename = 'questions-template.json'
    mimeType = 'application/json'
  } else {
    const headers = 'category,sectionId,question,answer,tags,source'
    const row = `${template.category},${template.sectionId},"${template.question}","${template.answer}",${template.tags?.join(';')},${template.source}`
    content = `${headers}\n${row}`
    filename = 'questions-template.csv'
    mimeType = 'text/csv'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.bulk-import-page {
  max-width: 1000px;
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

/* 上传区域 */
.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--card-bg);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.upload-area.dragging {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.05);
}

.upload-area.error {
  border-color: #ef4444;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  text-align: center;
  padding: 40px;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.upload-placeholder h3 {
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.upload-hint {
  color: var(--text-muted);
  margin-bottom: 20px;
}

.btn-select {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-select:hover {
  opacity: 0.9;
}

/* 预览区域 */
.preview-section {
  width: 100%;
  padding: 24px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-header h3 {
  font-size: 1.1rem;
}

.preview-table-wrapper {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 16px;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.preview-table th,
.preview-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.preview-table th {
  background: var(--bg-secondary);
  font-weight: 600;
}

.preview-table tbody tr:last-child td {
  border-bottom: none;
}

.preview-table tbody tr.error {
  background: rgba(239, 68, 68, 0.05);
}

.question-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  margin-right: 4px;
}

.status-valid {
  color: #22c55e;
}

.status-error {
  color: #ef4444;
  cursor: help;
}

.preview-more {
  text-align: center;
  padding: 12px;
  color: var(--text-muted);
  font-size: 0.875rem;
  background: var(--bg-secondary);
}

.preview-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.validation-summary {
  flex: 1;
}

.error-count {
  color: #ef4444;
}

.success-count {
  color: #22c55e;
}

.btn-secondary,
.btn-primary {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-primary {
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: white;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-text {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-text:hover {
  text-decoration: underline;
}

/* 错误提示 */
.error-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: var(--radius-md);
  border: 1px solid #fca5a5;
}

/* 导入结果 */
.result-section {
  margin-top: 24px;
}

.result-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 32px;
  text-align: center;
}

.result-card.success {
  border-color: #86efac;
}

.result-card.partial {
  border-color: #fcd34d;
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.result-card h3 {
  font-size: 1.25rem;
  margin-bottom: 24px;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.stat-item.success .stat-value {
  color: #22c55e;
}

.stat-item.skip .stat-value {
  color: #f59e0b;
}

.stat-item.error .stat-value {
  color: #ef4444;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.error-list {
  text-align: left;
  background: #fee2e2;
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 24px;
}

.error-list h4 {
  margin-bottom: 8px;
  color: #991b1b;
}

.error-list ul {
  list-style: none;
  padding: 0;
}

.error-list li {
  padding: 4px 0;
  color: #991b1b;
  font-size: 0.875rem;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 使用指南 */
.guide-section {
  margin-top: 40px;
}

.guide-section h2 {
  font-size: 1.25rem;
  margin-bottom: 20px;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.guide-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
}

.guide-card h3 {
  font-size: 1rem;
  margin-bottom: 12px;
}

.code-block {
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 12px;
  font-size: 0.8125rem;
  overflow-x: auto;
  margin-bottom: 12px;
  font-family: monospace;
  line-height: 1.5;
}

.tips-list {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
}

.tips-list h3 {
  font-size: 1rem;
  margin-bottom: 12px;
}

.tips-list ul {
  list-style: none;
  padding: 0;
}

.tips-list li {
  padding: 8px 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: 20px;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 6px;
  color: var(--primary-color);
}

.tips-list code {
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .guide-grid {
    grid-template-columns: 1fr;
  }

  .preview-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .result-stats {
    gap: 16px;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>

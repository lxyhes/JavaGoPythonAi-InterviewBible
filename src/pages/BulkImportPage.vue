<template>
  <div class="bulk-import-page">
    <a-page-header
      :title="t('bulkImport.title')"
      :sub-title="t('bulkImport.subtitle')"
      @back="() => $router.push('/dashboard')"
    />

    <a-card v-if="!previewData.length && !importResult" class="upload-section">
      <a-upload-dragger
        :show-upload-list="false"
        accept=".json,.csv"
        @drop="handleDrop"
        @change="handleFileChange"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">{{ t('bulkImport.uploadHint') }}</p>
        <p class="ant-upload-hint">{{ t('bulkImport.supportedFormats') }}</p>
        <a-button type="primary" style="margin-top: 16px">
          {{ t('bulkImport.selectFile') }}
        </a-button>
      </a-upload-dragger>
    </a-card>

    <a-card v-if="previewData.length && !importResult" :title="t('bulkImport.dataPreview', { count: previewData.length })">
      <template #extra>
        <a-button type="link" @click="resetFile">
          <ReloadOutlined />
          {{ t('bulkImport.reselect') }}
        </a-button>
      </template>

      <a-table
        :data-source="previewData.slice(0, 5)"
        :columns="previewColumns"
        :pagination="false"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.errors?.length" color="error">{{ t('bulkImport.error') }}</a-tag>
            <a-tag v-else color="success">{{ t('bulkImport.valid') }}</a-tag>
          </template>
          <template v-if="column.key === 'tags'">
            {{ record.tags?.join(', ') }}
          </template>
        </template>
      </a-table>

      <a-alert
        v-if="previewData.length > 5"
        :message="t('bulkImport.moreData', { count: previewData.length - 5 })"
        type="info"
        show-icon
        style="margin-top: 16px"
      />

      <a-alert
        v-if="validationErrors.length"
        :message="t('bulkImport.validationError', { count: validationErrors.length })"
        type="error"
        show-icon
        style="margin-top: 16px"
      />
      <a-alert
        v-else
        :message="t('bulkImport.validationSuccess')"
        type="success"
        show-icon
        style="margin-top: 16px"
      />

      <a-space style="margin-top: 24px">
        <a-button @click="resetFile">{{ t('bulkImport.cancel') }}</a-button>
        <a-button
          type="primary"
          :loading="isImporting"
          :disabled="validationErrors.length > 0"
          @click="importData"
        >
          {{ isImporting ? t('bulkImport.importing') : t('bulkImport.importCount', { count: validData.length }) }}
        </a-button>
      </a-space>
    </a-card>

    <a-card v-if="importResult" :title="importResult.success ? t('bulkImport.importSuccess') : t('bulkImport.importPartial')">
      <a-row :gutter="[16, 16]" class="result-stats">
        <a-col :span="8">
          <a-statistic
            :title="t('bulkImport.success')"
            :value="importResult.successCount"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix><CheckCircleOutlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic
            :title="t('bulkImport.skip')"
            :value="importResult.skipCount"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix><ExclamationCircleOutlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic
            :title="t('bulkImport.fail')"
            :value="importResult.failCount"
            :value-style="{ color: '#ff4d4f' }"
          >
            <template #prefix><CloseCircleOutlined /></template>
          </a-statistic>
        </a-col>
      </a-row>

      <a-alert
        v-if="importResult.errors.length"
        :message="t('bulkImport.errorDetails')"
        type="error"
        show-icon
        style="margin-top: 16px"
      >
        <template #description>
          <ul style="margin: 0; padding-left: 20px">
            <li v-for="(error, index) in importResult.errors.slice(0, 5)" :key="index">{{ error }}</li>
            <li v-if="importResult.errors.length > 5">{{ t('bulkImport.moreErrors', { count: importResult.errors.length - 5 }) }}</li>
          </ul>
        </template>
      </a-alert>

      <a-space style="margin-top: 24px">
        <a-button @click="resetImport">{{ t('bulkImport.continueImport') }}</a-button>
        <a-button type="primary" @click="$router.push('/')">{{ t('bulkImport.viewQuestions') }}</a-button>
      </a-space>
    </a-card>

    <a-card :title="t('bulkImport.guideTitle')" style="margin-top: 24px">
      <a-tabs>
        <a-tab-pane key="json" :tab="t('bulkImport.jsonFormat')">
          <pre class="code-block"><code>[{
  "category": "frontend",
  "sectionId": "html-css",
  "question": "What is the box model?",
  "answer": "The CSS box model...",
  "tags": ["must", "frequent"],
  "source": "https://..."
}]</code></pre>
          <a-button type="link" href="/templates/questions-template.json" download>
            <DownloadOutlined />
            {{ t('bulkImport.downloadTemplate', { format: 'JSON' }) }}
          </a-button>
        </a-tab-pane>
        <a-tab-pane key="csv" :tab="t('bulkImport.csvFormat')">
          <pre class="code-block"><code>category,sectionId,question,answer,tags,source
frontend,html-css,What is the box model?,The CSS box model...,must;frequent,https://...</code></pre>
          <a-button type="link" href="/templates/questions-template.csv" download>
            <DownloadOutlined />
            {{ t('bulkImport.downloadTemplate', { format: 'CSV' }) }}
          </a-button>
        </a-tab-pane>
      </a-tabs>

      <a-divider />

      <a-typography-title :level="5">{{ t('bulkImport.tipsTitle') }}</a-typography-title>
      <a-typography-paragraph>
        <ul>
          <li>{{ t('bulkImport.tip1') }}</li>
          <li>{{ t('bulkImport.tip2') }}</li>
          <li>{{ t('bulkImport.tip3', { separator: ';' }) }}</li>
          <li>{{ t('bulkImport.tip4') }}</li>
          <li>{{ t('bulkImport.tip5') }}</li>
        </ul>
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  InboxOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons-vue'
import { ref, computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import type { UploadChangeParam } from 'ant-design-vue'

const i18nStore = useI18nStore()
const t = i18nStore.t

const previewData = ref<any[]>([])
const validationErrors = ref<string[]>([])
const validData = ref<any[]>([])
const isImporting = ref(false)
const importResult = ref<any>(null)

const previewColumns = computed(() => [
  { title: t('bulkImport.category'), dataIndex: 'category', key: 'category' },
  { title: t('bulkImport.section'), dataIndex: 'sectionId', key: 'sectionId' },
  { title: t('bulkImport.question'), dataIndex: 'question', key: 'question', ellipsis: true },
  { title: t('bulkImport.tags'), key: 'tags' },
  { title: t('bulkImport.status'), key: 'status', width: 100 },
])

const handleFileChange = (info: UploadChangeParam) => {
  const file = info.file.originFileObj || info.file
  if (file) {
    processFile(file as File)
  }
}

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files[0]) {
    processFile(e.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  // File processing logic
  console.log('Processing file:', file.name)
  // Mock data for preview
  previewData.value = [
    { category: 'frontend', sectionId: 'html-css', question: 'What is the box model?', tags: ['must'], errors: [] },
    { category: 'frontend', sectionId: 'javascript', question: 'Explain closures', tags: ['frequent'], errors: [] },
  ]
  validData.value = previewData.value
}

const resetFile = () => {
  previewData.value = []
  validationErrors.value = []
  validData.value = []
}

const importData = async () => {
  isImporting.value = true
  // Import logic simulation
  setTimeout(() => {
    importResult.value = {
      success: true,
      successCount: validData.value.length,
      skipCount: 0,
      failCount: 0,
      errors: [],
    }
    isImporting.value = false
  }, 1000)
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
  padding: 0 20px 56px;
}

.upload-section {
  margin-bottom: 24px;
}

:deep(.ant-upload-drag) {
  padding: 40px 0;
}

.result-stats {
  margin: 16px 0;
}

.code-block {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}
</style>

<template>
  <div class="data-sync-page">
    <a-page-header
      :title="t('dataSync.title')"
      :sub-title="t('dataSync.subtitle')"
      @back="() => $router.push('/dashboard')"
    />

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="8">
        <a-card class="sync-card">
          <template #title>
            <a-space>
              <DownloadOutlined />
              {{ t('dataSync.exportTitle') }}
              <a-tag color="blue">{{ t('dataSync.exportBadge') }}</a-tag>
            </a-space>
          </template>

          <a-typography-paragraph type="secondary">
            {{ t('dataSync.exportDesc') }}
          </a-typography-paragraph>

          <a-row :gutter="[8, 8]" class="stats-grid">
            <a-col :span="12">
              <a-statistic
                :title="t('dataSync.questionsTracked')"
                :value="learningStore.totalTrackedQuestions"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic
                :title="t('dataSync.reviewActions')"
                :value="learningStore.totalReviewActions"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic
                :title="t('dataSync.milestonesUnlocked')"
                :value="learningStore.unlockedAchievementCount"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic
                :title="t('dataSync.currentStreak')"
                :value="learningStore.streakDays"
                :suffix="t('common.days')"
              />
            </a-col>
          </a-row>

          <a-button type="primary" block size="large" @click="exportData">
            <DownloadOutlined />
            {{ t('dataSync.downloadBackup') }}
          </a-button>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card class="sync-card">
          <template #title>
            <a-space>
              <UploadOutlined />
              {{ t('dataSync.importTitle') }}
              <a-tag color="green">{{ t('dataSync.importBadge') }}</a-tag>
            </a-space>
          </template>

          <a-typography-paragraph type="secondary">
            {{ t('dataSync.importDesc') }}
          </a-typography-paragraph>

          <a-upload-dragger
            :show-upload-list="false"
            accept=".json"
            @drop="handleDrop"
            @change="handleFileChange"
            class="import-dragger"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">
              {{ selectedFile ? selectedFile.name : t('dataSync.dropzoneText') }}
            </p>
          </a-upload-dragger>

          <a-button
            type="primary"
            block
            size="large"
            :loading="isImporting"
            :disabled="!selectedFile"
            @click="importData"
            style="margin-top: 16px"
          >
            <ReloadOutlined v-if="!isImporting" />
            {{ isImporting ? t('dataSync.importing') : t('dataSync.restoreBackup') }}
          </a-button>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card class="sync-card danger-card">
          <template #title>
            <a-space>
              <DeleteOutlined />
              {{ t('dataSync.resetTitle') }}
              <a-tag color="error">{{ t('dataSync.resetBadge') }}</a-tag>
            </a-space>
          </template>

          <a-typography-paragraph type="secondary">
            {{ t('dataSync.resetDesc') }}
          </a-typography-paragraph>

          <a-alert
            :message="t('dataSync.resetWarning')"
            type="warning"
            show-icon
            style="margin-bottom: 16px"
          />

          <a-button
            danger
            block
            size="large"
            @click="showResetConfirm = true"
          >
            <DeleteOutlined />
            {{ t('dataSync.resetAllData') }}
          </a-button>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      v-model:open="showResetConfirm"
      :title="t('dataSync.confirmReset')"
      :ok-text="t('dataSync.confirm')"
      :cancel-text="t('dataSync.cancel')"
      ok-type="danger"
      @ok="resetData"
    >
      <a-typography-paragraph>
        {{ t('dataSync.resetWarning') }}
      </a-typography-paragraph>
      <a-typography-paragraph>
        <ul>
          <li>{{ t('dataSync.resetItems', { questions: learningStore.totalTrackedQuestions, reviews: learningStore.totalReviewActions, milestones: learningStore.unlockedAchievementCount, streak: learningStore.streakDays }) }}</li>
        </ul>
      </a-typography-paragraph>
      <a-alert
        :message="t('dataSync.cannotUndo')"
        type="error"
        show-icon
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  InboxOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { useI18nStore } from '@/stores/i18n'
import type { UploadChangeParam } from 'ant-design-vue'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const selectedFile = ref<File | null>(null)
const isImporting = ref(false)
const showResetConfirm = ref(false)

const handleFileChange = (info: UploadChangeParam) => {
  const file = info.file.originFileObj || info.file
  if (file) {
    selectedFile.value = file as File
  }
}

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files[0]) {
    selectedFile.value = e.dataTransfer.files[0]
  }
}

const exportData = () => {
  const data = learningStore.exportUserData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `interview-guide-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const importData = async () => {
  if (!selectedFile.value) return

  isImporting.value = true
  try {
    const text = await selectedFile.value.text()
    const data = JSON.parse(text)
    learningStore.importUserData(data)
    selectedFile.value = null
  } catch (error) {
    console.error('Import error:', error)
  } finally {
    isImporting.value = false
  }
}

const resetData = () => {
  learningStore.clearAll()
  showResetConfirm.value = false
}
</script>

<style scoped>
.data-sync-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 56px;
}

.sync-card {
  height: 100%;
}

.danger-card {
  border-color: #ff4d4f;
}

.stats-grid {
  margin-bottom: 16px;
}

.import-dragger {
  margin-top: 16px;
}

:deep(.ant-upload-drag) {
  padding: 24px;
}
</style>

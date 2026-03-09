<template>
  <div class="page-container">
    <header class="page-header">
      <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
      <h1>{{ t('dataSync.title') }}</h1>
      <p>{{ t('dataSync.subtitle') }}</p>
    </header>

    <div class="sync-grid">
      <section class="sync-card">
        <div class="card-header">
          <h2>{{ t('dataSync.exportTitle') }}</h2>
          <span class="badge backup">{{ t('dataSync.exportBadge') }}</span>
        </div>
        <p class="description">{{ t('dataSync.exportDesc') }}</p>

        <div class="stats-grid">
          <div class="stat">
            <span class="stat-value">{{ learningStore.totalTrackedQuestions }}</span>
            <span class="stat-label">{{ t('dataSync.questionsTracked') }}</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ learningStore.totalReviewActions }}</span>
            <span class="stat-label">{{ t('dataSync.reviewActions') }}</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ learningStore.unlockedAchievementCount }}</span>
            <span class="stat-label">{{ t('dataSync.milestonesUnlocked') }}</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ learningStore.streakDays }}</span>
            <span class="stat-label">{{ t('dataSync.currentStreak') }}</span>
          </div>
        </div>

        <button class="btn btn-primary" @click="exportData">
          <PhosphorIcon name="DownloadSimple" class="icon" />
          {{ t('dataSync.downloadBackup') }}
        </button>
      </section>

      <section class="sync-card">
        <div class="card-header">
          <h2>{{ t('dataSync.importTitle') }}</h2>
          <span class="badge restore">{{ t('dataSync.importBadge') }}</span>
        </div>
        <p class="description">{{ t('dataSync.importDesc') }}</p>

        <div
          class="dropzone"
          :class="{ active: isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            style="display: none"
            @change="handleFileSelect"
          />
          <PhosphorIcon name="UploadSimple" class="icon" />
          <p v-if="selectedFile">{{ t('dataSync.selectedFile', { name: selectedFile.name }) }}</p>
          <p v-else>{{ t('dataSync.dropzoneText') }}</p>
        </div>

        <button
          class="btn btn-secondary"
          :disabled="!selectedFile || isImporting"
          @click="importData"
        >
          <PhosphorIcon name="ArrowCounterClockwise" class="icon" />
          {{ isImporting ? t('dataSync.importing') : t('dataSync.restoreBackup') }}
        </button>
      </section>

      <section class="sync-card danger">
        <div class="card-header">
          <h2>{{ t('dataSync.resetTitle') }}</h2>
          <span class="badge danger">{{ t('dataSync.resetBadge') }}</span>
        </div>
        <p class="description">{{ t('dataSync.resetDesc') }}</p>

        <button class="btn btn-danger" @click="showResetConfirm = true">
          <PhosphorIcon name="Trash" class="icon" />
          {{ t('dataSync.resetAllData') }}
        </button>
      </section>
    </div>

    <Teleport to="body">
      <div v-if="showResetConfirm" class="modal-overlay" @click="showResetConfirm = false">
        <div class="modal" @click.stop>
          <h3>{{ t('dataSync.confirmReset') }}</h3>
          <p>{{ t('dataSync.resetWarning') }}</p>
          <ul>
            <li>{{ t('dataSync.resetItems', { questions: learningStore.totalTrackedQuestions, reviews: learningStore.totalReviewActions, milestones: learningStore.unlockedAchievementCount, streak: learningStore.streakDays }) }}</li>
          </ul>
          <p class="warning">{{ t('dataSync.cannotUndo') }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="showResetConfirm = false">
              {{ t('dataSync.cancel') }}
            </button>
            <button class="btn btn-danger" @click="resetData">
              {{ t('dataSync.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { useI18nStore } from '@/stores/i18n'
import PhosphorIcon from '@/components/PhosphorIcon.vue'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const isImporting = ref(false)
const showResetConfirm = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files[0]) {
    selectedFile.value = event.dataTransfer.files[0]
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
  alert(t('dataSync.exportSuccess'))
}

const importData = async () => {
  if (!selectedFile.value) return

  isImporting.value = true
  try {
    const text = await selectedFile.value.text()
    const data = JSON.parse(text)
    learningStore.importUserData(data)
    alert(t('dataSync.importSuccess'))
    selectedFile.value = null
  } catch (error) {
    alert(t('dataSync.importError'))
  } finally {
    isImporting.value = false
  }
}

const resetData = () => {
  learningStore.clearAll()
  showResetConfirm.value = false
  alert(t('dataSync.resetSuccess'))
}
</script>

<style scoped>
.page-container {
  max-width: 900px;
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

.sync-grid {
  display: grid;
  gap: 1.5rem;
}

.sync-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.sync-card.danger {
  border-color: #ef4444;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.backup {
  background: #dbeafe;
  color: #1e40af;
}

.badge.restore {
  background: #d1fae5;
  color: #065f46;
}

.badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
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
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--primary-color);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.dropzone {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.dropzone:hover,
.dropzone.active {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.05);
}

.dropzone .icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  max-width: 450px;
  width: 90%;
}

.modal h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.modal p {
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.modal ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.modal li {
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.modal .warning {
  color: #ef4444;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

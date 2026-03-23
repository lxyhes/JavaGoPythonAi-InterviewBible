<template>
  <div class="countdown-wrapper" v-if="store.countdown || showSetup">
    <!-- 已设定倒计时 -->
    <div v-if="store.countdown && !editing" class="countdown-card" :class="urgencyClass">
      <div class="countdown-left">
        <div class="countdown-days">
          <span class="days-number">{{ store.daysUntilInterview }}</span>
          <span class="days-label">天</span>
        </div>
        <div class="countdown-info">
          <p class="countdown-title">
            <PhosphorIcon name="buildings" :size="16" weight="fill" />
            {{ store.countdown.targetCompany }}
            <span class="position-tag">{{ store.countdown.targetPosition }}</span>
          </p>
          <p class="countdown-date">
            <PhosphorIcon name="calendar" :size="14" />
            {{ formatDate(store.countdown.targetDate) }}
          </p>
        </div>
      </div>
      <div class="countdown-actions">
        <button type="button" class="icon-btn" @click="editing = true" title="编辑">
          <PhosphorIcon name="pencil-simple" :size="16" />
        </button>
        <button type="button" class="icon-btn danger" @click="handleClear" title="清除">
          <PhosphorIcon name="trash" :size="16" />
        </button>
      </div>
    </div>

    <!-- 设置/编辑表单 -->
    <div v-if="!store.countdown || editing" class="setup-card">
      <div class="setup-header" v-if="!store.countdown && !showSetup">
        <button type="button" class="setup-trigger" @click="showSetup = true">
          <PhosphorIcon name="calendar-plus" :size="20" />
          设置面试倒计时
          <PhosphorIcon name="caret-right" :size="16" />
        </button>
      </div>
      <div v-if="showSetup || editing" class="setup-form">
        <h4 class="setup-title">
          <PhosphorIcon name="target" :size="18" weight="fill" />
          {{ editing ? '编辑面试目标' : '设定面试目标' }}
        </h4>
        <div class="form-row">
          <div class="form-field">
            <label>目标公司</label>
            <input
              v-model="formData.company"
              type="text"
              placeholder="如：字节跳动"
              class="form-input"
            />
          </div>
          <div class="form-field">
            <label>目标岗位</label>
            <input
              v-model="formData.position"
              type="text"
              placeholder="如：高级前端工程师"
              class="form-input"
            />
          </div>
        </div>
        <div class="form-field">
          <label>面试日期</label>
          <input
            v-model="formData.date"
            type="date"
            class="form-input"
            :min="minDate"
          />
        </div>
        <div class="setup-actions">
          <button type="button" class="save-btn" @click="handleSave" :disabled="!isFormValid">
            <PhosphorIcon name="check" :size="16" />
            保存
          </button>
          <button type="button" class="cancel-btn" @click="handleCancel">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 学习建议（基于倒计时） -->
    <div v-if="store.countdown && !editing && store.daysUntilInterview !== null" class="recommendation">
      <PhosphorIcon name="lightbulb" :size="16" weight="fill" />
      <span>{{ recommendationText }}</span>
    </div>
  </div>
  <div v-else class="countdown-trigger-simple">
    <button type="button" class="setup-trigger-mini" @click="showSetup = true">
      <PhosphorIcon name="calendar-plus" :size="18" />
      设置面试倒计时，让学习更有目标感
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import PhosphorIcon from '@/components/PhosphorIcon.vue'
import { useMockInterviewStore } from '@/stores/mockInterview'

const store = useMockInterviewStore()
const showSetup = ref(false)
const editing = ref(false)

const formData = reactive({
  company: '',
  position: '',
  date: '',
})

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return formData.company.trim() && formData.position.trim() && formData.date
})

const urgencyClass = computed(() => {
  const days = store.daysUntilInterview
  if (days === null) return ''
  if (days <= 3) return 'urgent'
  if (days <= 7) return 'soon'
  if (days <= 14) return 'moderate'
  return 'relaxed'
})

const recommendationText = computed(() => {
  const days = store.daysUntilInterview
  if (days === null) return ''
  if (days === 0) return '今天就是面试日！检查准备清单，保持冷静和自信 💪'
  if (days <= 3) return `仅剩 ${days} 天！专注复习高频题和薄弱项，避免新知识。`
  if (days <= 7) return `${days} 天后面试，建议每天做一次模拟面试，重点复习核心知识点。`
  if (days <= 14) return `还有 ${days} 天，保持每日练习节奏，逐步攻克各个知识模块。`
  if (days <= 30) return `距离面试还有 ${days} 天，时间充裕，制定系统化学习计划。`
  return `距离面试还有 ${days} 天，从基础开始，建立完整的知识体系。`
})

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function handleSave() {
  if (!isFormValid.value) return

  store.setCountdown({
    targetDate: formData.date,
    targetCompany: formData.company.trim(),
    targetPosition: formData.position.trim(),
    createdAt: new Date().toISOString(),
  })

  editing.value = false
  showSetup.value = false
}

function handleCancel() {
  editing.value = false
  if (!store.countdown) {
    showSetup.value = false
  }
}

function handleClear() {
  if (confirm('确定删除面试倒计时吗？')) {
    store.clearCountdown()
    editing.value = false
  }
}

onMounted(() => {
  if (store.countdown) {
    formData.company = store.countdown.targetCompany
    formData.position = store.countdown.targetPosition
    formData.date = store.countdown.targetDate
  }
})
</script>

<style scoped>
.countdown-wrapper {
  margin-bottom: 24px;
}

.countdown-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  transition: all 0.3s ease;
}

.countdown-card.urgent {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.04) 100%);
  border-color: rgba(239, 68, 68, 0.3);
}

.countdown-card.soon {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%);
  border-color: rgba(245, 158, 11, 0.3);
}

.countdown-card.moderate {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%);
  border-color: rgba(59, 130, 246, 0.3);
}

.countdown-card.relaxed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%);
  border-color: rgba(16, 185, 129, 0.3);
}

.countdown-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.countdown-days {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.days-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-variant-numeric: tabular-nums;
}

.urgent .days-number {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  background-clip: text;
}

.soon .days-number {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  -webkit-background-clip: text;
  background-clip: text;
}

.days-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.countdown-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.countdown-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.position-tag {
  font-size: 0.78rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-600);
  font-weight: 500;
}

.countdown-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.84rem;
  color: var(--text-tertiary);
  margin: 0;
}

.countdown-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: var(--primary-400);
  color: var(--primary-500);
}

.icon-btn.danger:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* 设置表单 */
.setup-card {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.setup-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.setup-trigger:hover {
  background: rgba(99, 102, 241, 0.04);
  color: var(--primary-600);
}

.setup-form {
  padding: 20px;
  background: var(--card-bg);
}

.setup-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  margin: 0 0 16px;
  color: var(--primary-600);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.form-field label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input {
  padding: 10px 14px;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-400);
}

.setup-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: var(--gradient-primary);
  color: white;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  border-color: var(--text-muted);
}

/* 建议提示 */
.recommendation {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.12);
  font-size: 0.86rem;
  color: var(--primary-600);
}

.recommendation :deep(svg) {
  flex-shrink: 0;
  color: var(--primary-500);
}

/* 简洁触发按钮 */
.countdown-trigger-simple {
  margin-bottom: 16px;
}

.setup-trigger-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  border: 1.5px dashed var(--border-color);
  border-radius: 14px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.setup-trigger-mini:hover {
  border-color: var(--primary-300);
  color: var(--primary-500);
  background: rgba(99, 102, 241, 0.03);
}

@media (max-width: 640px) {
  .countdown-card {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .countdown-actions {
    align-self: flex-end;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .days-number {
    font-size: 2rem;
  }
}
</style>

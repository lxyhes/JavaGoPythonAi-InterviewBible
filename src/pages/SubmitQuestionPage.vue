<template>
  <div class="submit-page">
    <a-page-header
      :title="t('submitQuestion.title')"
      :sub-title="t('submitQuestion.subtitle')"
      @back="() => $router.push('/dashboard')"
    />

    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="16">
        <a-card>
          <a-form
            :model="form"
            layout="vertical"
            @finish="handleSubmit"
          >
            <a-form-item
              :label="t('submitQuestion.category')"
              name="category"
              :rules="[{ required: true, message: t('submitQuestion.selectCategory') }]"
            >
              <a-select v-model:value="form.category" :placeholder="t('submitQuestion.selectCategory')">
                <a-select-option value="frontend">{{ t('common.categories.frontend') }}</a-select-option>
                <a-select-option value="backend">{{ t('common.categories.backend') }}</a-select-option>
                <a-select-option value="database">{{ t('common.categories.database') }}</a-select-option>
                <a-select-option value="algorithm">{{ t('common.categories.algorithm') }}</a-select-option>
                <a-select-option value="system-design">{{ t('common.categories.system-design') }}</a-select-option>
                <a-select-option value="devops">{{ t('common.categories.devops') }}</a-select-option>
                <a-select-option value="network">{{ t('common.categories.network') }}</a-select-option>
                <a-select-option value="os">{{ t('common.categories.os') }}</a-select-option>
                <a-select-option value="ai">{{ t('common.categories.ai') }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              :label="t('submitQuestion.sectionId')"
              name="sectionId"
              :rules="[{ required: true, message: t('submitQuestion.sectionPlaceholder') }]"
            >
              <a-input
                v-model:value="form.sectionId"
                :placeholder="t('submitQuestion.sectionPlaceholder')"
              />
              <template #extra>
                {{ t('submitQuestion.sectionHint') }}
              </template>
            </a-form-item>

            <a-form-item
              :label="t('submitQuestion.question')"
              name="question"
              :rules="[{ required: true, message: t('submitQuestion.questionPlaceholder') }]"
            >
              <a-textarea
                v-model:value="form.question"
                :rows="3"
                :placeholder="t('submitQuestion.questionPlaceholder')"
              />
            </a-form-item>

            <a-form-item
              :label="t('submitQuestion.answer')"
              name="answer"
              :rules="[{ required: true, message: t('submitQuestion.answerPlaceholder') }]"
            >
              <a-textarea
                v-model:value="form.answer"
                :rows="10"
                :placeholder="t('submitQuestion.answerPlaceholder')"
              />
              <template #extra>
                {{ t('submitQuestion.answerHint') }}
              </template>
            </a-form-item>

            <a-form-item :label="t('submitQuestion.tags')">
              <a-checkbox-group v-model:value="form.tags">
                <a-checkbox v-for="tag in availableTags" :key="tag" :value="tag">
                  <a-tag :color="tagColorMap[tag]">{{ tagLabelMap[tag] }}</a-tag>
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>

            <a-form-item :label="t('submitQuestion.source')">
              <a-input
                v-model:value="form.source"
                type="url"
                :placeholder="t('submitQuestion.sourcePlaceholder')"
              />
              <template #extra>
                {{ t('submitQuestion.sourceHint') }}
              </template>
            </a-form-item>

            <a-form-item>
              <a-space>
                <a-button @click="resetForm">{{ t('submitQuestion.reset') }}</a-button>
                <a-button type="primary" html-type="submit" :loading="isSubmitting">
                  {{ isSubmitting ? t('submitQuestion.submitting') : t('submitQuestion.submit') }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card :title="t('submitQuestion.tipsTitle')">
          <a-typography-paragraph>
            <ul>
              <li>{{ t('submitQuestion.tip1') }}</li>
              <li>{{ t('submitQuestion.tip2') }}</li>
              <li>{{ t('submitQuestion.tip3') }}</li>
              <li>{{ t('submitQuestion.tip4') }}</li>
            </ul>
          </a-typography-paragraph>
        </a-card>
      </a-col>
    </a-row>
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

const tagColorMap: Record<string, string> = {
  must: 'red',
  frequent: 'green',
  important: 'orange',
}

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
  setTimeout(() => {
    isSubmitting.value = false
    resetForm()
  }, 1000)
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 56px;
}
</style>

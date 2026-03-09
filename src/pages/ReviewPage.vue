<template>
  <div class="review-page">
    <a-page-header
      :title="t('review.title')"
      :sub-title="t('review.desc')"
      @back="() => $router.push('/dashboard')"
    >
      <template #extra>
        <a-space>
          <a-tag v-if="dueItems.length" color="red">
            <ClockCircleOutlined /> {{ t('review.dueToday') }}: {{ dueItems.length }}
          </a-tag>
          <a-tag color="blue">
            <CheckCircleOutlined /> {{ t('review.reviewedToday') }}: {{ learningStore.reviewedTodayCount }}
          </a-tag>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="[16, 16]" class="summary-row">
      <a-col :xs="24" :sm="8">
        <a-card class="stat-card">
          <a-statistic
            :title="t('review.dueToday')"
            :value="dueItems.length"
            :value-style="{ color: dueItems.length ? '#cf1322' : '#52c41a' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card class="stat-card">
          <a-statistic
            :title="t('review.reviewedToday')"
            :value="learningStore.reviewedTodayCount"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card class="action-card" :bordered="false">
          <a-button
            type="primary"
            size="large"
            block
            :disabled="!dueItems.length"
            @click="startReviewPractice"
          >
            <PlayCircleOutlined />
            {{ t('review.startReview') }}
          </a-button>
        </a-card>
      </a-col>
    </a-row>

    <a-list
      v-if="dueItems.length"
      :data-source="dueItems"
      :pagination="{ pageSize: 10 }"
      class="review-list"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card class="review-item-card" :bordered="true">
            <a-space direction="vertical" style="width: 100%">
              <a-space>
                <a-tag color="blue">{{ categoryLabel(item.category) }}</a-tag>
                <a-tag>{{ item.sectionTitle }}</a-tag>
              </a-space>

              <h3 class="question-title">{{ item.question }}</h3>

              <a-typography-text type="secondary">
                <ClockCircleOutlined />
                {{ t('review.dueTime', { time: formatDueTime(item.id) }) }}
              </a-typography-text>

              <a-divider style="margin: 12px 0" />

              <a-space wrap>
                <a-button @click="goToSource(item.path, item.anchor)">
                  <FileTextOutlined />
                  {{ t('review.source') }}
                </a-button>
                <a-button type="dashed" danger @click="quickMark(item.id, 'unknown')">
                  <CloseCircleOutlined />
                  {{ t('common.mastery.unknown') }}
                </a-button>
                <a-button type="dashed" style="color: #d97706; border-color: #d97706" @click="quickMark(item.id, 'vague')">
                  <QuestionCircleOutlined />
                  {{ t('common.mastery.vague') }}
                </a-button>
                <a-button type="dashed" style="color: #059669; border-color: #059669" @click="quickMark(item.id, 'mastered')">
                  <CheckCircleOutlined />
                  {{ t('common.mastery.mastered') }}
                </a-button>
              </a-space>
            </a-space>
          </a-card>
        </a-list-item>
      </template>
    </a-list>

    <a-empty
      v-else
      :description="t('review.empty')"
      class="empty-state"
    >
      <template #image>
        <CheckCircleOutlined style="font-size: 64px; color: #52c41a" />
      </template>
      <a-button type="primary" @click="$router.push('/practice')">
        <PlayCircleOutlined />
        {{ t('review.goPractice') }}
      </a-button>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import type { SearchCategory, SearchItem } from '@/types/search'
import type { MasteryLevel } from '@/stores/learning'
import { useLearningStore } from '@/stores/learning'

const router = useRouter()
const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const itemMap = new Map(searchItems.map((item) => [item.id, item]))

const categoryLabel = (category: SearchCategory) => t(`common.categories.${category}`)

const dueItems = computed<SearchItem[]>(() =>
  learningStore.reviewQueueIds
    .map((id) => itemMap.get(id))
    .filter((item): item is SearchItem => Boolean(item))
)

const formatDueTime = (questionId: string) => {
  const record = learningStore.getRecord(questionId)
  return record
    ? new Date(record.nextReviewAt).toLocaleString(
        i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US'
      )
    : '-'
}

const quickMark = (questionId: string, mastery: MasteryLevel) => {
  learningStore.markMastery(questionId, mastery)
}

const goToSource = (path: string, anchor: string) => {
  void router.push({ path, hash: `#${anchor}` })
}

const startReviewPractice = () => {
  void router.push({ path: '/practice', query: { mode: 'review' } })
}
</script>

<style scoped>
.review-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 56px;
}

.summary-row {
  margin-bottom: 24px;
}

.stat-card,
.action-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.action-card {
  background: transparent;
}

.review-list {
  margin-top: 16px;
}

.review-item-card {
  width: 100%;
  transition: all 0.3s;
}

.review-item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
}

.empty-state {
  margin-top: 60px;
}

:deep(.ant-list-item) {
  padding: 8px 0;
}

:deep(.ant-statistic-content) {
  font-size: 1.8rem;
}
</style>

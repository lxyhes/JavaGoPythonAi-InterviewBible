<template>
  <div class="dashboard-page">
    <!-- 页面头部 - 固定在顶部 -->
    <div class="sticky-header">
      <a-page-header
        :title="t('dashboard.title')"
        sub-title="查看你的学习统计和进度"
        @back="() => $router.push('/practice')"
      >
        <template #extra>
          <a-button type="primary" @click="$router.push('/data-sync')">
            <template #icon><SaveOutlined /></template>
            数据同步
          </a-button>
        </template>
      </a-page-header>
    </div>

    <!-- 核心统计卡片 -->
    <a-row :gutter="[16, 16]" class="stats-row">
      <!-- 等级卡片 -->
      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="stat-card level-card">
          <div class="level-content">
            <a-progress
              type="circle"
              :percent="learningStore.levelProgressRate"
              :width="80"
              :stroke-width="8"
              :format="() => `Lv.${learningStore.level}`"
            />
            <div class="level-info">
              <div class="level-value">{{ learningStore.totalXp }} XP</div>
              <div class="level-desc">
                距离 Lv.{{ learningStore.level + 1 }} 还需 {{ learningStore.nextLevelRequiredXp - learningStore.currentLevelXp }} XP
              </div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 已掌握题目 -->
      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="stat-card">
          <a-statistic
            title="已掌握题目"
            :value="learningStore.masteredQuestionCount"
            suffix="道"
          >
            <template #prefix><CheckCircleOutlined style="color: #52c41a" /></template>
          </a-statistic>
        </a-card>
      </a-col>

      <!-- 连续学习 -->
      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="stat-card">
          <a-statistic
            title="连续学习"
            :value="learningStore.streakDays"
            suffix="天"
          >
            <template #prefix><FireOutlined style="color: #ff4d4f" /></template>
          </a-statistic>
        </a-card>
      </a-col>

      <!-- 总复习次数 -->
      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="stat-card">
          <a-statistic
            title="总复习次数"
            :value="learningStore.totalReviewActions"
            suffix="次"
          >
            <template #prefix><ReloadOutlined style="color: #722ed1" /></template>
          </a-statistic>
        </a-card>
      </a-col>

      <!-- 今日目标 -->
      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="stat-card">
          <a-statistic
            title="今日目标"
            :value="learningStore.dailyGoalProgress"
            :suffix="`/ ${learningStore.dailyGoalTarget}`"
          >
            <template #prefix><AimOutlined style="color: #13c2c2" /></template>
          </a-statistic>
          <a-progress
            :percent="Math.round((learningStore.dailyGoalProgress / learningStore.dailyGoalTarget) * 100)"
            size="small"
            :status="learningStore.dailyGoalDone ? 'success' : 'active'"
          />
        </a-card>
      </a-col>

      <!-- 薄弱题目 -->
      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="stat-card">
          <a-statistic
            title="薄弱题目"
            :value="learningStore.weakQuestionCount"
            suffix="道需加强"
          >
            <template #prefix><WarningOutlined style="color: #faad14" /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 主要内容区 -->
    <CompetitivenessPanel />

    <a-row :gutter="[16, 16]" class="main-content">
      <!-- 左侧：活动图表和分类进度 -->
      <a-col :xs="24" :lg="16">
        <!-- 最近7天活动 -->
        <a-card title="最近7天学习活动" class="panel-card">
          <template #extra><BarChartOutlined /></template>
          <div class="activity-chart">
            <div
              v-for="item in learningStore.weeklyActivity"
              :key="item.date"
              class="activity-bar-wrapper"
            >
              <a-tooltip :title="`${item.date}: ${item.count} 题`">
                <div class="activity-bar-track">
                  <div
                    class="activity-bar"
                    :style="{ height: `${barHeight(item.count)}%` }"
                  ></div>
                </div>
              </a-tooltip>
              <span class="activity-date">{{ toShortDate(item.date) }}</span>
              <span class="activity-count">{{ item.count }}</span>
            </div>
          </div>
        </a-card>

        <!-- 分类掌握度 -->
        <a-card title="分类掌握度" class="panel-card">
          <template #extra><BookOutlined /></template>
          <div class="category-list">
            <div v-for="item in categoryStats" :key="item.category" class="category-item">
              <div class="category-info">
                <span class="category-name">{{ item.label }}</span>
                <span class="category-count">{{ item.mastered }}/{{ item.total }}</span>
              </div>
              <a-progress
                :percent="item.rate"
                :stroke-color="getProgressColor(item.rate)"
                size="small"
              />
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧：成就 -->
      <a-col :xs="24" :lg="8">
        <a-card title="成就" class="panel-card achievements-card">
          <template #extra>
            <a-badge
              :count="learningStore.unlockedAchievementCount"
              :overflow-count="99"
              show-zero
            />
            <span style="margin-left: 8px; color: #999;">/ {{ learningStore.achievements.length }}</span>
          </template>
          <a-list
            :data-source="learningStore.achievements"
            :split="false"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item :class="['achievement-item', { unlocked: item.unlocked }]">
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar
                      :style="{
                        backgroundColor: item.unlocked ? '#52c41a' : '#d9d9d9',
                      }"
                    >
                      <template v-if="item.unlocked"><TrophyOutlined /></template>
                      <template v-else><LockOutlined /></template>
                    </a-avatar>
                  </template>
                  <template #title>{{ item.title }}</template>
                  <template #description>{{ item.description }}</template>
                </a-list-item-meta>
                <template v-if="item.unlocked">
                  <a-tag color="success">已解锁</a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  SaveOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ReloadOutlined,
  AimOutlined,
  WarningOutlined,
  BarChartOutlined,
  BookOutlined,
  TrophyOutlined,
  LockOutlined,
} from '@ant-design/icons-vue'
import CompetitivenessPanel from '@/components/CompetitivenessPanel.vue'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import { useLearningStore } from '@/stores/learning'
import type { SearchCategory } from '@/types/search'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const categoryStats = computed(() => {
  const totals = new Map<SearchCategory, number>()
  const mastered = new Map<SearchCategory, number>()

  for (const item of searchItems) {
    totals.set(item.category, (totals.get(item.category) ?? 0) + 1)
    const record = learningStore.records[item.id]
    if (record?.mastery === 'mastered') {
      mastered.set(item.category, (mastered.get(item.category) ?? 0) + 1)
    }
  }

  return Array.from(totals.entries())
    .map(([category, total]) => {
      const masteredCount = mastered.get(category) ?? 0
      const rate = total ? Math.round((masteredCount / total) * 100) : 0
      return {
        category,
        label: t(`common.categories.${category}`),
        total,
        mastered: masteredCount,
        rate,
      }
    })
    .sort((a, b) => b.rate - a.rate)
})

const maxWeeklyCount = computed(() => Math.max(1, ...learningStore.weeklyActivity.map((item) => item.count)))
const barHeight = (count: number) => Math.max(8, Math.round((count / maxWeeklyCount.value) * 100))
const toShortDate = (value: string) => value.slice(5)

const getProgressColor = (rate: number) => {
  if (rate >= 80) return '#52c41a'
  if (rate >= 50) return '#13c2c2'
  if (rate >= 20) return '#faad14'
  return '#ff4d4f'
}
</script>

<style scoped>
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.sticky-header :deep(.ant-page-header) {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  height: 100%;
}

.stat-card :deep(.ant-statistic-title) {
  font-size: 14px;
  color: #666;
}

.stat-card :deep(.ant-statistic-content) {
  font-size: 24px;
  font-weight: 600;
}

.level-card :deep(.ant-card-body) {
  padding: 16px;
}

.level-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.level-info {
  flex: 1;
}

.level-value {
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
}

.level-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.main-content {
  margin-top: 8px;
}

.panel-card {
  margin-bottom: 16px;
}

.panel-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.panel-card :deep(.ant-card-head-title) {
  color: white;
}

.panel-card :deep(.ant-card-extra) {
  color: white;
}

/* 活动图表 */
.activity-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  height: 200px;
  padding: 20px 0;
}

.activity-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.activity-bar-track {
  width: 100%;
  height: 140px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.activity-bar {
  width: 100%;
  background: linear-gradient(180deg, #1890ff 0%, #096dd9 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  min-height: 4px;
}

.activity-date {
  font-size: 12px;
  color: #999;
}

.activity-count {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* 分类列表 */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
}

.category-count {
  font-size: 12px;
  color: #999;
}

/* 成就列表 */
.achievements-card :deep(.ant-card-body) {
  padding: 0;
  max-height: 500px;
  overflow-y: auto;
}

.achievement-item {
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.achievement-item.unlocked {
  background: rgba(82, 196, 26, 0.05);
}

.achievement-item :deep(.ant-list-item-meta-title) {
  font-size: 14px;
  font-weight: 500;
}

.achievement-item :deep(.ant-list-item-meta-description) {
  font-size: 12px;
}
</style>

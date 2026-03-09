<template>
  <div class="leaderboard-page">
    <a-page-header
      :title="t('leaderboard.title')"
      :sub-title="t('leaderboard.subtitle')"
      @back="() => $router.push('/dashboard')"
    />

    <a-segmented
      v-model:value="currentType"
      :options="typeTabOptions"
      class="type-tabs"
      block
    />

    <a-row :gutter="[16, 16]" class="top-three-section">
      <a-col v-for="(user, index) in topThree" :key="user.userId" :xs="24" :sm="8">
        <a-card
          class="top-user-card"
          :class="`rank-${index + 1}`"
          :bordered="true"
        >
          <a-space direction="vertical" align="center" style="width: 100%">
            <a-badge
              :count="index + 1"
              :number-style="{
                backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                color: index === 2 ? '#fff' : '#000',
                fontWeight: 'bold',
              }"
            />
            <a-avatar
              :size="64"
              :style="{ background: getTierColor(getRankTier(index + 1)) }"
            >
              {{ user.userName[0] }}
            </a-avatar>
            <a-typography-title :level="5" style="margin: 0">{{ user.userName }}</a-typography-title>
            <a-tag color="blue">Lv.{{ user.level }}</a-tag>
            <a-typography-text strong style="font-size: 1.2rem; color: var(--primary-color)">
              {{ formatScore(user) }}
            </a-typography-text>
            <a-tag :color="getTierColor(getRankTier(index + 1))">
              {{ getTierLabel(getRankTier(index + 1)) }}
            </a-tag>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="leaderboard-list" :title="leaderboardTitle">
      <template #extra>
        <a-typography-text type="secondary">{{ leaderboardDescription }}</a-typography-text>
      </template>

      <a-list :data-source="leaderboardEntries">
        <template #renderItem="{ item }">
          <a-list-item
            :class="{ 'is-current-user': item.userId === 'current-user' }"
          >
            <a-space style="width: 100%" align="center">
              <a-avatar
                :size="32"
                :style="{
                  background: getTierColor(getRankTier(item.rank ?? 0)),
                  color: '#fff',
                }"
              >
                {{ item.rank }}
              </a-avatar>

              <a-avatar
                :size="40"
                :style="{ background: getTierColor(getRankTier(item.rank ?? 0)) }"
              >
                {{ item.userName[0] }}
              </a-avatar>

              <a-space direction="vertical" size="small" style="flex: 1">
                <a-typography-text strong>{{ item.userName }}</a-typography-text>
                <a-tag size="small">Lv.{{ item.level }}</a-tag>
              </a-space>

              <a-space>
                <a-typography-text
                  v-if="item.trend === 'up'"
                  type="success"
                >
                  <ArrowUpOutlined /> {{ item.change }}
                </a-typography-text>
                <a-typography-text
                  v-else-if="item.trend === 'down'"
                  type="danger"
                >
                  <ArrowDownOutlined /> {{ item.change }}
                </a-typography-text>
                <a-typography-text v-else type="secondary">-</a-typography-text>
              </a-space>

              <a-typography-text strong style="color: var(--primary-color); min-width: 80px; text-align: right">
                {{ formatScore(item) }}
              </a-typography-text>
            </a-space>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <a-card v-if="currentUserRank > 0" class="my-rank-section" :bordered="false">
      <template #title>
        <TrophyOutlined /> {{ t('leaderboard.myRank') }}
      </template>
      <a-space align="center" size="large">
        <a-avatar
          :size="48"
          :style="{
            background: getTierColor(getRankTier(currentUserRank)),
            color: '#fff',
          }"
        >
          {{ currentUserRank }}
        </a-avatar>
        <a-space direction="vertical" size="small">
          <a-tag :color="getTierColor(getRankTier(currentUserRank))">
            {{ getTierLabel(getRankTier(currentUserRank)) }}
          </a-tag>
          <a-typography-text type="secondary">{{ t('leaderboard.keepGoing') }}</a-typography-text>
        </a-space>
        <a-typography-title :level="4" style="margin: 0; margin-left: auto">
          {{ formatScore(getCurrentUserEntry()) }}
        </a-typography-title>
      </a-space>
    </a-card>

    <a-space direction="vertical" align="center" class="refresh-section">
      <a-button @click="refresh">
        <ReloadOutlined />
        {{ t('leaderboard.refresh') }}
      </a-button>
      <a-typography-text type="secondary">
        {{ t('leaderboard.lastUpdated', { time: formatTime(lastUpdated) }) }}
      </a-typography-text>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  ReloadOutlined,
  StarFilled,
  FireFilled,
  CheckCircleFilled,
  CalendarFilled,
} from '@ant-design/icons-vue'
import { ref, computed, h } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useLeaderboardStore, type LeaderboardType } from '@/stores/leaderboard'
import type { LeaderboardEntry } from '@/stores/leaderboard'

const i18nStore = useI18nStore()
const leaderboardStore = useLeaderboardStore()
const t = i18nStore.t

const currentType = ref<LeaderboardType>('xp')
const lastUpdated = ref(leaderboardStore.lastUpdated)

const typeTabOptions = computed(() => [
  { value: 'xp', label: h('span', null, [h(StarFilled), ' ', t('leaderboard.tabXp')]) },
  { value: 'streak', label: h('span', null, [h(FireFilled), ' ', t('leaderboard.tabStreak')]) },
  { value: 'mastered', label: h('span', null, [h(CheckCircleFilled), ' ', t('leaderboard.tabMastered')]) },
  { value: 'weekly', label: h('span', null, [h(CalendarFilled), ' ', t('leaderboard.tabWeekly')]) },
])

const leaderboardEntries = computed(() => leaderboardStore.getLeaderboardByType(currentType.value))
const topThree = computed(() => leaderboardStore.topThree(currentType.value))
const currentUserRank = computed(() => leaderboardStore.currentUserRank(currentType.value))
const leaderboardTitle = computed(() => leaderboardStore.getLeaderboardTitle(currentType.value))
const leaderboardDescription = computed(() => leaderboardStore.getLeaderboardDescription(currentType.value))

const { getRankTier, getTierColor, getTierLabel } = leaderboardStore

const getCurrentUserEntry = (): LeaderboardEntry => {
  return leaderboardEntries.value.find(e => e.userId === 'current-user') ?? {
    userId: 'current-user',
    userName: '我',
    level: 1,
    totalXp: 0,
    streakDays: 0,
    masteredCount: 0,
    weeklyReviews: 0,
    rank: 0,
  }
}

const formatScore = (entry: LeaderboardEntry) => {
  switch (currentType.value) {
    case 'xp':
      return `${entry.totalXp} XP`
    case 'streak':
      return `${entry.streakDays} ${t('common.days')}`
    case 'mastered':
      return `${entry.masteredCount} ${t('leaderboard.questions')}`
    case 'weekly':
      return `${entry.weeklyReviews} ${t('leaderboard.reviews')}`
    default:
      return ''
  }
}

const formatTime = (value: string) => {
  const date = new Date(value)
  return date.toLocaleString(i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const refresh = () => {
  leaderboardStore.refreshLeaderboard()
  lastUpdated.value = leaderboardStore.lastUpdated
}
</script>

<style scoped>
.leaderboard-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px 56px;
}

.type-tabs {
  margin: 16px 0 24px;
}

.top-three-section {
  margin-bottom: 24px;
}

.top-user-card {
  text-align: center;
  transition: all 0.3s;
}

.top-user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.top-user-card.rank-1 {
  border-color: #ffd700;
  transform: scale(1.02);
}

.top-user-card.rank-2 {
  border-color: #c0c0c0;
}

.top-user-card.rank-3 {
  border-color: #cd7f32;
}

.leaderboard-list {
  margin-bottom: 24px;
}

.my-rank-section {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.my-rank-section :deep(.ant-card-head) {
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.refresh-section {
  width: 100%;
  margin-top: 24px;
}

.is-current-user {
  background: rgba(99, 102, 241, 0.1);
  border-radius: 8px;
}

:deep(.ant-list-item) {
  padding: 12px 16px;
  transition: background 0.2s;
}

:deep(.ant-list-item:hover) {
  background: var(--bg-secondary);
}

@media (max-width: 640px) {
  .top-user-card.rank-1 {
    transform: none;
  }
}
</style>

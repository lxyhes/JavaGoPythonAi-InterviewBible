<template>
  <div class="leaderboard-page">
    <header class="header">
      <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
      <h1>{{ t('leaderboard.title') }}</h1>
      <p>{{ t('leaderboard.subtitle') }}</p>
    </header>

    <div class="type-tabs">
      <button
        v-for="tab in typeTabs"
        :key="tab.value"
        :class="['type-tab', { active: currentType === tab.value }]"
        @click="currentType = tab.value"
      >
        <PhosphorIcon :name="tab.icon" class="tab-icon" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <section class="top-three-section">
      <div class="top-three">
        <div
          v-for="(user, index) in topThree"
          :key="user.userId"
          :class="['top-user', `rank-${index + 1}`]"
        >
          <div class="rank-badge">{{ index + 1 }}</div>
          <div class="user-avatar" :style="{ background: getTierColor(getRankTier(index + 1)) }">
            {{ user.userName[0] }}
          </div>
          <div class="user-name">{{ user.userName }}</div>
          <div class="user-level">Lv.{{ user.level }}</div>
          <div class="user-score">{{ formatScore(user) }}</div>
          <div class="tier-badge" :style="{ background: getTierColor(getRankTier(index + 1)) }">
            {{ getTierLabel(getRankTier(index + 1)) }}
          </div>
        </div>
      </div>
    </section>

    <section class="leaderboard-list">
      <div class="list-header">
        <h2>{{ leaderboardTitle }}</h2>
        <p>{{ leaderboardDescription }}</p>
      </div>

      <div class="list-content">
        <div
          v-for="entry in leaderboardEntries"
          :key="entry.userId"
          :class="['list-item', { 'is-current-user': entry.userId === 'current-user' }]"
        >
          <div class="rank-number" :class="getRankTier(entry.rank ?? 0)">
            {{ entry.rank }}
          </div>
          <div class="user-avatar small" :style="{ background: getTierColor(getRankTier(entry.rank ?? 0)) }">
            {{ entry.userName[0] }}
          </div>
          <div class="user-info">
            <span class="name">{{ entry.userName }}</span>
            <span class="level">Lv.{{ entry.level }}</span>
          </div>
          <div class="trend" :class="entry.trend">
            <span v-if="entry.trend === 'up'">↑ {{ entry.change }}</span>
            <span v-else-if="entry.trend === 'down'">↓ {{ entry.change }}</span>
            <span v-else>-</span>
          </div>
          <div class="score">{{ formatScore(entry) }}</div>
        </div>
      </div>
    </section>

    <section v-if="currentUserRank > 0" class="my-rank-section">
      <h3>{{ t('leaderboard.myRank') }}</h3>
      <div class="my-rank-card">
        <div class="rank-number" :class="getRankTier(currentUserRank)">
          {{ currentUserRank }}
        </div>
        <div class="rank-info">
          <span class="tier">{{ getTierLabel(getRankTier(currentUserRank)) }}</span>
          <span class="desc">{{ t('leaderboard.keepGoing') }}</span>
        </div>
        <div class="rank-score">
          <span>{{ formatScore(getCurrentUserEntry()) }}</span>
        </div>
      </div>
    </section>

    <div class="refresh-section">
      <button class="refresh-btn" @click="refresh">
        <PhosphorIcon name="ArrowCounterClockwise" />
        {{ t('leaderboard.refresh') }}
      </button>
      <span class="last-updated">{{ t('leaderboard.lastUpdated', { time: formatTime(lastUpdated) }) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useLeaderboardStore, type LeaderboardType } from '@/stores/leaderboard'
import type { LeaderboardEntry } from '@/stores/leaderboard'
import PhosphorIcon from '@/components/PhosphorIcon.vue'

const i18nStore = useI18nStore()
const leaderboardStore = useLeaderboardStore()
const t = i18nStore.t

const currentType = ref<LeaderboardType>('xp')
const lastUpdated = ref(leaderboardStore.lastUpdated)

const typeTabs = computed(() => [
  { value: 'xp' as const, label: t('leaderboard.tabXp'), icon: 'Star' },
  { value: 'streak' as const, label: t('leaderboard.tabStreak'), icon: 'Fire' },
  { value: 'mastered' as const, label: t('leaderboard.tabMastered'), icon: 'CheckCircle' },
  { value: 'weekly' as const, label: t('leaderboard.tabWeekly'), icon: 'Calendar' },
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
  padding: 36px 20px 56px;
}

.header {
  margin-bottom: 24px;
  text-align: center;
}

.back-link {
  display: inline-block;
  color: var(--text-tertiary);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.header h1 {
  font-size: 2.1rem;
  margin-bottom: 8px;
}

.header p {
  color: var(--text-tertiary);
}

.type-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.type-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.type-tab:hover {
  border-color: var(--primary-color);
}

.type-tab.active {
  background: var(--primary-gradient);
  border-color: var(--primary-color);
  color: white;
}

.tab-icon {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.top-three-section {
  margin-bottom: 32px;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  padding: 20px;
}

.top-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  min-width: 140px;
}

.top-user.rank-1 {
  border-color: #ffd700;
  transform: scale(1.1);
  z-index: 1;
}

.top-user.rank-2 {
  border-color: #c0c0c0;
}

.top-user.rank-3 {
  border-color: #cd7f32;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 12px;
}

.rank-1 .rank-badge {
  background: #ffd700;
  color: #000;
}

.rank-2 .rank-badge {
  background: #c0c0c0;
  color: #000;
}

.rank-3 .rank-badge {
  background: #cd7f32;
  color: #fff;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.user-avatar.small {
  width: 40px;
  height: 40px;
  font-size: 1rem;
  margin-bottom: 0;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
}

.user-level {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.user-score {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.tier-badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  color: white;
  font-weight: 500;
}

.leaderboard-list {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 24px;
}

.list-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.list-header h2 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.list-header p {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.list-content {
  padding: 8px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.list-item:hover {
  background: var(--bg-secondary);
}

.list-item.is-current-user {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid var(--primary-color);
}

.rank-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-muted);
}

.rank-number.legendary {
  background: #ff6b6b;
  color: white;
}

.rank-number.epic {
  background: #9b59b6;
  color: white;
}

.rank-number.rare {
  background: #3498db;
  color: white;
}

.rank-number.uncommon {
  background: #2ecc71;
  color: white;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-info .name {
  font-weight: 500;
}

.user-info .level {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.trend {
  font-size: 0.85rem;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
}

.trend.up {
  color: #22c55e;
}

.trend.down {
  color: #ef4444;
}

.trend.stable {
  color: var(--text-muted);
}

.score {
  font-weight: 600;
  color: var(--primary-color);
  min-width: 100px;
  text-align: right;
}

.my-rank-section {
  margin-bottom: 24px;
}

.my-rank-section h3 {
  font-size: 1rem;
  margin-bottom: 12px;
  color: var(--text-secondary);
}

.my-rank-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--primary-gradient);
  border-radius: var(--radius-md);
  color: white;
}

.my-rank-card .rank-number {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  width: 48px;
  height: 48px;
}

.rank-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rank-info .tier {
  font-weight: 600;
  font-size: 1.1rem;
}

.rank-info .desc {
  font-size: 0.85rem;
  opacity: 0.9;
}

.rank-score {
  font-size: 1.3rem;
  font-weight: 700;
}

.refresh-section {
  text-align: center;
  padding: 20px;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.refresh-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.last-updated {
  display: block;
  margin-top: 12px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .top-three {
    flex-direction: column;
    align-items: center;
  }

  .top-user.rank-1 {
    transform: none;
    order: -1;
  }

  .list-item {
    flex-wrap: wrap;
  }

  .trend {
    order: 1;
  }

  .score {
    order: 2;
    min-width: auto;
  }
}
</style>

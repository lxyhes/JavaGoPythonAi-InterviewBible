<template>
  <div class="leaderboard-page">
    <div class="sticky-header">
      <a-page-header
        :title="t('leaderboard.title')"
        :sub-title="t('leaderboard.subtitle')"
        @back="() => $router.push('/dashboard')"
      >
        <template #extra>
          <div class="header-stats">
            <a-typography-text type="secondary" class="last-updated">
              <ReloadOutlined :spin="refreshing" @click="refresh" />
              {{ formatTime(lastUpdated) }}
            </a-typography-text>
          </div>
        </template>
      </a-page-header>
      
      <!-- 选项卡移入固定区域 -->
      <div class="type-tabs-sticky animate-fade-in">
        <a-segmented
          v-model:value="currentType"
          :options="typeTabOptions"
          class="type-tabs"
          block
        />
      </div>
    </div>

    <!-- 领奖台区域 -->
    <div class="podium-container animate-fade-in-up">
      <div class="podium-wrapper">
        <!-- 第二名 -->
        <div v-if="topThree[1]" class="podium-item rank-2 animate-fade-in-up delay-100">
          <div class="podium-user-card">
            <div class="rank-badge silver">2</div>
            <a-avatar :size="72" class="podium-avatar silver-border">
              {{ topThree[1].userName[0] }}
            </a-avatar>
            <div class="podium-info">
              <div class="user-name">{{ topThree[1].userName }}</div>
              <div class="user-score">{{ formatScore(topThree[1]) }}</div>
              <a-tag class="tier-tag silver">银牌选手</a-tag>
            </div>
          </div>
          <div class="podium-base silver"></div>
        </div>

        <!-- 第一名 -->
        <div v-if="topThree[0]" class="podium-item rank-1 animate-fade-in-up">
          <div class="podium-user-card">
            <div class="crown-icon">👑</div>
            <div class="rank-badge gold">1</div>
            <a-avatar :size="96" class="podium-avatar gold-border">
              {{ topThree[0].userName[0] }}
            </a-avatar>
            <div class="podium-info">
              <div class="user-name">{{ topThree[0].userName }}</div>
              <div class="user-score highlight">{{ formatScore(topThree[0]) }}</div>
              <a-tag class="tier-tag gold">金牌霸主</a-tag>
            </div>
          </div>
          <div class="podium-base gold"></div>
        </div>

        <!-- 第三名 -->
        <div v-if="topThree[2]" class="podium-item rank-3 animate-fade-in-up delay-200">
          <div class="podium-user-card">
            <div class="rank-badge bronze">3</div>
            <a-avatar :size="64" class="podium-avatar bronze-border">
              {{ topThree[2].userName[0] }}
            </a-avatar>
            <div class="podium-info">
              <div class="user-name">{{ topThree[2].userName }}</div>
              <div class="user-score">{{ formatScore(topThree[2]) }}</div>
              <a-tag class="tier-tag bronze">铜牌选手</a-tag>
            </div>
          </div>
          <div class="podium-base bronze"></div>
        </div>
      </div>
    </div>

    <a-card class="leaderboard-list-card animate-fade-in-up delay-300" :bordered="false">
      <div class="list-header">
        <h3 class="list-title">{{ leaderboardTitle }}</h3>
        <span class="list-desc">{{ leaderboardDescription }}</span>
      </div>

      <a-list :data-source="leaderboardEntries.slice(3)" class="custom-list">
        <template #renderItem="{ item, index }">
          <a-list-item
            class="custom-list-item"
            :class="{ 'is-current-user': item.userId === 'current-user' }"
          >
            <div class="item-rank">{{ index + 4 }}</div>
            
            <a-avatar
              :size="44"
              class="item-avatar"
              :style="{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
            >
              {{ item.userName[0] }}
            </a-avatar>

            <div class="item-main">
              <div class="item-name">
                {{ item.userName }}
                <a-tag v-if="item.userId === 'current-user'" color="blue" size="small">我</a-tag>
              </div>
              <div class="item-meta">
                <span>Lv.{{ item.level }}</span>
                <span class="dot">•</span>
                <span class="trend" :class="item.trend">
                  <ArrowUpOutlined v-if="item.trend === 'up'" />
                  <ArrowDownOutlined v-else-if="item.trend === 'down'" />
                  {{ item.change || '-' }}
                </span>
              </div>
            </div>

            <div class="item-score">
              {{ formatScore(item) }}
            </div>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <!-- 底部极简悬浮排名胶囊 -->
    <Transition name="slide-up">
      <div v-if="currentUserRank > 0" class="my-floating-rank">
        <div class="rank-pill-content">
          <span class="rank-num">#{{ currentUserRank }}</span>
          <span class="rank-divider"></span>
          <span class="rank-label">我的排名</span>
          <span class="rank-score">{{ formatScore(getCurrentUserEntry()) }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
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
const refreshing = ref(false)

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
      return `${entry.streakDays} 天`
    case 'mastered':
      return `${entry.masteredCount} 题`
    case 'weekly':
      return `${entry.weeklyReviews} 次`
    default:
      return ''
  }
}

const formatTime = (value: string) => {
  const date = new Date(value)
  return date.toLocaleString(i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const refresh = async () => {
  refreshing.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  leaderboardStore.refreshLeaderboard()
  lastUpdated.value = leaderboardStore.lastUpdated
  refreshing.value = false
}
</script>

<style scoped>
.leaderboard-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 160px; /* 超大底部留白 */
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-tabs-sticky {
  padding: 0 20px 12px;
  background: var(--bg-color);
}

.last-updated {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.last-updated .anticon {
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s;
}

.last-updated .anticon:hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
}

/* 领奖台样式 */
.podium-container {
  margin-bottom: 40px;
  padding-top: 40px;
}

.podium-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  height: 320px;
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 200px;
}

.podium-user-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
  width: 100%;
}

.crown-icon {
  position: absolute;
  top: -30px;
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  animation: bounce 2s infinite;
}

.rank-badge {
  position: absolute;
  top: 60px;
  right: 20%;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  z-index: 2;
  border: 2px solid white;
  box-shadow: var(--shadow-md);
}

.rank-badge.gold { background: linear-gradient(135deg, #ffd700, #f59e0b); color: white; }
.rank-badge.silver { background: linear-gradient(135deg, #e2e8f0, #94a3b8); color: white; }
.rank-badge.bronze { background: linear-gradient(135deg, #d97706, #78350f); color: white; }

.podium-avatar {
  background: var(--card-bg);
  box-shadow: var(--shadow-lg);
  margin-bottom: 12px;
  border: 4px solid transparent;
}

.gold-border { border-color: #ffd700 !important; }
.silver-border { border-color: #cbd5e1 !important; }
.bronze-border { border-color: #cd7f32 !important; }

.podium-info .user-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.podium-info .user-score {
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--primary-600);
}

.podium-info .user-score.highlight {
  font-size: 1.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tier-tag {
  margin-top: 8px;
  border: none;
  font-weight: 600;
}

.tier-tag.gold { background: rgba(251, 191, 36, 0.1); color: #b45309; }
.tier-tag.silver { background: rgba(148, 163, 184, 0.1); color: #475569; }
.tier-tag.bronze { background: rgba(217, 119, 6, 0.1); color: #92400e; }

.podium-base {
  width: 100%;
  border-radius: 12px 12px 0 0;
  box-shadow: var(--shadow-md);
}

.rank-1 .podium-base { height: 140px; background: linear-gradient(180deg, #ffd700 0%, #f59e0b 100%); }
.rank-2 .podium-base { height: 100px; background: linear-gradient(180deg, #e2e8f0 0%, #94a3b8 100%); }
.rank-3 .podium-base { height: 70px; background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%); }

/* 列表样式 */
.leaderboard-list-card {
  border-radius: 20px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.list-header {
  margin-bottom: 24px;
}

.list-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.list-desc {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.custom-list-item {
  display: flex;
  align-items: center;
  padding: 16px 24px !important;
  margin-bottom: 8px;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.custom-list-item:hover {
  background: var(--bg-secondary);
  transform: translateX(8px);
  border-color: var(--primary-100);
}

.custom-list-item.is-current-user {
  background: rgba(99, 102, 241, 0.05);
  border-color: var(--primary-200);
}

.item-rank {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-tertiary);
  width: 40px;
}

.item-avatar {
  margin-right: 16px;
  border: 2px solid white;
}

.item-main {
  flex: 1;
}

.item-name {
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-meta {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.dot { opacity: 0.3; }

.trend.up { color: var(--success-500); }
.trend.down { color: var(--error-500); }

.item-score {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary-600);
}

/* 极简浮动排名胶囊 */
.my-floating-rank {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: none;
}

.rank-pill-content {
  pointer-events: auto;
  background: rgba(99, 102, 241, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 8px 24px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
}

.rank-num {
  font-size: 1.25rem;
  font-weight: 900;
}

.rank-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.rank-label {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.9;
}

.rank-score {
  font-size: 1.1rem;
  font-weight: 800;
  margin-left: 4px;
}

/* 动画 */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s var(--ease-spring);
}
.slide-up-enter-from { transform: translate(-50%, 100px); opacity: 0; }
.slide-up-leave-to { transform: translate(-50%, 100px); opacity: 0; }

@media (max-width: 768px) {
  .podium-wrapper { height: 280px; gap: 5px; }
  .podium-avatar { transform: scale(0.8); }
  .rank-1 .podium-base { height: 100px; }
  .rank-2 .podium-base { height: 70px; }
  .rank-3 .podium-base { height: 50px; }
  .my-floating-rank { bottom: 15px; }
  .rank-pill-content { padding: 6px 18px; gap: 12px; }
  .rank-num { font-size: 1.1rem; }
  .rank-score { font-size: 1rem; }
}
</style>
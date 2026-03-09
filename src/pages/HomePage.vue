<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <div class="hero-section">
      <a-space direction="vertical" align="center" size="large">
        <a-tag color="blue" size="large">
          <AimOutlined /> 系统化面试准备平台
        </a-tag>
        <h1 class="hero-title">面试指南</h1>
        <p class="hero-desc">覆盖前端、后端、数据库、算法等核心技术领域，助你高效备战技术面试</p>
        <a-alert
          v-if="comebackMessage"
          type="warning"
          show-icon
          :message="comebackMessage"
          class="comeback-banner"
        />
      </a-space>
    </div>

    <!-- 快捷操作区 -->
    <a-card title="快速开始" class="section-card">
      <template #extra>选择适合你的学习方式</template>
      <a-row :gutter="[16, 16]">
        <a-col v-for="item in actionItems" :key="item.key" :xs="24" :sm="12" :lg="8">
          <router-link :to="item.to" class="action-link">
            <a-card
              hoverable
              :class="['action-card', { 'primary-card': item.isPrimary, 'highlight-card': item.isHighlight }]"
            >
              <a-card-meta
                :title="item.title"
                :description="item.desc"
              >
                <template #avatar>
                  <a-avatar :class="item.isPrimary ? 'primary-avatar' : 'default-avatar'">
                    <component :is="item.icon" />
                  </a-avatar>
                </template>
              </a-card-meta>
            </a-card>
          </router-link>
        </a-col>
      </a-row>
    </a-card>

    <!-- 学习数据概览 -->
    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="12" :sm="6">
        <a-card class="stat-card">
          <a-statistic title="当前等级" :value="`Lv.${learningStore.level}`">
            <template #prefix><StarFilled style="color: #faad14" /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card class="stat-card">
          <a-statistic title="连续学习" :value="learningStore.streakDays" suffix="天">
            <template #prefix><ThunderboltFilled style="color: #ff4d4f" /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card class="stat-card">
          <a-statistic title="已掌握" :value="learningStore.masteredQuestionCount" suffix="题">
            <template #prefix><CheckCircleFilled style="color: #52c41a" /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card class="stat-card">
          <a-statistic title="薄弱项" :value="learningStore.weakQuestionCount" suffix="题">
            <template #prefix><WarningFilled style="color: #faad14" /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 主要内容区 -->
    <a-row :gutter="[16, 16]">
      <!-- 左侧 -->
      <a-col :xs="24" :lg="16">
        <!-- 每日任务 -->
        <a-card title="每日任务" class="panel-card">
          <template #extra>
            <router-link to="/review">去复习 <RightOutlined /></router-link>
          </template>
          <p class="panel-desc">完成今日学习目标，保持学习 streak</p>
          <a-progress
            :percent="Math.round(learningStore.dailyGoalRate)"
            :format="() => `${learningStore.dailyGoalProgress} / ${learningStore.dailyGoalTarget} 题`"
            :status="learningStore.dailyGoalDone ? 'success' : 'active'"
          />
          <div class="goal-selector">
            <span class="selector-label">每日目标：</span>
            <a-radio-group v-model:value="learningStore.dailyGoalTarget" button-style="solid">
              <a-radio-button v-for="target in [10, 15, 20]" :key="target" :value="target">
                {{ target }} 题
              </a-radio-button>
            </a-radio-group>
          </div>
          <a-space class="mission-actions">
            <a-button type="primary" size="large" @click="$router.push('/practice')">
              <PlayCircleOutlined /> 开始练习
            </a-button>
            <a-button size="large" @click="$router.push({ path: '/practice', query: { mode: 'weak' } })">
              <AimOutlined /> 薄弱专项
            </a-button>
          </a-space>
        </a-card>

        <!-- AI 学习教练 -->
        <LearningCoachPanel
          category="mixed"
          :heat-level="learningStore.heatLevel"
          :next-action="learningStore.nextAction"
          :level="learningStore.level"
          :streak-days="learningStore.streakDays"
          :reviewed-today="learningStore.reviewedTodayCount"
          :daily-goal-target="learningStore.dailyGoalTarget"
          :weak-count="learningStore.weakQuestionCount"
          :due-count="learningStore.reviewQueueIds.length"
          :unlocked-achievements="learningStore.unlockedAchievementCount"
        />

        <!-- 成长进度 -->
        <a-card title="成长进度" class="panel-card">
          <template #extra>
            <router-link to="/dashboard">查看详情 <RightOutlined /></router-link>
          </template>
          <div class="level-display">
            <a-space size="large">
              <a-tag color="blue" size="large">Lv.{{ learningStore.level }}</a-tag>
              <span class="xp-value">{{ learningStore.totalXp }} XP</span>
            </a-space>
          </div>
          <a-progress
            :percent="learningStore.levelProgressRate"
            :format="() => `距离 Lv.${learningStore.level + 1} 还需 ${learningStore.nextLevelRequiredXp - learningStore.currentLevelXp} XP`"
            status="active"
          />
          <div v-if="nextLockedAchievement" class="achievement-preview">
            <p class="achievement-count">已解锁 {{ learningStore.unlockedAchievementCount }}/{{ learningStore.achievements.length }} 个成就</p>
            <a-alert
              type="info"
              show-icon
            >
              <template #message>{{ nextLockedAchievement.title }}</template>
              <template #description>{{ nextLockedAchievement.description }}</template>
              <template #icon><TrophyOutlined /></template>
            </a-alert>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧 -->
      <a-col :xs="24" :lg="8">
        <!-- 今日待复习 -->
        <a-card title="今日待复习" class="panel-card">
          <template #extra>
            <a-badge :count="duePreview.length" :overflow-count="99" />
            <router-link to="/review" style="margin-left: 8px;">查看全部 <RightOutlined /></router-link>
          </template>
          <a-list
            v-if="duePreview.length"
            :data-source="duePreview"
            :split="false"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <router-link :to="{ path: item.path, hash: `#${item.anchor}` }" class="item-link">
                  <a-list-item-meta
                    :title="item.question"
                    :description="categoryLabel(item.category)"
                  />
                </router-link>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="今天没有待复习的题目">
            <template #extra>
              <a-button type="primary" @click="$router.push('/practice')">去练习新题</a-button>
            </template>
          </a-empty>
        </a-card>

        <!-- 最近学习 -->
        <a-card title="最近学习" class="panel-card">
          <template #extra>
            <router-link to="/dashboard">学习看板 <RightOutlined /></router-link>
          </template>
          <a-list
            v-if="recentHistory.length"
            :data-source="recentHistory"
            :split="false"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.question"
                  :description="`${formatTime(item.reviewedAt)} · ${categoryLabel(item.category)}`"
                >
                  <template #avatar>
                    <a-tag :color="masteryColor(item.mastery)">{{ masteryLabel(item.mastery) }}</a-tag>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="还没有学习记录">
            <template #extra>
              <a-button type="primary" @click="$router.push('/practice')">开始第一题</a-button>
            </template>
          </a-empty>
        </a-card>
      </a-col>
    </a-row>

    <!-- 题库分类 -->
    <a-card title="题库分类" class="section-card">
      <template #extra>选择你感兴趣的领域开始学习</template>
      <a-row :gutter="[16, 16]">
        <a-col v-for="item in navItems" :key="item.path" :xs="24" :sm="12" :lg="8">
          <router-link :to="item.path" class="category-link">
            <a-card hoverable class="category-card">
              <a-card-meta
                :title="categoryLabel(item.category)"
                :description="item.desc"
              >
                <template #avatar>
                  <a-avatar :style="{ backgroundColor: item.color }">
                    <component :is="item.icon" />
                  </a-avatar>
                </template>
              </a-card-meta>
            </a-card>
          </router-link>
        </a-col>
      </a-row>
    </a-card>

    <!-- 页脚 -->
    <a-divider />
    <a-typography-paragraph type="secondary" align="center">
      © 2026 面试指南 - 让面试准备更高效
    </a-typography-paragraph>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import {
  AimOutlined,
  StarFilled,
  ThunderboltFilled,
  CheckCircleFilled,
  WarningFilled,
  RightOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  EditOutlined,
  SearchOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  UndoOutlined,
  GlobalOutlined,
  DesktopOutlined,
  RobotOutlined,
  DatabaseOutlined,
  SettingOutlined,
  CodeOutlined,
  ApartmentOutlined,
} from '@ant-design/icons-vue'
import LearningCoachPanel from '@/components/LearningCoachPanel.vue'
import { searchItems } from '@/data/search-index'
import { useI18nStore } from '@/stores/i18n'
import type { LearningAchievement, MasteryLevel } from '@/stores/learning'
import { useLearningStore } from '@/stores/learning'
import type { SearchCategory, SearchItem } from '@/types/search'
import { loadPracticeSession } from '@/utils/practiceSession'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t
const itemMap = new Map(searchItems.map((item) => [item.id, item]))
const practiceSessionUpdatedAt = ref<string | null>(null)

type RecentHistory = {
  id: string
  question: string
  category: SearchCategory
  reviewedAt: string
  mastery: MasteryLevel
}

type QuickAction = {
  key: string
  to: RouteLocationRaw
  icon: any
  title: string
  desc: string
  isPrimary?: boolean
  isHighlight?: boolean
}

const categoryLabel = (category: SearchCategory) => t(`common.categories.${category}`)
const masteryLabel = (mastery: MasteryLevel) => t(`common.mastery.${mastery}`)

const masteryColor = (mastery: MasteryLevel) => {
  const colors: Record<string, string> = {
    unknown: 'blue',
    vague: 'orange',
    mastered: 'success',
  }
  return colors[mastery] || 'default'
}

const comebackMessage = computed(() => {
  if (learningStore.inactiveDays >= 3) return t('home.comebackLong', { days: learningStore.inactiveDays })
  if (learningStore.inactiveDays >= 1) return t('home.comebackShort')
  return ''
})

const duePreview = computed<SearchItem[]>(() => {
  return learningStore.reviewQueueIds.slice(0, 5).reduce<SearchItem[]>((acc, id) => {
    const item = itemMap.get(id)
    if (item) acc.push(item)
    return acc
  }, [])
})

const recentHistory = computed<RecentHistory[]>(() => {
  return learningStore.history.slice(0, 6).reduce<RecentHistory[]>((acc, entry) => {
    const source = itemMap.get(entry.questionId)
    if (source) {
      acc.push({
        id: entry.questionId,
        question: source.question,
        category: source.category,
        reviewedAt: entry.reviewedAt,
        mastery: entry.mastery,
      })
    }
    return acc
  }, [])
})

const nextLockedAchievement = computed<LearningAchievement | null>(() => {
  return learningStore.achievements.find((item) => !item.unlocked) ?? null
})

const formatTime = (value: string) => new Date(value).toLocaleString(i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US')

const baseActionItems = computed<QuickAction[]>(() => {
  const list: QuickAction[] = [
    { key: 'practice', to: '/practice', icon: EditOutlined, title: '开始练习', desc: '系统化的刷题训练', isPrimary: true },
    { key: 'review', to: '/review', icon: UndoOutlined, title: '复习队列', desc: '巩固已学内容' },
    { key: 'search', to: '/search', icon: SearchOutlined, title: '搜索题目', desc: '快速找到想学的知识点' },
    { key: 'dashboard', to: '/dashboard', icon: AppstoreOutlined, title: '学习看板', desc: '查看学习统计和进度' },
  ]

  if (learningStore.weakQuestionCount > 0) {
    list.unshift({
      key: 'weak-practice',
      to: { path: '/practice', query: { mode: 'weak' } },
      icon: AimOutlined,
      title: '薄弱专项',
      desc: `针对 ${learningStore.weakQuestionCount} 道薄弱题目强化训练`,
      isHighlight: true,
    })
  }

  if (learningStore.nextAction === 'review' && learningStore.reviewQueueIds.length > 0) {
    list.unshift({
      key: 'recommended',
      to: '/review',
      icon: ClockCircleOutlined,
      title: '推荐复习',
      desc: `${learningStore.reviewQueueIds.length} 道题待复习`,
      isHighlight: true,
    })
  }

  return list
})

const actionItems = computed<QuickAction[]>(() => {
  if (!practiceSessionUpdatedAt.value) return baseActionItems.value

  return [
    {
      key: 'resume-practice',
      to: { path: '/practice', query: { resume: '1' } },
      icon: PlayCircleOutlined,
      title: '继续练习',
      desc: `上次练习于 ${formatTime(practiceSessionUpdatedAt.value)}`,
      isPrimary: true,
    },
    ...baseActionItems.value,
  ]
})

const navItems = computed(() => [
  { path: '/frontend', icon: CodeOutlined, category: 'frontend' as const, desc: t('home.nav.frontendDesc'), color: '#1890ff' },
  { path: '/backend', icon: SettingOutlined, category: 'backend' as const, desc: t('home.nav.backendDesc'), color: '#52c41a' },
  { path: '/database', icon: DatabaseOutlined, category: 'database' as const, desc: t('home.nav.databaseDesc'), color: '#722ed1' },
  { path: '/algorithm', icon: RiseOutlined, category: 'algorithm' as const, desc: t('home.nav.algorithmDesc'), color: '#eb2f96' },
  { path: '/system-design', icon: ApartmentOutlined, category: 'system-design' as const, desc: t('home.nav.systemDesignDesc'), color: '#fa8c16' },
  { path: '/devops', icon: GlobalOutlined, category: 'devops' as const, desc: t('home.nav.devopsDesc'), color: '#13c2c2' },
  { path: '/network', icon: GlobalOutlined, category: 'network' as const, desc: t('home.nav.networkDesc'), color: '#1890ff' },
  { path: '/os', icon: DesktopOutlined, category: 'os' as const, desc: t('home.nav.osDesc'), color: '#595959' },
  { path: '/ai', icon: RobotOutlined, category: 'ai' as const, desc: t('home.nav.aiDesc'), color: '#722ed1' },
])

onMounted(() => {
  const session = loadPracticeSession()
  practiceSessionUpdatedAt.value = session?.updatedAt ?? null
})
</script>

<style scoped>
.home-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}

.hero-section {
  text-align: center;
  padding: 40px 0 32px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.hero-desc {
  font-size: 1.125rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.comeback-banner {
  max-width: 500px;
  margin: 0 auto;
}

.section-card {
  margin-bottom: 24px;
}

.action-link {
  text-decoration: none;
  display: block;
}

.action-card {
  height: 100%;
}

.action-card :deep(.ant-card-meta-title) {
  font-size: 1rem;
  margin-bottom: 4px;
}

.action-card :deep(.ant-card-meta-description) {
  font-size: 0.875rem;
}

.primary-card {
  border-color: #1890ff;
}

.primary-card :deep(.ant-card-meta-title) {
  color: #1890ff;
}

.highlight-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%);
  border-color: rgba(245, 158, 11, 0.3);
}

.highlight-card :deep(.ant-card-meta-title) {
  color: #d97706;
}

.primary-avatar {
  background: #1890ff;
}

.default-avatar {
  background: #f0f0f0;
  color: #666;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.stat-card :deep(.ant-statistic-title) {
  font-size: 0.875rem;
  color: #666;
}

.stat-card :deep(.ant-statistic-content) {
  font-size: 1.5rem;
  font-weight: 600;
}

.panel-card {
  margin-bottom: 24px;
}

.panel-desc {
  color: #666;
  margin-bottom: 16px;
}

.goal-selector {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.selector-label {
  color: #666;
  font-size: 0.875rem;
}

.mission-actions {
  margin-top: 24px;
}

.level-display {
  margin-bottom: 16px;
}

.xp-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1890ff;
}

.achievement-preview {
  margin-top: 24px;
}

.achievement-count {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 12px;
}

.item-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
}

.item-link :deep(.ant-list-item-meta-title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-link {
  text-decoration: none;
  display: block;
}

.category-card {
  height: 100%;
}

.category-card :deep(.ant-card-meta-title) {
  font-size: 1rem;
}

.category-card :deep(.ant-card-meta-description) {
  font-size: 0.875rem;
}
</style>

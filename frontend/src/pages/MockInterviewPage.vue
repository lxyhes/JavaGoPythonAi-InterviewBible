<template>
  <div class="mock-interview-page">
    <!-- 配置阶段 -->
    <template v-if="store.status === 'config'">
      <div class="config-section">
        <!-- 顶部面试倒计时 -->
        <InterviewCountdown />

        <!-- 面试统计 -->
        <div class="stats-overview" v-if="store.totalInterviews > 0">
          <div class="stat-mini">
            <span class="stat-mini-value">{{ store.totalInterviews }}</span>
            <span class="stat-mini-label">模拟次数</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-value">{{ store.averageScore }}%</span>
            <span class="stat-mini-label">平均得分</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-value">{{ store.bestScore }}%</span>
            <span class="stat-mini-label">最佳成绩</span>
          </div>
        </div>

        <div class="config-container">
          <div class="config-header">
            <div class="config-icon">
              <PhosphorIcon name="exam" :size="32" weight="fill" />
            </div>
            <h1>模拟面试</h1>
            <p class="config-desc">在限时场景下检验真实面试能力，精准定位薄弱环节</p>
          </div>

          <!-- 选择技术方向 -->
          <div class="config-block">
            <h3 class="config-block-title">
              <PhosphorIcon name="folders" :size="20" />
              技术方向
            </h3>
            <p class="config-block-desc">不选则随机抽取全部分类</p>
            <div class="category-chips">
              <button
                v-for="cat in categoryOptions"
                :key="cat.value"
                type="button"
                :class="['chip', { active: selectedCategories.includes(cat.value) }]"
                @click="toggleCategory(cat.value)"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- 题目数量 -->
          <div class="config-block">
            <h3 class="config-block-title">
              <PhosphorIcon name="list-numbers" :size="20" />
              题目数量
            </h3>
            <div class="count-options">
              <button
                v-for="count in [5, 10, 15, 20]"
                :key="count"
                type="button"
                :class="['count-btn', { active: questionCount === count }]"
                @click="questionCount = count"
              >
                {{ count }} 题
              </button>
            </div>
          </div>

          <!-- 每题限时 -->
          <div class="config-block">
            <h3 class="config-block-title">
              <PhosphorIcon name="timer" :size="20" />
              每题限时
            </h3>
            <div class="count-options">
              <button
                v-for="time in timeOptions"
                :key="time.value"
                type="button"
                :class="['count-btn', { active: timePerQuestion === time.value }]"
                @click="timePerQuestion = time.value"
              >
                {{ time.label }}
              </button>
            </div>
          </div>

          <!-- 开始按钮 -->
          <button type="button" class="start-btn" @click="handleStart">
            <PhosphorIcon name="play-circle" :size="24" weight="fill" />
            开始模拟面试
          </button>

          <!-- 历史记录 -->
          <div v-if="store.history.length > 0" class="history-section">
            <h3 class="config-block-title">
              <PhosphorIcon name="clock-counter-clockwise" :size="20" />
              面试记录
            </h3>
            <div class="history-list">
              <div
                v-for="record in store.history.slice(0, 5)"
                :key="record.id"
                class="history-item"
              >
                <div class="history-info">
                  <span class="history-score" :class="scoreClass(record.score)">
                    {{ record.score }}分
                  </span>
                  <span class="history-meta">
                    {{ record.questions.length }}题 · {{ store.formatTime(record.totalTime) }}
                  </span>
                </div>
                <span class="history-date">
                  {{ formatDate(record.completedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 面试进行中 -->
    <template v-if="store.status === 'in-progress'">
      <div class="interview-header">
        <div class="interview-progress-bar">
          <div class="progress-fill" :style="{ width: `${store.progress}%` }"></div>
        </div>
        <div class="interview-meta">
          <span class="meta-item">
            <PhosphorIcon name="hash" :size="16" />
            {{ store.currentIndex + 1 }} / {{ store.questions.length }}
          </span>
          <span class="meta-item timer" :class="{ warning: isTimeWarning }">
            <PhosphorIcon name="timer" :size="16" />
            {{ store.formatTime(store.questionTimer) }}
            <span v-if="timePerQuestion > 0" class="time-limit">
              / {{ store.formatTime(timePerQuestion) }}
            </span>
          </span>
          <span class="meta-item">
            <PhosphorIcon name="clock" :size="16" />
            总计 {{ store.formatTime(store.elapsedTime) }}
          </span>
          <button type="button" class="exit-btn" @click="confirmExit">
            <PhosphorIcon name="x" :size="16" />
            退出
          </button>
        </div>
      </div>

      <div class="question-container" v-if="store.currentQuestion">
        <div class="question-info">
          <span class="question-category">{{ categoryLabel(store.currentQuestion.item.category) }}</span>
          <span class="question-section">{{ store.currentQuestion.item.sectionTitle }}</span>
        </div>

        <h2 class="question-text">{{ store.currentQuestion.item.question }}</h2>

        <!-- 答题区 -->
        <div class="answer-area">
          <textarea
            v-model="store.currentQuestion.userAnswer"
            class="answer-input"
            placeholder="在这里组织你的回答... (模拟口述答题)"
            rows="5"
          ></textarea>
        </div>

        <!-- 查看答案 -->
        <div class="answer-reveal" v-if="!store.currentQuestion.revealed">
          <button type="button" class="reveal-btn" @click="store.revealAnswer()">
            <PhosphorIcon name="eye" :size="20" />
            查看参考答案
          </button>
          <span class="reveal-hint">查看后需要评估自己的掌握程度</span>
        </div>

        <div v-if="store.currentQuestion.revealed" class="reference-answer">
          <h4>
            <PhosphorIcon name="check-circle" :size="18" weight="fill" />
            参考答案
          </h4>
          <pre class="answer-content">{{ store.currentQuestion.item.answer }}</pre>
        </div>

        <!-- AI 导师评估 -->
        <div v-if="store.currentQuestion.revealed" class="ai-eval-section">
          <div class="ai-eval-header">
            <h4>
              <PhosphorIcon name="robot" :size="18" weight="fill" />
              AI 导师评估
            </h4>
            <div class="ai-controls">
              <button 
                v-if="!store.currentQuestion.aiComment && !store.currentQuestion.isEvaluating" 
                class="ai-eval-btn"
                @click="store.evaluateAnswer(store.currentIndex)"
              >
                <PhosphorIcon name="sparkle" :size="16" weight="fill" />
                让大模型为你打分并点评
              </button>
              <span v-else-if="store.currentQuestion.isEvaluating" class="evaluating-text">
                <PhosphorIcon name="spinner-gap" class="spin-icon" :size="16" />
                AI 正在评估中...
              </span>
            </div>
          </div>
          <div v-if="store.currentQuestion.aiComment" class="ai-comment-box">
            <pre class="answer-content ai-text">{{ store.currentQuestion.aiComment }}</pre>
          </div>
        </div>

        <!-- 评分操作 -->
        <div v-if="store.currentQuestion.revealed" class="rating-section">
          <p class="rating-label">对比参考答案，评估你的掌握程度：</p>
          <div class="rating-buttons">
            <button
              type="button"
              class="rate-btn rate-unknown"
              @click="store.rateAndNext('unknown')"
            >
              <PhosphorIcon name="x-circle" :size="24" weight="fill" />
              <span>不会</span>
              <span class="rate-desc">完全不知道</span>
            </button>
            <button
              type="button"
              class="rate-btn rate-vague"
              @click="store.rateAndNext('vague')"
            >
              <PhosphorIcon name="warning-circle" :size="24" weight="fill" />
              <span>模糊</span>
              <span class="rate-desc">知道一些但不完整</span>
            </button>
            <button
              type="button"
              class="rate-btn rate-mastered"
              @click="store.rateAndNext('mastered')"
            >
              <PhosphorIcon name="check-circle" :size="24" weight="fill" />
              <span>掌握</span>
              <span class="rate-desc">能完整准确回答</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- 面试完成 - 结果页 -->
    <template v-if="store.status === 'completed'">
      <div class="result-section">
        <div class="result-header">
          <div class="result-icon" :class="resultGrade">
            <PhosphorIcon :name="resultIcon" :size="48" weight="fill" />
          </div>
          <h1 class="result-title">{{ resultTitle }}</h1>
          <p class="result-subtitle">{{ resultSubtitle }}</p>
        </div>

        <!-- 得分环 -->
        <div class="score-display">
          <div class="score-circle" :style="{ '--score': `${lastResult?.score ?? 0}%` }">
            <div class="score-inner">
              <strong>{{ lastResult?.score ?? 0 }}</strong>
              <span>分</span>
            </div>
          </div>
        </div>

        <!-- 统计数据 -->
        <div class="result-stats">
          <div class="result-stat">
            <span class="result-stat-value text-success">{{ lastResult?.masteredCount ?? 0 }}</span>
            <span class="result-stat-label">掌握</span>
          </div>
          <div class="result-stat">
            <span class="result-stat-value text-warning">{{ lastResult?.vagueCount ?? 0 }}</span>
            <span class="result-stat-label">模糊</span>
          </div>
          <div class="result-stat">
            <span class="result-stat-value text-danger">{{ lastResult?.unknownCount ?? 0 }}</span>
            <span class="result-stat-label">不会</span>
          </div>
          <div class="result-stat">
            <span class="result-stat-value">{{ store.formatTime(lastResult?.totalTime ?? 0) }}</span>
            <span class="result-stat-label">用时</span>
          </div>
        </div>

        <!-- 薄弱点分析 -->
        <div v-if="lastResult?.weakCategories?.length" class="weak-analysis">
          <h3>
            <PhosphorIcon name="target" :size="20" weight="fill" />
            薄弱领域分析
          </h3>
          <p class="weak-desc">以下领域建议重点复习：</p>
          <div class="weak-tags">
            <router-link
              v-for="cat in lastResult.weakCategories"
              :key="cat"
              :to="{ path: '/practice', query: { category: cat } }"
              class="weak-tag"
            >
              {{ categoryLabel(cat) }}
              <PhosphorIcon name="arrow-right" :size="14" />
            </router-link>
          </div>
        </div>

        <!-- 详细题目回顾 -->
        <div class="review-section">
          <h3>
            <PhosphorIcon name="list-checks" :size="20" weight="fill" />
            题目回顾
          </h3>
          <div class="review-list">
            <div
              v-for="(q, idx) in lastResult?.questions ?? []"
              :key="idx"
              class="review-item"
              :class="q.selfRating"
            >
              <div class="review-item-header">
                <span class="review-index">#{{ idx + 1 }}</span>
                <span class="review-category">{{ categoryLabel(q.item.category) }}</span>
                <span
                  class="review-rating"
                  :class="q.selfRating ?? 'unknown'"
                >
                  {{ ratingLabel(q.selfRating) }}
                </span>
                <span class="review-time">{{ store.formatTime(q.timeSpent) }}</span>
              </div>
              <p class="review-question">{{ q.item.question }}</p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="result-actions">
          <button type="button" class="action-btn primary" @click="store.resetInterview()">
            <PhosphorIcon name="arrow-counter-clockwise" :size="20" />
            再来一次
          </button>
          <router-link to="/practice" class="action-btn secondary">
            <PhosphorIcon name="book-open" :size="20" />
            去练习薄弱题
          </router-link>
          <router-link to="/dashboard" class="action-btn ghost">
            <PhosphorIcon name="chart-bar" :size="20" />
            学习看板
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PhosphorIcon from '@/components/PhosphorIcon.vue'
import InterviewCountdown from '@/components/InterviewCountdown.vue'
import { useMockInterviewStore } from '@/stores/mockInterview'
import { useI18nStore } from '@/stores/i18n'
import type { SearchCategory } from '@/types/search'

const store = useMockInterviewStore()
const i18nStore = useI18nStore()

const selectedCategories = ref<SearchCategory[]>([])
const questionCount = ref(10)
const timePerQuestion = ref(180)

const categoryOptions = [
  { value: 'frontend' as const, label: '前端' },
  { value: 'backend' as const, label: '后端/Java' },
  { value: 'database' as const, label: '数据库' },
  { value: 'algorithm' as const, label: '算法' },
  { value: 'system-design' as const, label: '系统设计' },
  { value: 'ai' as const, label: 'AI' },
  { value: 'network' as const, label: '网络' },
  { value: 'os' as const, label: '操作系统' },
  { value: 'devops' as const, label: 'DevOps' },
]

const timeOptions = [
  { value: 120, label: '2分钟' },
  { value: 180, label: '3分钟' },
  { value: 300, label: '5分钟' },
  { value: 0, label: '不限时' },
]

const isTimeWarning = computed(() => {
  if (timePerQuestion.value === 0) return false
  return store.questionTimer > timePerQuestion.value * 0.8
})

const lastResult = computed(() => store.history[0] ?? null)

const resultGrade = computed(() => {
  const score = lastResult.value?.score ?? 0
  if (score >= 80) return 'grade-a'
  if (score >= 60) return 'grade-b'
  if (score >= 40) return 'grade-c'
  return 'grade-d'
})

const resultIcon = computed(() => {
  const score = lastResult.value?.score ?? 0
  if (score >= 80) return 'trophy'
  if (score >= 60) return 'medal'
  if (score >= 40) return 'arrow-up'
  return 'target'
})

const resultTitle = computed(() => {
  const score = lastResult.value?.score ?? 0
  if (score >= 80) return '表现出色！ 🎉'
  if (score >= 60) return '不错的表现！ 💪'
  if (score >= 40) return '还有提升空间 📈'
  return '需要加强练习 🎯'
})

const resultSubtitle = computed(() => {
  const score = lastResult.value?.score ?? 0
  if (score >= 80) return '你已经具备相当的面试竞争力，继续保持！'
  if (score >= 60) return '基础扎实，针对薄弱点加强练习会更有效。'
  if (score >= 40) return '建议先精通核心知识点，再进行模拟面试。'
  return '别灰心！系统化刷题是提升的最快路径。'
})

function toggleCategory(cat: SearchCategory) {
  const idx = selectedCategories.value.indexOf(cat)
  if (idx >= 0) {
    selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(cat)
  }
}

function handleStart() {
  store.startInterview({
    categories: [...selectedCategories.value],
    questionCount: questionCount.value,
    timePerQuestion: timePerQuestion.value,
    difficulty: 'mixed',
  })
}

function confirmExit() {
  if (confirm('确定退出模拟面试吗？本次面试数据将会丢失。')) {
    store.resetInterview()
  }
}

function scoreClass(score: number) {
  if (score >= 80) return 'score-a'
  if (score >= 60) return 'score-b'
  if (score >= 40) return 'score-c'
  return 'score-d'
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const categoryLabel = (category: SearchCategory) => {
  const zhMap: Record<SearchCategory, string> = {
    frontend: '前端',
    backend: '后端',
    database: '数据库',
    algorithm: '算法',
    'system-design': '系统设计',
    devops: 'DevOps',
    network: '网络',
    os: '操作系统',
    ai: 'AI',
  }
  return zhMap[category] ?? category
}

function ratingLabel(rating: string | null) {
  if (rating === 'mastered') return '✅ 掌握'
  if (rating === 'vague') return '⚠️ 模糊'
  return '❌ 不会'
}
</script>

<style scoped>
.mock-interview-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px 60px;
  min-height: calc(100vh - 64px);
}

/* ==================== 配置阶段 ==================== */
.config-section {
  padding-top: 24px;
}

.stats-overview {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-mini {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.stat-mini-value {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-mini-label {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}

.config-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.config-header {
  text-align: center;
  margin-bottom: 40px;
}

.config-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: 20px;
  color: white;
}

.config-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px;
}

.config-desc {
  color: var(--text-tertiary);
  font-size: 1rem;
}

.config-block {
  margin-bottom: 32px;
}

.config-block-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px;
}

.config-block-desc {
  font-size: 0.84rem;
  color: var(--text-muted);
  margin: 0 0 12px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 10px 18px;
  border: 1.5px solid var(--border-color);
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: var(--primary-400);
  background: rgba(99, 102, 241, 0.06);
}

.chip.active {
  border-color: var(--primary-500);
  background: var(--primary-500);
  color: white;
}

.count-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.count-btn {
  padding: 10px 20px;
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  text-align: center;
}

.count-btn:hover {
  border-color: var(--primary-400);
}

.count-btn.active {
  border-color: var(--primary-500);
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-600);
  font-weight: 600;
}

.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 16px;
  background: var(--gradient-primary);
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
  margin-bottom: 32px;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

/* 历史记录 */
.history-section {
  border-top: 1px solid var(--border-color);
  padding-top: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--bg-secondary);
  transition: background 0.2s;
}

.history-item:hover {
  background: rgba(99, 102, 241, 0.04);
}

.history-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-score {
  font-weight: 700;
  font-size: 1rem;
  min-width: 50px;
}

.score-a { color: #10b981; }
.score-b { color: #3b82f6; }
.score-c { color: #f59e0b; }
.score-d { color: #ef4444; }

.history-meta {
  font-size: 0.84rem;
  color: var(--text-tertiary);
}

.history-date {
  font-size: 0.82rem;
  color: var(--text-muted);
}

/* ==================== 面试进行中 ==================== */
.interview-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-color);
  padding: 16px 0;
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.interview-progress-bar {
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.interview-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.meta-item.timer {
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.meta-item.timer.warning {
  color: #ef4444;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.time-limit {
  color: var(--text-muted);
}

.exit-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  color: var(--text-tertiary);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.exit-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.question-container {
  padding: 24px 0;
}

.question-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.question-category {
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-600);
  font-size: 0.82rem;
  font-weight: 600;
}

.question-section {
  font-size: 0.84rem;
  color: var(--text-tertiary);
}

.question-text {
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.6;
  margin: 0 0 24px;
  color: var(--text-primary);
}

.answer-area {
  margin-bottom: 20px;
}

.answer-input {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.7;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.answer-input:focus {
  outline: none;
  border-color: var(--primary-400);
}

.answer-input::placeholder {
  color: var(--text-muted);
}

.answer-reveal {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.reveal-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid var(--primary-500);
  border-radius: 12px;
  background: transparent;
  color: var(--primary-600);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reveal-btn:hover {
  background: var(--primary-500);
  color: white;
}

.reveal-hint {
  font-size: 0.84rem;
  color: var(--text-muted);
}

.reference-answer {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(59, 130, 246, 0.04) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
}

.reference-answer h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #10b981;
  margin: 0 0 12px;
  font-size: 0.95rem;
}

.answer-content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.8;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.ai-eval-section {
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--primary-300);
  border-radius: 16px;
}

.ai-eval-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}

.ai-eval-section .ai-comment-box {
  margin-top: 16px;
}

.ai-eval-header h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-600);
  margin: 0;
  font-size: 0.95rem;
}

.ai-eval-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background: var(--gradient-primary);
  color: white;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.ai-eval-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
}

.evaluating-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-500);
  font-size: 0.85rem;
  font-weight: 500;
}

.spin-icon {
  animation: spin-anim 1s linear infinite;
}

@keyframes spin-anim {
  100% { transform: rotate(360deg); }
}

.ai-comment-box {
  background: var(--card-bg);
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed var(--primary-300);
}

.ai-text {
  color: var(--text-primary);
}

.rating-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.rating-label {
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0 0 16px;
  color: var(--text-primary);
}

.rating-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.rate-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}

.rate-btn span:first-of-type {
  font-size: 1rem;
  font-weight: 600;
}

.rate-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.rate-unknown:hover {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.06);
  color: #ef4444;
}

.rate-vague:hover {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.06);
  color: #f59e0b;
}

.rate-mastered:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.06);
  color: #10b981;
}

/* ==================== 结果页 ==================== */
.result-section {
  padding-top: 40px;
  text-align: center;
}

.result-header {
  margin-bottom: 32px;
}

.result-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.result-icon.grade-a { background: rgba(16, 185, 129, 0.12); color: #10b981; }
.result-icon.grade-b { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
.result-icon.grade-c { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
.result-icon.grade-d { background: rgba(239, 68, 68, 0.12); color: #ef4444; }

.result-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px;
}

.result-subtitle {
  font-size: 1rem;
  color: var(--text-tertiary);
  max-width: 500px;
  margin: 0 auto;
}

.score-display {
  margin: 32px auto;
}

.score-circle {
  --score: 0%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(var(--primary-500) var(--score), var(--bg-secondary) 0);
  display: grid;
  place-items: center;
  margin: 0 auto;
}

.score-inner {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--card-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-inner strong {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.score-inner span {
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 32px 0;
}

.result-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.result-stat-label {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}

.text-success { color: #10b981; }
.text-warning { color: #f59e0b; }
.text-danger { color: #ef4444; }

.weak-analysis {
  text-align: left;
  margin: 32px 0;
  padding: 24px;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
}

.weak-analysis h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  color: #d97706;
}

.weak-desc {
  font-size: 0.88rem;
  color: var(--text-tertiary);
  margin: 0 0 16px;
}

.weak-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.weak-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: all 0.2s;
}

.weak-tag:hover {
  background: rgba(245, 158, 11, 0.2);
  transform: translateY(-1px);
}

.review-section {
  text-align: left;
  margin: 32px 0;
}

.review-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-item {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid transparent;
  transition: background 0.2s;
}

.review-item.mastered { border-left-color: #10b981; }
.review-item.vague { border-left-color: #f59e0b; }
.review-item.unknown, .review-item:not(.mastered):not(.vague) { border-left-color: #ef4444; }

.review-item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.review-index {
  font-weight: 700;
  font-size: 0.84rem;
  color: var(--text-muted);
}

.review-category {
  font-size: 0.78rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-600);
}

.review-rating {
  font-size: 0.82rem;
  font-weight: 600;
}

.review-rating.mastered { color: #10b981; }
.review-rating.vague { color: #f59e0b; }
.review-rating.unknown { color: #ef4444; }

.review-time {
  margin-left: auto;
  font-size: 0.82rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.review-question {
  margin: 0;
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 40px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

.action-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.action-btn.secondary:hover {
  border-color: var(--primary-300);
}

.action-btn.ghost {
  background: transparent;
  color: var(--text-secondary);
}

.action-btn.ghost:hover {
  background: var(--bg-secondary);
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .config-container {
    padding: 24px;
    border-radius: 20px;
  }

  .config-header h1 {
    font-size: 1.5rem;
  }

  .stats-overview {
    flex-direction: column;
    gap: 8px;
  }

  .stat-mini {
    flex-direction: row;
    justify-content: space-between;
  }

  .rating-buttons {
    grid-template-columns: 1fr;
  }

  .result-stats {
    gap: 16px;
    flex-wrap: wrap;
  }

  .result-actions {
    flex-direction: column;
  }

  .review-item-header {
    gap: 8px;
  }
}
</style>

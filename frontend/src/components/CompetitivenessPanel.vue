<template>
  <section class="competitiveness-panel">
    <div class="panel-header">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2>{{ copy.title }}</h2>
        <p class="panel-summary">{{ copy.summary }}</p>
      </div>
      <router-link class="panel-link" :to="primaryRoute">{{ primaryCta }}</router-link>
    </div>

    <div class="target-grid">
      <button
        v-for="target in targetOptions"
        :key="target.id"
        type="button"
        :class="['target-chip', { active: target.id === learningStore.careerTarget }]"
        @click="learningStore.updateCareerTarget(target.id)"
      >
        <span class="target-name">{{ target.label }}</span>
        <span class="target-desc">{{ target.summary }}</span>
      </button>
    </div>

    <!-- 简历解析与 AI 定向 (落地点) -->
    <div class="resume-section">
      <div class="resume-header" @click="toggleResume">
        <div class="resume-header-left">
          <span class="resume-badge">AI 简历分析已就绪</span>
          <h3>上传或贴入简历文字，让面试更有针对性</h3>
        </div>
        <button class="expand-btn">
          {{ showResume ? '收起' : '展开编辑' }}
        </button>
      </div>
      <div v-show="showResume" class="resume-editor-wrap">
        <textarea
          class="resume-textarea"
          v-model="resumeText"
          placeholder="在此处贴入你的简历内容，AI 将基于简历生成追问和专项题目..."
          rows="6"
        ></textarea>
        <div class="resume-footer">
          <p class="resume-hint">💡 AI 会识别你简历中的技术栈（如 Java, React, Redis）并自动调整模拟面试的侧重。</p>
          <button class="save-resume-btn" @click="saveResume">保存并同步 AI 会话</button>
        </div>
      </div>
    </div>

    <div class="hero-grid">
      <article class="score-card">
        <div class="score-ring" :style="{ '--score': `${learningStore.competitivenessScore}%` }">
          <div class="score-inner">
            <strong>{{ learningStore.competitivenessScore }}</strong>
            <span>/ 100</span>
          </div>
        </div>
        <div class="score-copy">
          <h3>{{ scoreHeadline }}</h3>
          <p>{{ scoreDescription }}</p>
        </div>
      </article>

      <article class="focus-card">
        <p class="section-kicker">{{ copy.focus }}</p>
        <h3>{{ learningStore.careerTargetProfile.label }}</h3>
        <p class="focus-summary">{{ learningStore.careerTargetProfile.summary }}</p>
        <div class="focus-tags">
          <span
            v-for="category in learningStore.careerTargetProfile.focusCategories"
            :key="category"
            class="focus-tag"
          >
            {{ categoryLabel(category) }}
          </span>
        </div>
        <ul class="plan-list">
          <li v-for="step in actionPlan" :key="step">{{ step }}</li>
        </ul>
      </article>
    </div>

    <div class="insight-grid">
      <article class="insight-card">
        <div class="insight-head">
          <div>
            <p class="section-kicker">{{ copy.strengths }}</p>
            <h3>{{ copy.keepShipping }}</h3>
          </div>
          <span class="insight-badge success">{{ copy.advantage }}</span>
        </div>
        <div class="metric-list">
          <div v-for="item in learningStore.strongestCategories" :key="item.category" class="metric-row">
            <div>
              <strong>{{ categoryLabel(item.category) }}</strong>
              <p>{{ strengthLine(item.mastered, item.tracked) }}</p>
            </div>
            <span class="metric-pill">{{ item.readinessScore }}</span>
          </div>
        </div>
      </article>

      <article class="insight-card">
        <div class="insight-head">
          <div>
            <p class="section-kicker">{{ copy.gaps }}</p>
            <h3>{{ copy.fixNext }}</h3>
          </div>
          <span class="insight-badge warn">{{ copy.priority }}</span>
        </div>
        <div class="metric-list">
          <div v-for="item in learningStore.criticalGaps" :key="item.category" class="metric-row">
            <div>
              <strong>{{ categoryLabel(item.category) }}</strong>
              <p>{{ gapLine(item.weak, item.due, item.coverageRate) }}</p>
            </div>
            <span class="metric-pill danger">{{ item.readinessScore }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLearningStore, type CareerTarget } from '@/stores/learning'
import { useI18nStore } from '@/stores/i18n'
import type { SearchCategory } from '@/types/search'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const showResume = ref(false)
const resumeText = ref(learningStore.settings.resumeText)

const toggleResume = () => {
  showResume.value = !showResume.value
}

const saveResume = () => {
  learningStore.updateResumeText(resumeText.value)
  showResume.value = false
}

const isZh = computed(() => i18nStore.locale === 'zh')

const copy = computed(() =>
  isZh.value
    ? {
        eyebrow: '核心竞争力引擎',
        title: '把刷题结果变成岗位竞争力',
        summary: '选择目标方向后，系统会按岗位能力模型衡量你的准备度，而不是只看总题量。',
        focus: '目标岗位',
        strengths: '优势能力',
        gaps: '关键短板',
        keepShipping: '这些部分已经开始形成优势',
        fixNext: '下一阶段最该补的地方',
        advantage: '可放大',
        priority: '优先补齐',
      }
    : {
        eyebrow: 'Competitiveness Engine',
        title: 'Turn practice into job-ready strength',
        summary: 'Pick a target path and the app will score you against role-aligned capability areas, not just raw volume.',
        focus: 'Target Role',
        strengths: 'Strengths',
        gaps: 'Gaps',
        keepShipping: 'Areas already turning into advantage',
        fixNext: 'Highest-leverage gaps to close next',
        advantage: 'Strength',
        priority: 'Priority',
      }
)

const targetOptions = computed(() => [
  profile('frontend'),
  profile('backend'),
  profile('fullstack'),
  profile('system-design'),
  profile('ai'),
  profile('bytedance'),
  profile('alibaba'),
  profile('tencent'),
])

const primaryRoute = computed(() => {
  if (learningStore.nextAction === 'review') return '/review'
  if (learningStore.nextAction === 'weak') return { path: '/practice', query: { mode: 'weak' } }
  return '/practice'
})

const primaryCta = computed(() => {
  if (isZh.value) {
    if (learningStore.nextAction === 'review') return '先清复习队列'
    if (learningStore.nextAction === 'weak') return '先攻克薄弱项'
    return '开始专项训练'
  }

  if (learningStore.nextAction === 'review') return 'Clear Review Queue'
  if (learningStore.nextAction === 'weak') return 'Attack Weak Areas'
  return 'Start Focused Practice'
})

const scoreHeadline = computed(() => {
  const score = learningStore.competitivenessScore
  if (isZh.value) {
    if (score >= 75) return '已经具备较强的面试竞争力'
    if (score >= 55) return '基础已成型，正在进入进阶区'
    return '还在搭建核心能力骨架'
  }

  if (score >= 75) return 'You already have solid interview leverage'
  if (score >= 55) return 'Your fundamentals are turning into range'
  return 'You are still building the core skeleton'
})

const scoreDescription = computed(() => {
  const profileLabel = learningStore.careerTargetProfile.label
  if (isZh.value) {
    return `当前分数结合了目标岗位权重、各分类掌握度和覆盖度。对 ${profileLabel} 来说，越接近 100，越说明你的知识结构更完整。`
  }

  return `This score blends role weights, mastery, and coverage. For ${profileLabel}, moving closer to 100 means a more complete interview-ready shape.`
})

const actionPlan = computed(() => {
  const [firstGap, secondGap] = learningStore.criticalGaps
  const plans = []

  if (learningStore.reviewQueueIds.length > 0) {
    plans.push(
      isZh.value
        ? `先处理 ${learningStore.reviewQueueIds.length} 道待复习题，避免记忆断层。`
        : `Clear ${learningStore.reviewQueueIds.length} due review items first so retention does not decay.`
    )
  }

  if (firstGap) {
    plans.push(
      isZh.value
        ? `把 ${categoryLabel(firstGap.category)} 设为本周主攻方向，优先提升覆盖率和掌握率。`
        : `Make ${categoryLabel(firstGap.category)} your main focus this week and lift both coverage and mastery.`
    )
  }

  if (secondGap) {
    plans.push(
      isZh.value
        ? `再补 ${categoryLabel(secondGap.category)}，让能力结构更接近 ${learningStore.careerTargetProfile.label} 的要求。`
        : `Then reinforce ${categoryLabel(secondGap.category)} to better match the expectations of ${learningStore.careerTargetProfile.label}.`
    )
  }

  if (!plans.length) {
    plans.push(
      isZh.value
        ? '继续扩大题目覆盖面，并把已掌握知识转成更稳定的表达能力。'
        : 'Keep expanding coverage and turn what you know into more reliable articulation.'
    )
  }

  return plans.slice(0, 3)
})

const categoryLabel = (category: SearchCategory) => {
  if (isZh.value) {
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
    return zhMap[category]
  }

  return i18nStore.t(`common.categories.${category}`)
}

const strengthLine = (mastered: number, tracked: number) =>
  isZh.value
    ? `已掌握 ${mastered} / 已追踪 ${tracked}`
    : `${mastered} mastered out of ${tracked} tracked`

const gapLine = (weak: number, due: number, coverage: number) =>
  isZh.value
    ? `薄弱题 ${weak}，待复习 ${due}，覆盖率 ${coverage}%`
    : `${weak} weak, ${due} due, ${coverage}% coverage`

function profile(id: CareerTarget) {
  if (isZh.value) {
    const zhProfiles: Record<CareerTarget, { id: CareerTarget; label: string; summary: string }> = {
      frontend: { id: 'frontend', label: '前端工程师', summary: '更重视 UI、工程化与浏览器基础。' },
      backend: { id: 'backend', label: '后端工程师', summary: '更重视服务、存储与系统稳定性。' },
      fullstack: { id: 'fullstack', label: '全栈工程师', summary: '追求前后端与系统思维的平衡。' },
      'system-design': { id: 'system-design', label: '高级工程师 / 架构方向', summary: '更重视架构 trade-off 与扩展性。' },
      ai: { id: 'ai', label: 'AI 工程师', summary: '强调 AI 基础与工程落地的结合。' },
      bytedance: { id: 'bytedance', label: '字节跳动', summary: '极致算法、高并发业务场景。' },
      alibaba: { id: 'alibaba', label: '阿里巴巴', summary: '中间件深度、JVM 调优、双 11 架构。' },
      tencent: { id: 'tencent', label: '腾讯', summary: '底层网络、IM 架构、海量并发。' },
    }
    return zhProfiles[id]
  }

  const enProfiles: Record<CareerTarget, { id: CareerTarget; label: string; summary: string }> = {
    frontend: { id: 'frontend', label: 'Frontend Engineer', summary: 'Emphasizes UI delivery, tooling, and browser depth.' },
    backend: { id: 'backend', label: 'Backend Engineer', summary: 'Emphasizes services, storage, and reliability.' },
    fullstack: { id: 'fullstack', label: 'Full Stack Engineer', summary: 'Balances frontend, backend, and systems thinking.' },
    'system-design': { id: 'system-design', label: 'Senior / Architect', summary: 'Emphasizes trade-offs, scale, and architecture.' },
    ai: { id: 'ai', label: 'AI Engineer', summary: 'Blends AI fundamentals with software delivery.' },
    bytedance: { id: 'bytedance', label: 'ByteDance', summary: 'Algorithm intensive, heavy concurrency.' },
    alibaba: { id: 'alibaba', label: 'Alibaba', summary: 'Middlewares, JVM, High Availability.' },
    tencent: { id: 'tencent', label: 'Tencent', summary: 'Network protocols, IM, High Concurrency.' },
  }
  return enProfiles[id]
}
</script>

<style scoped>
.competitiveness-panel {
  margin-bottom: 24px;
  padding: 24px;
  border-radius: 24px;
  background: 
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 40%),
    radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.1), transparent 40%),
    var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  box-shadow: var(--shadow-xl);
  transition: all var(--duration-normal) var(--ease-out);
}

[data-theme='dark'] .competitiveness-panel {
  background:
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 30%),
    radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.1), transparent 30%),
    linear-gradient(145deg, #1e293b, #0f172a);
  border-color: rgba(255, 255, 255, 0.1);
  color: #eff6ff;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.eyebrow,
.section-kicker {
  margin: 0 0 8px;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primary-600);
}

[data-theme='dark'] .eyebrow,
[data-theme='dark'] .section-kicker {
  color: rgba(191, 219, 254, 0.78);
}

.panel-header h2,
.focus-card h3,
.insight-card h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

[data-theme='dark'] .panel-header h2,
[data-theme='dark'] .focus-card h3,
[data-theme='dark'] .insight-card h3 {
  color: #f8fafc;
}

.panel-summary,
.focus-summary {
  margin: 10px 0 0;
  max-width: 720px;
  color: var(--text-secondary);
  line-height: 1.7;
}

[data-theme='dark'] .panel-summary,
[data-theme='dark'] .focus-summary {
  color: rgba(226, 232, 240, 0.86);
}

.panel-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 20px;
  border-radius: 999px;
  color: white;
  background: var(--primary-600);
  text-decoration: none;
  font-weight: 700;
  white-space: nowrap;
  transition: all 0.2s;
}

.panel-link:hover {
  background: var(--primary-700);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-primary);
}

.target-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.target-chip {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  text-align: left;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.target-chip:hover,
.target-chip.active {
  transform: translateY(-2px);
  border-color: var(--primary-400);
  background: var(--card-bg);
  box-shadow: var(--shadow-md);
}

.target-chip.active {
  border-color: var(--primary-600);
  background: rgba(99, 102, 241, 0.05);
}

[data-theme='dark'] .target-chip {
  background: rgba(15, 23, 42, 0.28);
  border-color: rgba(191, 219, 254, 0.2);
  color: #dbeafe;
}

[data-theme='dark'] .target-chip:hover,
[data-theme='dark'] .target-chip.active {
  border-color: rgba(251, 191, 36, 0.8);
  background: rgba(30, 41, 59, 0.72);
}

.target-name {
  font-size: 0.98rem;
  font-weight: 700;
}

.target-desc {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  line-height: 1.5;
}

.hero-grid,
.insight-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 16px;
  margin-top: 18px;
}

.score-card,
.focus-card,
.insight-card {
  min-height: 100%;
  padding: 20px;
  border-radius: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

[data-theme='dark'] .score-card,
[data-theme='dark'] .focus-card,
[data-theme='dark'] .insight-card {
  background: rgba(15, 23, 42, 0.34);
  border: 1px solid rgba(191, 219, 254, 0.16);
  backdrop-filter: blur(8px);
}

.score-card {
  display: flex;
  gap: 18px;
  align-items: center;
}

.score-ring {
  --score: 0%;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(var(--primary-color) var(--score), var(--border-color) 0);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

[data-theme='dark'] .score-ring {
  background: conic-gradient(#fbbf24 var(--score), rgba(148, 163, 184, 0.18) 0);
}

.score-inner {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  background: var(--card-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

[data-theme='dark'] .score-inner {
  background: #0f172a;
}

.score-inner strong {
  font-size: 2rem;
  line-height: 1;
  color: var(--text-primary);
}

.score-inner span {
  margin-top: 4px;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.score-copy h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.score-copy p {
  margin: 10px 0 0;
  line-height: 1.7;
  color: var(--text-secondary);
}

.focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.focus-tag,
.metric-pill,
.insight-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.focus-tag {
  padding: 6px 12px;
  background: var(--primary-100);
  color: var(--primary-700);
}

[data-theme='dark'] .focus-tag {
  background: rgba(59, 130, 246, 0.2);
  color: #dbeafe;
}

.plan-list {
  margin: 16px 0 0;
  padding-left: 18px;
  color: var(--text-secondary);
}

.plan-list li + li {
  margin-top: 10px;
}

.insight-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.insight-badge {
  padding: 6px 12px;
  color: white;
}

.insight-badge.success {
  background: var(--success-500);
}

.insight-badge.warn {
  background: var(--warning-500);
}

.metric-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

[data-theme='dark'] .metric-row {
  background: rgba(30, 41, 59, 0.55);
  border-color: transparent;
}

.metric-row strong {
  color: var(--text-primary);
}

.metric-row p {
  margin: 6px 0 0;
  font-size: 0.84rem;
  color: var(--text-tertiary);
}

.metric-pill {
  min-width: 48px;
  height: 34px;
  padding: 0 10px;
  background: var(--success-50);
  color: var(--success-600);
}

.metric-pill.danger {
  background: var(--warning-50);
  color: var(--warning-600);
}

[data-theme='dark'] .metric-pill {
  background: rgba(134, 239, 172, 0.16);
  color: #bbf7d0;
}

[data-theme='dark'] .metric-pill.danger {
  background: rgba(251, 191, 36, 0.16);
  color: #fde68a;
}

@media (max-width: 960px) {
  .panel-header,
  .score-card {
    flex-direction: column;
  }

  .hero-grid,
  .insight-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .competitiveness-panel {
    padding: 18px;
    border-radius: 20px;
  }

  .target-grid {
    grid-template-columns: 1fr;
  }

  .score-ring {
    width: 120px;
    height: 120px;
  }

  .score-inner {
    width: 88px;
    height: 88px;
  }
}
.resume-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px dashed var(--primary-300);
  padding: 16px;
  transition: all 0.3s ease;
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.resume-badge {
  background: var(--primary-100);
  color: var(--primary-700);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.resume-header h3 {
  margin: 8px 0 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.expand-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--text-tertiary);
  cursor: pointer;
}

.resume-editor-wrap {
  margin-top: 16px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.resume-textarea {
  width: 100%;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  resize: vertical;
}

.resume-footer {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resume-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.save-resume-btn {
  background: var(--primary-600);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.save-resume-btn:hover {
  background: var(--primary-700);
}
</style>

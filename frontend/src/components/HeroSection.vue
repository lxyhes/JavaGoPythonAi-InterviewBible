<template>
  <section class="hero-section">
    <!-- 动态背景 -->
    <div class="hero-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="grid-pattern"></div>
    </div>

    <!-- 内容区域 -->
    <div class="hero-content">
      <!-- 标签 -->
      <div class="hero-badge animate-fade-in-down">
        <PhosphorIcon name="sparkle" :size="16" weight="fill" />
        <span>系统化面试准备平台</span>
      </div>

      <!-- 主标题 -->
      <h1 class="hero-title">
        <span class="title-line animate-fade-in-up" style="animation-delay: 100ms">
          掌握技术
        </span>
        <span class="title-line animate-fade-in-up" style="animation-delay: 200ms">
          <span class="gradient-text">成就未来</span>
        </span>
      </h1>

      <!-- 副标题 -->
      <p class="hero-subtitle animate-fade-in-up" style="animation-delay: 300ms">
        覆盖前端、后端、数据库、算法等核心技术领域<br />
        助你高效备战技术面试，轻松拿下心仪 Offer
      </p>

      <!-- 统计数据 -->
      <div class="hero-stats animate-fade-in-up" style="animation-delay: 400ms">
        <div class="stat-item">
          <div class="stat-number">1000+</div>
          <div class="stat-label">精选题目</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">9</div>
          <div class="stat-label">技术领域</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">AI</div>
          <div class="stat-label">智能辅导</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="hero-actions animate-fade-in-up" style="animation-delay: 500ms">
        <router-link to="/practice" class="btn-primary btn-large">
          <PhosphorIcon name="rocket-launch" :size="20" weight="fill" />
          开始学习
        </router-link>
        <router-link to="/search" class="btn-secondary btn-large">
          <PhosphorIcon name="magnifying-glass" :size="20" />
          搜索题目
        </router-link>
      </div>

      <!-- 欢迎回来提示 -->
      <Transition name="slide-up">
        <div v-if="comebackMessage" class="comeback-banner">
          <PhosphorIcon name="hand-waving" :size="24" weight="fill" />
          <span>{{ comebackMessage }}</span>
        </div>
      </Transition>
    </div>

    <!-- 浮动元素 -->
    <div class="floating-elements">
      <div class="float-card card-1">
        <PhosphorIcon name="code" :size="24" weight="fill" />
        <span>前端</span>
      </div>
      <div class="float-card card-2">
        <PhosphorIcon name="database" :size="24" weight="fill" />
        <span>后端</span>
      </div>
      <div class="float-card card-3">
        <PhosphorIcon name="tree-structure" :size="24" weight="fill" />
        <span>算法</span>
      </div>
      <div class="float-card card-4">
        <PhosphorIcon name="robot" :size="24" weight="fill" />
        <span>AI</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLearningStore } from '@/stores/learning'
import PhosphorIcon from './PhosphorIcon.vue'

const learningStore = useLearningStore()

const comebackMessage = computed(() => {
  if (learningStore.inactiveDays >= 3) {
    return `欢迎回来！你已经 ${learningStore.inactiveDays} 天没有学习了，继续加油！`
  }
  if (learningStore.inactiveDays >= 1) {
    return '欢迎回来！今天也要坚持学习哦～'
  }
  return ''
})
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  overflow: hidden;
}

/* 动态背景 */
.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  bottom: -100px;
  left: -100px;
  animation-delay: -2s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  top: 50%;
  left: 20%;
  animation-delay: -4s;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
}

/* 内容区域 */
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--rounded-full);
  color: var(--primary-600);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 32px;
}

.hero-badge :deep(svg) {
  color: var(--primary-500);
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.title-line {
  display: block;
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 统计数据 */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 4px;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--border-color) 50%,
    transparent 100%
  );
}

/* 操作按钮 */
.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.125rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--rounded-xl);
  font-weight: 600;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-secondary:hover {
  border-color: var(--primary-300);
  background: rgba(99, 102, 241, 0.05);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 欢迎回来提示 */
.comeback-banner {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fbbf24;
  border-radius: var(--rounded-2xl);
  color: #92400e;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
}

.comeback-banner :deep(svg) {
  color: #f59e0b;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
}

/* 浮动元素 */
.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--rounded-2xl);
  box-shadow: var(--shadow-lg);
  font-weight: 600;
  color: var(--text-primary);
  animation: float 6s ease-in-out infinite;
}

.float-card :deep(svg) {
  color: var(--primary-500);
}

.card-1 {
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 40%;
  left: 8%;
  animation-delay: -1.5s;
}

.card-3 {
  bottom: 30%;
  right: 15%;
  animation-delay: -3s;
}

.card-4 {
  bottom: 25%;
  left: 12%;
  animation-delay: -4.5s;
}

/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all var(--duration-normal) var(--ease-out);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 40px 20px;
  }

  .hero-stats {
    gap: 20px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-divider {
    height: 30px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-large {
    width: 100%;
    justify-content: center;
  }

  .floating-elements {
    display: none;
  }

  .comeback-banner {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .hero-badge {
    padding: 8px 16px;
    font-size: 0.8125rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>

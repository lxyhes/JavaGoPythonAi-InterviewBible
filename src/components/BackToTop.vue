<template>
  <div class="back-to-top-wrapper">
    <!-- 进度圆环 -->
    <div v-show="isVisible" class="progress-ring">
      <svg viewBox="0 0 36 36">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #6366f1" />
            <stop offset="100%" style="stop-color: #a855f7" />
          </linearGradient>
        </defs>
        <path class="progress-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <path
          class="progress-ring-fill"
          :stroke-dasharray="`${progress}, 100`"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
    </div>

    <!-- 回到顶部按钮 -->
    <button
      class="back-to-top"
      :class="{ show: isVisible }"
      title="回到顶部"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <span class="arrow">↑</span>
      <span class="percent">{{ Math.round(progress) }}%</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const isVisible = ref(false)
const progress = ref(0)
let rafId: number | null = null

const checkVisibility = () => {
  isVisible.value = window.scrollY > 400
  progress.value = store.readingProgress
}

const scrollToTop = () => {
  const start = window.scrollY
  const duration = 800
  const startTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // easeOutCubic 缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3)

    window.scrollTo(0, start * (1 - easeProgress))

    if (progress < 1) {
      rafId = requestAnimationFrame(animate)
    }
  }

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('scroll', checkVisibility, { passive: true })
  checkVisibility()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkVisibility)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.back-to-top-wrapper {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.progress-ring {
  width: 52px;
  height: 52px;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-ring svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-ring-bg {
  fill: none;
  stroke: var(--border-color);
  stroke-width: 2;
}

.progress-ring-fill {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dasharray 0.1s linear;
}

.back-to-top {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--primary-gradient);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  pointer-events: none;
  position: relative;
}

.back-to-top.show {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.back-to-top:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: var(--shadow-xl);
}

.back-to-top .arrow {
  font-size: 18px;
  line-height: 1;
  transition: transform 0.3s;
}

.back-to-top:hover .arrow {
  transform: translateY(-2px);
}

.back-to-top .percent {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .back-to-top-wrapper {
    bottom: 20px;
    right: 20px;
  }

  .back-to-top {
    width: 44px;
    height: 44px;
  }

  .progress-ring {
    width: 44px;
    height: 44px;
  }
}
</style>

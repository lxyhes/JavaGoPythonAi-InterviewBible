<template>
  <div class="loading-spinner" :class="{ 'overlay': overlay, 'fullscreen': fullscreen }">
    <div class="spinner-container">
      <div class="spinner" :class="size">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'small' | 'medium' | 'large'
  text?: string
  overlay?: boolean
  fullscreen?: boolean
}>(), {
  size: 'medium',
  text: '',
  overlay: false,
  fullscreen: false
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner.overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 100;
}

.loading-spinner.fullscreen {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  z-index: 9999;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  position: relative;
}

.spinner.small {
  width: 24px;
  height: 24px;
}

.spinner.medium {
  width: 48px;
  height: 48px;
}

.spinner.large {
  width: 64px;
  height: 64px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--primary-500);
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(1) {
  animation-duration: 1s;
}

.spinner-ring:nth-child(2) {
  animation-duration: 1.5s;
  animation-direction: reverse;
  border-top-color: var(--primary-400);
  transform: scale(0.8);
}

.spinner-ring:nth-child(3) {
  animation-duration: 2s;
  border-top-color: var(--primary-300);
  transform: scale(0.6);
}

.loading-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 暗黑模式 */
[data-theme='dark'] .loading-spinner.overlay,
[data-theme='dark'] .loading-spinner.fullscreen {
  background: rgba(15, 23, 42, 0.8);
}
</style>

<template>
  <div class="reading-progress-bar" :style="{ width: `${progress}%` }"></div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const progress = computed(() => store.readingProgress)

onMounted(() => {
  window.addEventListener(
    'scroll',
    () => {
      store.updateReadingProgress()
    },
    { passive: true }
  )
})
</script>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  z-index: 1000;
  transition: width 0.1s linear;
}

@media (max-width: 1024px) {
  .reading-progress-bar {
    left: 0;
  }
}
</style>

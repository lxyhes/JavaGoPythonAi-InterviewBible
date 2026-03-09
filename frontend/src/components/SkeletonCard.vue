<template>
  <div class="skeleton-card" :class="{ 'animated': animated }">
    <div v-if="showAvatar" class="skeleton-avatar"></div>
    <div class="skeleton-content">
      <div v-if="showTitle" class="skeleton-title"></div>
      <div v-if="showParagraph" class="skeleton-paragraph">
        <div v-for="i in lines" :key="i" class="skeleton-line" :style="{ width: `${getRandomWidth()}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  showAvatar?: boolean
  showTitle?: boolean
  showParagraph?: boolean
  lines?: number
  animated?: boolean
}>(), {
  showAvatar: false,
  showTitle: true,
  showParagraph: true,
  lines: 3,
  animated: true
})

const getRandomWidth = () => {
  return Math.floor(Math.random() * 40) + 60
}
</script>

<style scoped>
.skeleton-card {
  padding: 24px;
  background: var(--card-bg);
  border-radius: var(--rounded-2xl);
  border: 1px solid var(--border-color);
}

.skeleton-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--rounded-xl);
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-300) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  margin-bottom: 16px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  border-radius: var(--rounded-md);
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-300) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
}

.skeleton-paragraph {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 16px;
  border-radius: var(--rounded-md);
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-300) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
}

.animated .skeleton-avatar,
.animated .skeleton-title,
.animated .skeleton-line {
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

[data-theme='dark'] .skeleton-avatar,
[data-theme='dark'] .skeleton-title,
[data-theme='dark'] .skeleton-line {
  background: linear-gradient(
    90deg,
    var(--gray-700) 25%,
    var(--gray-600) 50%,
    var(--gray-700) 75%
  );
  background-size: 200% 100%;
}
</style>

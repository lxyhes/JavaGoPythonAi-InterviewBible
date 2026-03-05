<template>
  <button
    class="mobile-menu-btn"
    :class="{ open: store.sidebarOpen }"
    :aria-expanded="store.sidebarOpen"
    aria-label="切换菜单"
    @click="store.toggleSidebar"
  >
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
  </button>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const store = useAppStore()
</script>

<style scoped>
.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 101;
  width: 48px;
  height: 48px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s;
}

.line {
  width: 20px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s;
  transform-origin: center;
}

.mobile-menu-btn.open .line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.mobile-menu-btn.open .line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.open .line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 1024px) {
  .mobile-menu-btn {
    display: flex;
  }
}
</style>

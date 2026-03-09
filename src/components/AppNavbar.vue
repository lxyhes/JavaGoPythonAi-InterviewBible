<template>
  <nav class="app-navbar" :class="{ 'is-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">
        <span class="brand-icon">📚</span>
        <span class="brand-text">面试指南</span>
      </router-link>

      <!-- 主导航链接 -->
      <div class="navbar-links" :class="{ 'is-open': mobileMenuOpen }">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
          @click="mobileMenuOpen = false"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.label }}</span>
        </router-link>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <!-- 搜索按钮 -->
        <button class="action-btn search-btn" title="搜索 (Ctrl+K)" @click="goToSearch">
          <span class="btn-icon">🔍</span>
          <span class="shortcut">Ctrl+K</span>
        </button>

        <!-- 主题切换 -->
        <button
          class="action-btn theme-btn"
          :title="appStore.isDark ? '切换到亮色模式' : '切换到暗色模式'"
          @click="appStore.toggleTheme"
        >
          <span class="btn-icon">{{ appStore.isDark ? '☀️' : '🌙' }}</span>
        </button>

        <!-- 用户状态 -->
        <div class="user-stats">
          <div class="stat-item" title="等级">
            <span class="stat-icon">⭐</span>
            <span class="stat-value">Lv.{{ learningStore.level }}</span>
          </div>
          <div class="stat-item" title="连续学习">
            <span class="stat-icon">🔥</span>
            <span class="stat-value">{{ learningStore.streakDays }}</span>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <span class="hamburger" :class="{ 'is-open': mobileMenuOpen }"></span>
        </button>
      </div>
    </div>

    <!-- 移动端菜单遮罩 -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useLearningStore } from '@/stores/learning'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const learningStore = useLearningStore()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const navItems = [
  { path: '/', icon: '🏠', label: '首页' },
  { path: '/practice', icon: '✏️', label: '练习' },
  { path: '/review', icon: '🔄', label: '复习' },
  { path: '/dashboard', icon: '📊', label: '看板' },
  { path: '/community', icon: '💬', label: '社区' },
  { path: '/leaderboard', icon: '🏆', label: '排行' },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const goToSearch = () => {
  router.push('/search')
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  transition: all var(--transition-base);
}

.app-navbar.is-scrolled {
  box-shadow: var(--shadow-md);
  background: rgba(var(--card-bg-rgb, 255, 255, 255), 0.95);
  backdrop-filter: blur(10px);
}

.navbar-container {
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* Logo */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.brand-icon {
  font-size: 1.5rem;
}

.brand-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 导航链接 */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-link.active {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.nav-icon {
  font-size: 1.1rem;
}

/* 右侧操作区 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px
<template>
  <nav class="app-navbar" :class="{ 'is-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">
        <PhosphorIcon name="book-bookmark" class="brand-icon" :size="28" weight="fill" />
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
          <PhosphorIcon :name="item.icon" class="nav-icon" :size="20" />
          <span class="nav-text">{{ item.label }}</span>
        </router-link>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <!-- 搜索按钮 -->
        <button class="action-btn search-btn" title="搜索 (Ctrl+K)" @click="goToSearch">
          <PhosphorIcon name="magnifying-glass" class="btn-icon" :size="20" />
          <span class="shortcut">Ctrl+K</span>
        </button>

        <!-- 主题切换 -->
        <button
          class="action-btn theme-btn"
          :title="appStore.isDark ? '切换到亮色模式' : '切换到暗色模式'"
          @click="appStore.toggleTheme"
        >
          <PhosphorIcon
            :name="appStore.isDark ? 'sun' : 'moon-stars'"
            class="btn-icon"
            :size="20"
          />
        </button>

        <!-- 用户状态 - 未登录 -->
        <template v-if="!authStore.isLoggedIn">
          <a-button type="primary" size="small" @click="goToLogin">
            {{ t('auth.login') }}
          </a-button>
        </template>

        <!-- 用户状态 - 已登录 -->
        <template v-else>
          <div class="user-stats">
            <div class="stat-item" title="等级">
              <PhosphorIcon name="star" class="stat-icon" :size="16" weight="fill" />
              <span class="stat-value">Lv.{{ learningStore.level }}</span>
            </div>
            <div class="stat-item" title="连续学习">
              <PhosphorIcon name="lightning" class="stat-icon" :size="16" weight="fill" />
              <span class="stat-value">{{ learningStore.streakDays }}</span>
            </div>
          </div>

          <!-- 用户下拉菜单 -->
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <div class="user-avatar-wrapper">
              <a-avatar
                :size="36"
                :style="{ background: 'var(--primary-gradient)', cursor: 'pointer' }"
              >
                <template v-if="authStore.userAvatar">
                  <img :src="authStore.userAvatar" :alt="authStore.userDisplayName" />
                </template>
                <template v-else>
                  {{ getAvatarText(authStore.userDisplayName) }}
                </template>
              </a-avatar>
            </div>
            <template #overlay>
              <a-menu class="user-dropdown-menu">
                <div class="user-info-header">
                  <a-avatar
                    :size="48"
                    :style="{ background: 'var(--primary-gradient)' }"
                  >
                    <template v-if="authStore.userAvatar">
                      <img :src="authStore.userAvatar" :alt="authStore.userDisplayName" />
                    </template>
                    <template v-else>
                      {{ getAvatarText(authStore.userDisplayName) }}
                    </template>
                  </a-avatar>
                  <div class="user-info-text">
                    <div class="user-name">{{ authStore.userDisplayName }}</div>
                    <div class="user-email">{{ authStore.currentUser?.email }}</div>
                  </div>
                </div>
                <a-menu-divider />
                <a-menu-item key="dashboard" @click="goToDashboard">
                  <DashboardOutlined />
                  <span>{{ t('dashboard.title') }}</span>
                </a-menu-item>
                <a-menu-item key="profile" @click="goToProfile">
                  <UserOutlined />
                  <span>{{ t('auth.profile') }}</span>
                </a-menu-item>
                <a-menu-item key="settings" @click="goToSettings">
                  <SettingOutlined />
                  <span>{{ t('auth.settings') }}</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  <span>{{ t('auth.logout') }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>

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
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import { useAppStore } from '@/stores/app'
import { useLearningStore } from '@/stores/learning'
import { useAuthStore } from '@/stores/auth'
import { useI18nStore } from '@/stores/i18n'
import PhosphorIcon from './PhosphorIcon.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const learningStore = useLearningStore()
const authStore = useAuthStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const navItems = [
  { path: '/', icon: 'house', label: '首页' },
  { path: '/practice', icon: 'pencil-simple', label: '练习' },
  { path: '/review', icon: 'arrow-counter-clockwise', label: '复习' },
  { path: '/dashboard', icon: 'squares-four', label: '看板' },
  { path: '/community', icon: 'users', label: '社区' },
  { path: '/leaderboard', icon: 'trophy', label: '排行' },
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

const goToLogin = () => {
  router.push('/login')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToProfile = () => {
  // TODO: Navigate to profile page when available
  message.info('个人中心功能开发中...')
}

const goToSettings = () => {
  // TODO: Navigate to settings page when available
  message.info('账号设置功能开发中...')
}

const handleLogout = () => {
  authStore.logout()
  message.success('已退出登录')
  router.push('/')
}

const getAvatarText = (name: string) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
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
  color: var(--primary-color);
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

.nav-link.active .nav-icon {
  color: var(--primary-color);
}

.nav-icon {
  color: var(--text-muted);
}

/* 右侧操作区 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.search-btn .shortcut {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

/* 用户状态 */
.user-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
  margin-left: 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.stat-icon {
  color: var(--accent-color);
}

.stat-value {
  color: var(--primary-color);
}

/* 用户头像 */
.user-avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.user-avatar-wrapper:hover {
  background: var(--bg-secondary);
}

/* 用户下拉菜单 */
:global(.user-dropdown-menu) {
  min-width: 220px !important;
  padding: 8px 0 !important;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.user-info-text {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:global(.user-dropdown-menu .ant-dropdown-menu-item) {
  padding: 10px 16px !important;
  display: flex;
  align-items: center;
  gap: 10px;
}

:global(.user-dropdown-menu .ant-dropdown-menu-item .anticon) {
  font-size: 16px;
  color: var(--text-secondary);
}

:global(.user-dropdown-menu .ant-dropdown-menu-item:hover .anticon) {
  color: var(--primary-color);
}

/* 移动端菜单按钮 */
.mobile-menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  position: relative;
  transition: all var(--transition-fast);
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  transition: all var(--transition-fast);
}

.hamburger::before {
  top: -7px;
}

.hamburger::after {
  top: 7px;
}

.hamburger.is-open {
  background: transparent;
}

.hamburger.is-open::before {
  top: 0;
  transform: rotate(45deg);
}

.hamburger.is-open::after {
  top: 0;
  transform: rotate(-45deg);
}

/* 移动端遮罩 */
.mobile-overlay {
  display: none;
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 响应式 */
@media (max-width: 1024px) {
  .navbar-container {
    padding: 0 16px;
  }

  .nav-text {
    display: none;
  }

  .nav-link {
    padding: 8px;
  }

  .search-btn .shortcut {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar-links {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--card-bg);
    flex-direction: column;
    padding: 16px;
    gap: 4px;
    border-bottom: 1px solid var(--border-color);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
    justify-content: flex-start;
  }

  .navbar-links.is-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    width: 100%;
    padding: 12px 16px;
  }

  .nav-text {
    display: inline;
  }

  .mobile-menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-overlay {
    display: block;
  }

  .user-stats {
    display: none;
  }
}

@media (max-width: 480px) {
  .brand-text {
    display: none;
  }

  .search-btn {
    padding: 8px;
  }
}
</style>

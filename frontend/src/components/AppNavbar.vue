<template>
  <nav class="app-navbar" :class="{ 'is-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">
        <div class="brand-icon-wrapper mastermind">
          <svg viewBox="0 0 40 40" class="logo-svg-v3">
            <defs>
              <linearGradient id="masterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7" />
                <stop offset="100%" style="stop-color:#6366f1" />
              </linearGradient>
            </defs>
            <rect x="6" y="10" width="28" height="20" rx="6" fill="url(#masterGrad)" />
            <path d="M4,16 L6,16 L6,24 L4,24 Z" fill="#a855f7" />
            <path d="M34,16 L36,16 L36,24 L34,24 Z" fill="#6366f1" />
            <rect x="10" y="14" width="20" height="12" rx="3" fill="#0f172a" fill-opacity="0.8" />
            <path d="M12,20 L16,20 L18,16 L22,24 L24,20 L28,20" 
              stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              class="pulse-line-v2" />
            <circle cx="20" cy="6" r="2" fill="#a855f7" />
            <line x1="20" y1="6" x2="20" y2="10" stroke="#a855f7" stroke-width="1" />
          </svg>
        </div>
        <div class="brand-text-container luxury">
          <span class="brand-text main-eng">INTERVIEW</span>
          <span class="brand-text sub-eng">G U I D E · B I B L E</span>
        </div>
      </router-link>

      <!-- 主导航链接 -->
      <div class="navbar-links" :class="{ 'is-open': mobileMenuOpen }">
        <router-link
          v-for="(item, index) in localizedNavItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
          :style="{ animationDelay: `${index * 50}ms` }"
          @click="mobileMenuOpen = false"
        >
          <div class="nav-icon-wrapper">
            <PhosphorIcon :name="item.icon" class="nav-icon" :size="20" />
          </div>
          <span class="nav-text">{{ item.label }}</span>
          <div class="nav-indicator"></div>
        </router-link>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <!-- 搜索按钮 -->
        <button class="action-btn search-btn" :title="i18nStore.t('home.actions.searchTitle')" @click="goToSearch">
          <PhosphorIcon name="magnifying-glass" class="btn-icon" :size="20" />
          <span class="shortcut">Ctrl+K</span>
        </button>

        <!-- 语言切换 (落地点) -->
        <button class="action-btn lang-btn" @click="i18nStore.toggleLocale" :title="i18nStore.t('app.language')">
          <PhosphorIcon name="translate" class="btn-icon" :size="20" />
          <span class="lang-text">{{ i18nStore.locale === 'zh' ? 'EN' : '中' }}</span>
        </button>

        <!-- 主题切换 -->
        <button
          class="action-btn theme-btn"
          :title="appStore.isDark ? '切换到亮色模式' : '切换到暗色模式'"
          @click="toggleTheme"
        >
          <div class="theme-icon-wrapper" :class="{ 'is-dark': appStore.isDark }">
            <PhosphorIcon
              :name="appStore.isDark ? 'sun' : 'moon-stars'"
              class="btn-icon"
              :size="20"
            />
          </div>
        </button>

        <!-- 用户状态 - 未登录 -->
        <template v-if="!authStore.isLoggedIn">
          <a-button type="primary" size="small" class="login-btn" @click="goToLogin">
            <PhosphorIcon name="sign-in" :size="16" />
            {{ t('auth.login') }}
          </a-button>
        </template>

        <!-- 用户状态 - 已登录 -->
        <template v-else>
          <div class="user-stats">
            <div class="stat-item" title="等级">
              <div class="stat-icon-wrapper level">
                <PhosphorIcon name="star" class="stat-icon" :size="16" weight="fill" />
              </div>
              <span class="stat-value">Lv.{{ learningStore.level }}</span>
            </div>
            <div class="stat-item" title="连续学习">
              <div class="stat-icon-wrapper streak">
                <PhosphorIcon name="lightning" class="stat-icon" :size="16" weight="fill" />
              </div>
              <span class="stat-value">{{ learningStore.streakDays }}</span>
            </div>
          </div>

          <!-- 用户下拉菜单 -->
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <div class="user-avatar-wrapper">
              <a-badge :dot="hasNotifications">
                <a-avatar
                  :size="38"
                  class="user-avatar"
                  :style="{ background: 'var(--gradient-primary)' }"
                >
                  <template v-if="authStore.userAvatar">
                    <img :src="authStore.userAvatar" :alt="authStore.userDisplayName" />
                  </template>
                  <template v-else>
                    {{ getAvatarText(authStore.userDisplayName) }}
                  </template>
                </a-avatar>
              </a-badge>
            </div>
            <template #overlay>
              <a-menu class="user-dropdown-menu">
                <div class="user-info-header">
                  <a-avatar
                    :size="48"
                    class="user-avatar-large"
                    :style="{ background: 'var(--gradient-primary)' }"
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
                    <div class="user-level">
                      <PhosphorIcon name="star" :size="12" weight="fill" />
                      等级 {{ learningStore.level }}
                    </div>
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
                <a-menu-item key="logout" @click="handleLogout" class="logout-item">
                  <LogoutOutlined />
                  <span>{{ t('auth.logout') }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <div class="hamburger" :class="{ 'is-open': mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>

    <!-- 移动端菜单遮罩 -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const hasNotifications = ref(false)
let ticking = false

const navItems = [
  { path: '/', icon: 'house', zh: '首页', en: 'Home' },
  { path: '/practice', icon: 'pencil-simple', zh: '练习', en: 'Practice' },
  { path: '/mock-interview', icon: 'exam', zh: '模拟', en: 'Mock' },
  { path: '/review', icon: 'arrow-counter-clockwise', zh: '复习', en: 'Review' },
  { path: '/dashboard', icon: 'squares-four', zh: '看板', en: 'Stats' },
  { path: '/notes', icon: 'notebook', zh: '笔记', en: 'Notes' },
]

const localizedNavItems = computed(() => {
  return navItems.map(item => ({
    ...item,
    label: i18nStore.locale === 'zh' ? item.zh : item.en
  }))
})

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
  message.info('个人中心功能开发中...')
}

const goToSettings = () => {
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

const toggleTheme = () => {
  appStore.toggleTheme()
}

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      
      // 检测是否滚动超过阈值（只改变样式，不隐藏）
      isScrolled.value = currentScrollY > 10
      
      ticking = false
    })
    ticking = true
  }
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
  z-index: 9999;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  transition: all var(--duration-normal) var(--ease-out);
}

.app-navbar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--card-bg);
  border-bottom: 1px solid transparent;
  transition: all var(--duration-normal) var(--ease-out);
  z-index: -1;
}

.app-navbar.is-scrolled {
  height: 64px;
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: var(--border-color);
  box-shadow: var(--shadow-md);
}

.app-navbar.is-scrolled::before {
  background: rgba(var(--card-bg-rgb, 255, 255, 255), 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: var(--border-color);
}

.app-navbar.is-hidden {
  transform: translateY(-100%);
}

.navbar-container {
  position: relative;
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
  gap: 12px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
  transition: transform var(--duration-fast) var(--ease-out);
}

.navbar-brand:hover {
  transform: scale(1.02);
}

.brand-icon-wrapper.premium {
  background: none;
  box-shadow: none;
}

.logo-svg {
  width: 40px;
  height: 40px;
}

.logo-bg {
  fill: url(#logoGradient);
}

.logo-q {
  fill: white;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 900;
  font-size: 24px;
}

/* 在模板中增加 Lin*/
.brand-icon-wrapper.career-pilot {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-svg-v4 {
  width: 44px;
  height: 44px;
}

.brand-icon-wrapper.mastermind {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
}

.logo-svg-v3 {
  width: 44px;
  height: 44px;
}

.pulse-line-v2 {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: pulseBeat 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes pulseBeat {
  0% { stroke-dashoffset: 40; opacity: 0; }
  10% { opacity: 1; }
  50% { stroke-dashoffset: 0; }
  90% { opacity: 1; }
  100% { stroke-dashoffset: -40; opacity: 0; }
}

.brand-text-container.luxury {
  display: flex;
  flex-direction: column;
  line-height: 1;
  margin-left: 8px;
}

.brand-text.main-eng {
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
}

.brand-text.sub-eng {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 5px;
  background: linear-gradient(to right, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 2px;
  text-transform: uppercase;
}

.navbar-brand:hover .logo-svg-v3 {
  transform: scale(1.1) rotate(-3deg);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[lang='en'] .brand-text.sub-eng {
  letter-spacing: 6px;
}

.globe-main {
  animation: globeRotate 20s linear infinite;
  transform-origin: center;
}

@keyframes globeRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: orbitEntry 2s ease-out forwards;
}

@keyframes orbitEntry {
  to { stroke-dashoffset: 0; }
}

.brand-text.main-v2 {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-text.sub-v2 {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 4px;
  color: #fbbf24;
  margin-top: 1px;
}

.navbar-brand:hover .rocket-tip {
  transform: translate(2px, -2px);
  filter: drop-shadow(0 0 5px #fbbf24);
  transition: all 0.3s ease;
}

[lang='en'] .brand-text.sub-v2 {
  letter-spacing: 5px;
}

.brand-text.meta {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 3px;
  filter: brightness(1.2) drop-shadow(0 0 10px rgba(99, 102, 241, 0.4));
  transition: all 0.3s ease;
}

[lang='en'] .brand-text {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  letter-spacing: -0.03em;
  font-size: 1.15rem;
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--rounded-xl);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all var(--duration-fast) var(--ease-out);
  overflow: hidden;
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
}

.nav-link:hover {
  color: var(--primary-600);
  background: rgba(99, 102, 241, 0.08);
}

.nav-link.active {
  color: var(--primary-600);
  background: rgba(99, 102, 241, 0.12);
  font-weight: 600;
}

.nav-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-fast) var(--ease-out);
}

.nav-link:hover .nav-icon-wrapper {
  transform: scale(1.15) rotate(-5deg);
}

.nav-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: var(--rounded-full);
  transition: transform var(--duration-fast) var(--ease-out);
}

.nav-link.active .nav-indicator {
  transform: translateX(-50%) scaleX(1);
}

/* 右侧操作区 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--rounded-xl);
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.action-btn:hover {
  border-color: var(--primary-300);
  color: var(--primary-600);
  background: rgba(99, 102, 241, 0.05);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.search-btn .shortcut {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 3px 8px;
  border-radius: var(--rounded-md);
  font-weight: 500;
}

.theme-icon-wrapper {
  transition: transform var(--duration-normal) var(--ease-spring);
}

.theme-icon-wrapper.is-dark {
  transform: rotate(180deg);
}

/* 登录按钮 */
.login-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--gradient-primary) !important;
  border: none !important;
  border-radius: var(--rounded-xl) !important;
  padding: 0 16px !important;
  height: 38px !important;
  font-weight: 600 !important;
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-out) !important;
}

.login-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-md), var(--shadow-glow-primary) !important;
}

/* 用户状态 */
.user-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 16px;
  background: rgba(99, 102, 241, 0.06);
  border-radius: var(--rounded-2xl);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-icon-wrapper {
  width: 24px;
  height: 24px;
  border-radius: var(--rounded-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-out);
}

.stat-icon-wrapper.level {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.stat-icon-wrapper.streak {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

.stat-icon-wrapper:hover {
  transform: scale(1.15) rotate(10deg);
}

.stat-icon {
  color: white;
}

.stat-value {
  color: var(--text-primary);
}

/* 用户头像 */
.user-avatar-wrapper {
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all var(--duration-fast) var(--ease-out);
}

.user-avatar-wrapper:hover {
  background: rgba(99, 102, 241, 0.1);
}

.user-avatar {
  border: 2px solid transparent;
  transition: all var(--duration-fast) var(--ease-out);
}

.user-avatar-wrapper:hover .user-avatar {
  border-color: var(--primary-300);
  transform: scale(1.05);
  box-shadow: var(--shadow-glow-primary);
}

/* 用户下拉菜单 */
:global(.user-dropdown-menu) {
  min-width: 260px !important;
  padding: 8px 0 !important;
  border-radius: var(--rounded-2xl) !important;
  box-shadow: var(--shadow-xl) !important;
  border: 1px solid var(--border-color) !important;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
}

.user-avatar-large {
  border: 3px solid white;
  box-shadow: var(--shadow-md);
}

.user-info-text {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.user-level {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--primary-600);
  background: rgba(99, 102, 241, 0.1);
  padding: 2px 8px;
  border-radius: var(--rounded-full);
  margin-top: 6px;
  font-weight: 600;
}

:global(.user-dropdown-menu .ant-dropdown-menu-item) {
  padding: 12px 20px !important;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 8px;
  border-radius: var(--rounded-lg);
  transition: all var(--duration-fast) var(--ease-out);
}

:global(.user-dropdown-menu .ant-dropdown-menu-item:hover) {
  background: rgba(99, 102, 241, 0.08) !important;
}

:global(.user-dropdown-menu .ant-dropdown-menu-item .anticon) {
  font-size: 18px;
  color: var(--text-secondary);
  transition: color var(--duration-fast) var(--ease-out);
}

:global(.user-dropdown-menu .ant-dropdown-menu-item:hover .anticon) {
  color: var(--primary-600);
}

:global(.user-dropdown-menu .logout-item) {
  color: var(--error-500) !important;
}

:global(.user-dropdown-menu .logout-item .anticon) {
  color: var(--error-500) !important;
}

/* 移动端菜单按钮 */
.mobile-menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 10px;
  border-radius: var(--rounded-xl);
  transition: background var(--duration-fast) var(--ease-out);
}

.mobile-menu-toggle:hover {
  background: rgba(99, 102, 241, 0.08);
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: var(--rounded-full);
  transition: all var(--duration-normal) var(--ease-spring);
  transform-origin: center;
}

.hamburger.is-open span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger.is-open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.is-open span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
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
  backdrop-filter: blur(4px);
  z-index: 999;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
    padding: 10px;
  }

  .search-btn .shortcut {
    display: none;
  }

  .user-stats {
    padding: 4px 12px;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .app-navbar {
    height: 56px;
  }

  .app-navbar.is-scrolled {
    height: 56px;
  }

  .brand-icon-wrapper {
    width: 36px;
    height: 36px;
  }

  .navbar-links {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    background: rgba(var(--card-bg-rgb, 255, 255, 255), 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 20px;
    gap: 8px;
    border-bottom: 1px solid var(--border-color);
    transform: translateY(-150%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--duration-normal) var(--ease-out);
    justify-content: flex-start;
    box-shadow: var(--shadow-lg);
  }

  .navbar-links.is-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    width: 100%;
    padding: 14px 20px;
    border-radius: var(--rounded-xl);
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

  .action-btn {
    padding: 8px 10px;
  }
}

@media (max-width: 480px) {
  .brand-text {
    display: none;
  }

  .search-btn {
    padding: 8px;
  }

  .lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
}

.lang-text {
  font-size: 0.7rem;
  font-weight: 800;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1;
}

.lang-btn:hover .lang-text {
  background: var(--primary-600);
  color: white;
}

.theme-btn {
  margin-left: 4px;
}
}
</style>

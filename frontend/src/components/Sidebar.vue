<template>
  <aside class="sidebar" :class="{ open: store.sidebarOpen }">
    <div class="sidebar-header">
      <div class="sidebar-title">
        <PhosphorIcon :name="config.icon" :size="28" class="title-icon" />
        {{ config.title }}
      </div>
      <div class="sidebar-subtitle">大纲导航</div>
      <button
        class="theme-toggle"
        :title="store.isDark ? '切换到亮色模式' : '切换到暗色模式'"
        @click="store.toggleTheme"
      >
        <PhosphorIcon :name="store.isDark ? 'Sun' : 'Moon'" :size="20" />
      </button>
    </div>

    <nav class="nav-menu">
      <template v-for="category in config.categories" :key="category.name">
        <li class="nav-category">{{ category.name }}</li>
        <li v-for="item in category.items" :key="item.id" class="nav-item">
          <a
            href="#"
            class="nav-link"
            :class="{ active: store.currentSection === item.id }"
            @click.prevent="scrollToSection(item.id)"
          >
            <PhosphorIcon :name="item.icon" :size="18" class="nav-icon" />
            {{ item.title }}
          </a>
        </li>
      </template>
    </nav>

    <div class="sidebar-footer">
      <!-- User Section -->
      <div v-if="authStore.isLoggedIn" class="user-section">
        <a-dropdown placement="topLeft">
          <a-space class="user-info" align="center">
            <a-avatar :size="32" :style="{ background: 'var(--primary-gradient)' }">
              {{ authStore.currentUser?.username?.[0]?.toUpperCase() }}
            </a-avatar>
            <span class="username">{{ authStore.currentUser?.username }}</span>
            <DownOutlined />
          </a-space>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile">
                <UserOutlined />
                {{ t('auth.profile') }}
              </a-menu-item>
              <a-menu-item key="settings">
                <SettingOutlined />
                {{ t('auth.settings') }}
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <LogoutOutlined />
                {{ t('auth.logout') }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <router-link v-else to="/login" class="login-link">
        <LoginOutlined />
        {{ t('auth.login') }}
      </router-link>

      <router-link to="/" class="back-link">
        <PhosphorIcon name="ArrowLeft" :size="16" />
        返回首页
      </router-link>
    </div>
  </aside>

  <!-- 遮罩层 -->
  <div class="sidebar-overlay" :class="{ show: store.sidebarOpen }" @click="store.toggleSidebar"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useI18nStore } from '@/stores/i18n'
import type { NavConfig } from '@/types'
import PhosphorIcon from './PhosphorIcon.vue'
import {
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons-vue'

defineProps<{
  pageType?: string
  config: NavConfig
}>()

const router = useRouter()
const store = useAppStore()
const authStore = useAuthStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

let observer: IntersectionObserver | null = null

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offsetTop = element.offsetTop - 100
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    })
    store.setCurrentSection(sectionId)

    if (window.innerWidth <= 1024) {
      store.sidebarOpen = false
    }
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  const sections = document.querySelectorAll('.section[id]')

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          store.setCurrentSection(entry.target.id)
        }
      })
    },
    {
      threshold: 0.3,
      rootMargin: '-100px 0px -50% 0px',
    }
  )

  sections.forEach((section) => observer?.observe(section))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--card-bg);
  border-right: 1px solid var(--border-color);
  position: fixed;
  top: var(--header-height);
  left: 0;
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  z-index: 10;
  padding: 24px 0;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), background-color var(--transition-base);
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--radius-full);
}

.sidebar-header {
  padding: 0 24px 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
  position: relative;
}

.sidebar-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.sidebar-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}

.theme-toggle {
  position: absolute;
  top: 0;
  right: 24px;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: var(--transition-base);
}

.theme-toggle:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  transform: rotate(15deg);
}

.nav-menu {
  list-style: none;
  padding: 0;
}

.nav-category {
  padding: 20px 24px 8px;
  font-size: 0.6875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
}

.nav-item {
  margin: 2px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: var(--transition-base);
  position: relative;
  margin: 0 12px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.nav-link:hover {
  background: rgba(99, 102, 241, 0.08);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  padding-left: 28px;
}

.nav-link.active {
  background: rgba(99, 102, 241, 0.12);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  font-weight: 600;
}

.nav-icon {
  margin-right: 12px;
  transition: transform var(--transition-fast);
  display: flex;
  align-items: center;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-right: 8px;
}

.nav-link:hover .nav-icon {
  transform: scale(1.1);
}

.sidebar-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  margin-top: 20px;
}

.user-section {
  margin-bottom: 12px;
}

.user-info {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: var(--transition-base);
  width: 100%;
}

.user-info:hover {
  background: rgba(99, 102, 241, 0.08);
}

.username {
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
}

.login-link {
  display: flex;
  align-items: center;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: var(--transition-base);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
  gap: 8px;
}

.login-link:hover {
  background: rgba(99, 102, 241, 0.08);
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--text-tertiary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: var(--transition-base);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
}

.back-link:hover {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.08);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  transition: opacity var(--transition-base);
}

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-overlay.show {
    display: block;
    opacity: 1;
  }
}
</style>

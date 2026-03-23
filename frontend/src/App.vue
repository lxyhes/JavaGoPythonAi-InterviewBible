<template>
  <a-config-provider
    :theme="{
      algorithm: appStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: '#6366f1',
        borderRadius: 12,
        colorBgContainer: appStore.isDark ? '#1e293b' : '#ffffff',
        colorBgLayout: appStore.isDark ? '#0f172a' : '#f8fafc',
        colorBorderSecondary: appStore.isDark ? '#334155' : '#f0f0f0',
        colorText: appStore.isDark ? '#f8fafc' : '#0f172a',
        colorTextSecondary: appStore.isDark ? '#cbd5e1' : '#475569',
      }
    }"
  >
    <AppNavbar v-if="!isLoginPage" />
    <main :class="['main-content', { 'no-padding': isLoginPage }]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <LanguageSwitcher v-if="!isLoginPage" />
    <CelebrationCenter />
    <BackToTop />
  </a-config-provider>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { theme } from 'ant-design-vue'
import AppNavbar from './components/AppNavbar.vue'
import BackToTop from './components/BackToTop.vue'
import CelebrationCenter from './components/CelebrationCenter.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { useAppStore } from './stores/app'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isLoginPage = computed(() => route.path === '/login')

const isEditableElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tag = target.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    return true
  }

  return target.isContentEditable
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') {
    return
  }

  if (isEditableElement(event.target)) {
    return
  }

  event.preventDefault()
  void router.push('/search')
}

onMounted(() => {
  appStore.initTheme()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.main-content {
  padding-top: var(--header-height);
  min-height: 100vh;
  overflow: visible;
}

.main-content.no-padding {
  padding-top: 0;
}
</style>

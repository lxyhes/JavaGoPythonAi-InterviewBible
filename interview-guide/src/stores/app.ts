import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // State
  const theme = ref(localStorage.getItem('theme') || 'light')
  const sidebarOpen = ref(false)
  const currentSection = ref('')
  const readingProgress = ref(0)
  const isLoading = ref(false)

  // Getters
  const isDark = computed(() => theme.value === 'dark')

  // Actions
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setCurrentSection(section: string) {
    currentSection.value = section
  }

  function updateReadingProgress() {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    readingProgress.value = Math.min((scrollTop / docHeight) * 100, 100)
  }

  function initTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return {
    theme,
    sidebarOpen,
    currentSection,
    readingProgress,
    isLoading,
    isDark,
    toggleTheme,
    toggleSidebar,
    setCurrentSection,
    updateReadingProgress,
    initTheme,
  }
})

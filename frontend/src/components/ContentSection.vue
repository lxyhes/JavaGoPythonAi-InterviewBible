<template>
  <div :id="id" class="section" v-html="content || '<div class=\'skeleton-section\'></div>'"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

const props = defineProps<{
  id: string
  title: string
  loading?: boolean
}>()

const store = useAppStore()
const content = ref('')
const isLoaded = ref(false)
let observer: IntersectionObserver | null = null

const loadContent = async () => {
  if (isLoaded.value) return

  try {
    store.isLoading = true
    const pageType = window.location.pathname.split('/')[1] || 'frontend'
    const response = await fetch(`/sections/${pageType}/${props.id}.html`)
    if (response.ok) {
      const html = await response.text()
      content.value = sanitizeHtml(html, 'section')
      isLoaded.value = true
    }
  } catch (error) {
    console.error('加载内容失败:', error)
  } finally {
    store.isLoading = false
  }
}

onMounted(() => {
  if (props.loading) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadContent()
            observer?.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '200px' }
    )

    const element = document.getElementById(props.id)
    if (element) observer.observe(element)
  } else {
    loadContent()
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
  border: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
}

.section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.section:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.section:hover::before {
  opacity: 1;
}

:deep(h2) {
  color: var(--text-primary);
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 16px;
  letter-spacing: -0.02em;
}

:deep(.qa-item) {
  margin-bottom: 40px;
  padding: 28px;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--primary-color);
  transition: var(--transition-base);
  position: relative;
}

:deep(.qa-item:hover) {
  transform: translateX(6px);
  box-shadow: var(--shadow-md);
  background: var(--card-bg);
}

:deep(.question) {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 1.1875rem;
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
  letter-spacing: -0.01em;
}

:deep(.question::before) {
  content: 'Q';
  background: var(--primary-gradient);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 800;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

:deep(.answer) {
  color: var(--text-secondary);
  padding-left: 48px;
  font-size: 1rem;
  line-height: 1.8;
}

:deep(.tag) {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: var(--transition-fast);
  cursor: default;
  letter-spacing: 0.02em;
}

:deep(.tag.must) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

:deep(.tag.frequent) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

:deep(.tag.important) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

:deep(pre) {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 24px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 20px 0;
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  line-height: 1.7;
  border: 1px solid #313244;
}

:deep(pre::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

:deep(code) {
  background: var(--bg-secondary);
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  font-size: 0.875em;
  color: var(--primary-dark);
  font-weight: 500;
  border: 1px solid var(--border-color);
}

:deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: inherit;
  line-height: inherit;
  border: none;
  font-weight: 400;
}

:deep(table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 24px 0;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

:deep(th) {
  background: var(--bg-secondary);
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  font-size: 0.9375rem;
  letter-spacing: 0.01em;
}

:deep(td) {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

:deep(tr:last-child td) {
  border-bottom: none;
}

:deep(tr:hover td) {
  background: rgba(99, 102, 241, 0.02);
}

.skeleton-section {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  height: 200px;
  border-radius: var(--radius-lg);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 24px;
    margin-bottom: 24px;
  }

  :deep(h2) {
    font-size: 1.375rem;
  }

  :deep(.qa-item) {
    padding: 20px;
    margin-bottom: 24px;
  }

  :deep(.question) {
    font-size: 1.0625rem;
  }

  :deep(.answer) {
    padding-left: 40px;
    font-size: 0.9375rem;
  }

  :deep(pre) {
    padding: 16px;
    font-size: 0.875rem;
  }
}
</style>




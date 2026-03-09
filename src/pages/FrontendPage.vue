<template>
  <div class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="frontend" :config="frontendConfig" />

    <main class="main-content">
      <header class="page-header">
        <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
        <h1 class="page-title">{{ t('pageTitles.frontend') }}</h1>
        <p class="page-subtitle">{{ t('pageSubtitles.frontend') }}</p>
      </header>

      <div class="content-container">
        <section id="html-css" class="section">
          <HtmlCssContent />
        </section>
        <section id="javascript" class="section">
          <JavaScriptContent />
        </section>
        <section id="js-advanced" class="section">
          <JavaScriptAdvanced />
        </section>
        <section id="vue" class="section">
          <VueContent />
        </section>
        <section id="react" class="section">
          <ReactContent />
        </section>
      </div>
    </main>

    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useI18nStore } from '@/stores/i18n'
import Sidebar from '@/components/Sidebar.vue'
import BackToTop from '@/components/BackToTop.vue'
import MobileMenuBtn from '@/components/MobileMenuBtn.vue'
import ReadingProgress from '@/components/ReadingProgress.vue'
import { HtmlCssContent, JavaScriptContent, JavaScriptAdvanced, VueContent, ReactContent } from '@/components/content/frontend'
import type { NavConfig } from '@/types'

const store = useAppStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const frontendConfig = computed<NavConfig>(() => ({
  title: t('category.frontend.title'),
  icon: 'Books',
  categories: [
    {
      name: t('common.categories.frontend'),
      items: [
        { id: 'html-css', title: 'HTML/CSS', icon: 'FileHtml' },
        { id: 'javascript', title: 'JavaScript', icon: 'FileJs' },
        { id: 'js-advanced', title: 'JS Advanced', icon: 'Fire' },
        { id: 'vue', title: 'Vue', icon: 'Hexagon' },
        { id: 'react', title: 'React', icon: 'Atom' },
      ],
    },
  ],
}))

onMounted(() => {
  store.initTheme()
})
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
}

.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  padding: 48px 64px;
  max-width: calc(100% - var(--sidebar-width));
  min-height: 100vh;
}

.page-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100px;
  height: 3px;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--text-tertiary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  margin-bottom: 16px;
  transition: var(--transition-base);
}

.back-link:hover {
  color: var(--primary-color);
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1.25rem;
  color: var(--text-tertiary);
  font-weight: 400;
  max-width: 600px;
}

.section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
  border: 1px solid var(--border-light);
}

.section:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(99, 102, 241, 0.1);
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    max-width: 100%;
    padding: 32px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1.0625rem;
  }

  .section {
    padding: 24px;
  }
}
</style>

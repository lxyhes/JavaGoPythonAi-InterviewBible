<template>
  <div class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="algorithm" :config="algorithmConfig" />

    <main class="main-content">
      <header class="page-header">
        <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
        <h1 class="page-title">{{ t('pageTitles.algorithm') }}</h1>
        <p class="page-subtitle">{{ t('pageSubtitles.algorithm') }}</p>
      </header>

      <div class="content-container">
        <section id="sorting" class="section">
          <ContentRenderer title="Sorting" :items="sortQA" anchor-prefix="sorting" />
        </section>
        <section id="data-structure" class="section">
          <ContentRenderer title="Data Structures" :items="dataStructureQA" anchor-prefix="data-structure" />
        </section>
        <section id="leetcode" class="section">
          <ContentRenderer title="LeetCode" :items="leetcodeQA" anchor-prefix="leetcode" />
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
import ContentRenderer from '@/components/content/ContentRenderer.vue'
import { dataStructureQA, leetcodeQA, sortQA } from '@/data/algorithm'
import type { NavConfig } from '@/types'

const store = useAppStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const algorithmConfig = computed<NavConfig>(() => ({
  title: t('category.algorithm.title'),
  icon: '🧮',
  categories: [
    {
      name: t('common.categories.algorithm'),
      items: [
        { id: 'sorting', title: 'Sorting', icon: '📊' },
        { id: 'data-structure', title: 'Data Structures', icon: '📚' },
        { id: 'leetcode', title: 'LeetCode', icon: '🧪' },
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
  max-width: 720px;
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

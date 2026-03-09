<template>
  <a-layout class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="frontend" :config="frontendConfig" />

    <a-layout-content class="main-content">
      <a-page-header
        :title="t('pageTitles.frontend')"
        :sub-title="t('pageSubtitles.frontend')"
        @back="() => $router.push('/dashboard')"
        class="page-header"
      />

      <div class="content-container">
        <a-card id="html-css" class="section-card" :bordered="false">
          <HtmlCssContent />
        </a-card>
        <a-card id="javascript" class="section-card" :bordered="false">
          <JavaScriptContent />
        </a-card>
        <a-card id="js-advanced" class="section-card" :bordered="false">
          <JavaScriptAdvanced />
        </a-card>
        <a-card id="vue" class="section-card" :bordered="false">
          <VueContent />
        </a-card>
        <a-card id="react" class="section-card" :bordered="false">
          <ReactContent />
        </a-card>
      </div>
    </a-layout-content>

    <BackToTop />
  </a-layout>
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
  padding: 24px 48px 48px;
  max-width: calc(100% - var(--sidebar-width));
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.page-header :deep(.ant-page-header-heading-title) {
  font-size: 2.5rem;
  font-weight: 700;
}

.section-card {
  margin-bottom: 24px;
  border-radius: 12px;
  transition: all 0.3s;
}

.section-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    max-width: 100%;
    padding: 24px 32px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px 20px;
  }

  .page-header :deep(.ant-page-header-heading-title) {
    font-size: 1.75rem;
  }
}
</style>

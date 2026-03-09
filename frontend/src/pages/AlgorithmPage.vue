<template>
  <a-layout class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="algorithm" :config="algorithmConfig" />

    <a-layout-content class="main-content">
      <a-page-header
        :title="t('pageTitles.algorithm')"
        :sub-title="t('pageSubtitles.algorithm')"
        @back="() => $router.push('/dashboard')"
        class="page-header"
      />

      <div class="content-container">
        <a-card id="sorting" class="section-card" :bordered="false">
          <ContentRenderer title="Sorting" :items="sortQA" anchor-prefix="sorting" />
        </a-card>
        <a-card id="data-structure" class="section-card" :bordered="false">
          <ContentRenderer title="Data Structures" :items="dataStructureQA" anchor-prefix="data-structure" />
        </a-card>
        <a-card id="leetcode" class="section-card" :bordered="false">
          <ContentRenderer title="LeetCode" :items="leetcodeQA" anchor-prefix="leetcode" />
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
import ContentRenderer from '@/components/content/ContentRenderer.vue'
import { dataStructureQA, leetcodeQA, sortQA } from '@/data/algorithm'
import type { NavConfig } from '@/types'

const store = useAppStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const algorithmConfig = computed<NavConfig>(() => ({
  title: t('category.algorithm.title'),
  icon: 'Function',
  categories: [
    {
      name: t('common.categories.algorithm'),
      items: [
        { id: 'sorting', title: 'Sorting', icon: 'ChartBar' },
        { id: 'data-structure', title: 'Data Structures', icon: 'Books' },
        { id: 'leetcode', title: 'LeetCode', icon: 'Code' },
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

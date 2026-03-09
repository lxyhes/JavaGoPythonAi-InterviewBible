<template>
  <a-layout class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="os" :config="osConfig" />

    <a-layout-content class="main-content">
      <a-page-header
        :title="t('pageTitles.os')"
        :sub-title="t('pageSubtitles.os')"
        @back="() => $router.push('/dashboard')"
        class="page-header"
      />

      <div class="content-container">
        <template v-for="category in osConfig.categories" :key="category.name">
          <a-card v-for="item in category.items" :key="item.id" :id="item.id" class="section-card" :bordered="false">
            <ContentSection :id="item.id" :title="item.title" />
          </a-card>
        </template>
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
import ContentSection from '@/components/ContentSection.vue'
import type { NavConfig } from '@/types'

const store = useAppStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const osConfig = computed<NavConfig>(() => ({
  title: t('category.os.title'),
  icon: 'Desktop',
  categories: [
    {
      name: 'Process Management',
      items: [
        { id: 'process-thread', title: 'Process vs Thread', icon: 'ArrowsClockwise' },
        { id: 'process-scheduling', title: 'Scheduling', icon: 'Clock' },
        { id: 'deadlock', title: 'Deadlock', icon: 'LockKey' },
      ],
    },
    {
      name: 'Memory Management',
      items: [
        { id: 'virtual-memory', title: 'Virtual Memory', icon: 'FloppyDisk' },
        { id: 'page-replacement', title: 'Page Replacement', icon: 'FileText' },
        { id: 'memory-allocation', title: 'Allocation', icon: 'Package' },
      ],
    },
    {
      name: 'File System',
      items: [
        { id: 'file-system', title: 'File System', icon: 'Folder' },
        { id: 'io-management', title: 'I/O Management', icon: 'Plugs' },
        { id: 'disk-scheduling', title: 'Disk Scheduling', icon: 'Disc' },
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

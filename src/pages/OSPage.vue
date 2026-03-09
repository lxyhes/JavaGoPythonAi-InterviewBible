<script setup lang="ts">
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import Sidebar from '../components/Sidebar.vue'
import ContentSection from '../components/ContentSection.vue'
import type { NavConfig } from '../types'
import PhosphorIcon from '@/components/PhosphorIcon.vue'

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
</script>

<template>
  <div class="page-container">
    <Sidebar page-type="os" :config="osConfig" />
    <main class="main-content">
      <div class="content-header">
        <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
        <h1><PhosphorIcon :name="osConfig.icon" :size="32" class="header-icon" /> {{ osConfig.title }}</h1>
        <p class="subtitle">{{ t('pageSubtitles.os') }}</p>
      </div>
      <div class="content-body">
        <template v-for="category in osConfig.categories" :key="category.name">
          <ContentSection v-for="item in category.items" :key="item.id" :id="item.id" :title="item.title" />
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 2rem;
  max-width: calc(100% - var(--sidebar-width));
}

.content-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--text-tertiary);
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary-color);
}

.content-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    max-width: 100%;
    padding: 1rem;
  }
}
</style>

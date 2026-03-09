<script setup lang="ts">
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import Sidebar from '../components/Sidebar.vue'
import ContentSection from '../components/ContentSection.vue'
import type { NavConfig } from '../types'

const i18nStore = useI18nStore()
const t = i18nStore.t

const systemDesignConfig = computed<NavConfig>(() => ({
  title: t('category.systemDesign.title'),
  icon: '🏗️',
  categories: [
    {
      name: 'Design Basics',
      items: [
        { id: 'design-principles', title: 'Design Principles', icon: '📐' },
        { id: 'scalability', title: 'Scalability', icon: '📈' },
        { id: 'reliability', title: 'Reliability', icon: '🛡️' },
      ],
    },
    {
      name: 'Classic Cases',
      items: [
        { id: 'url-shortener', title: 'URL Shortener', icon: '🔗' },
        { id: 'rate-limiter', title: 'Rate Limiter', icon: '🚦' },
        { id: 'chat-system', title: 'Chat System', icon: '💬' },
        { id: 'news-feed', title: 'News Feed', icon: '📰' },
      ],
    },
    {
      name: 'Components',
      items: [
        { id: 'load-balancer', title: 'Load Balancer', icon: '⚖️' },
        { id: 'cache', title: 'Cache Design', icon: '💾' },
        { id: 'message-queue', title: 'Message Queue', icon: '📮' },
        { id: 'database-sharding', title: 'DB Sharding', icon: '🗄️' },
      ],
    },
  ],
}))
</script>

<template>
  <div class="page-container">
    <Sidebar page-type="system-design" :config="systemDesignConfig" />
    <main class="main-content">
      <div class="content-header">
        <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
        <h1>{{ systemDesignConfig.icon }} {{ systemDesignConfig.title }}</h1>
        <p class="subtitle">{{ t('pageSubtitles.systemDesign') }}</p>
      </div>
      <div class="content-body">
        <template v-for="category in systemDesignConfig.categories" :key="category.name">
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

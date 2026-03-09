<script setup lang="ts">
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import Sidebar from '../components/Sidebar.vue'
import ContentSection from '../components/ContentSection.vue'
import type { NavConfig } from '../types'

const i18nStore = useI18nStore()
const t = i18nStore.t

const networkConfig = computed<NavConfig>(() => ({
  title: t('category.network.title'),
  icon: '🌐',
  categories: [
    {
      name: 'Network Basics',
      items: [
        { id: 'tcp-ip', title: 'TCP/IP', icon: '📡' },
        { id: 'http-https', title: 'HTTP/HTTPS', icon: '🔒' },
        { id: 'dns', title: 'DNS', icon: '📖' },
      ],
    },
    {
      name: 'Protocols',
      items: [
        { id: 'websocket', title: 'WebSocket', icon: '🔌' },
        { id: 'grpc', title: 'gRPC', icon: '🔗' },
        { id: 'rest-api', title: 'REST API', icon: '📋' },
      ],
    },
    {
      name: 'Security',
      items: [
        { id: 'network-security', title: 'Security', icon: '🛡️' },
        { id: 'firewall', title: 'Firewall', icon: '🔥' },
        { id: 'ddos', title: 'DDoS', icon: '⚠️' },
      ],
    },
  ],
}))
</script>

<template>
  <div class="page-container">
    <Sidebar page-type="network" :config="networkConfig" />
    <main class="main-content">
      <div class="content-header">
        <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
        <h1>{{ networkConfig.icon }} {{ networkConfig.title }}</h1>
        <p class="subtitle">{{ t('pageSubtitles.network') }}</p>
      </div>
      <div class="content-body">
        <template v-for="category in networkConfig.categories" :key="category.name">
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

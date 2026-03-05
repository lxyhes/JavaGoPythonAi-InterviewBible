<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import ContentSection from '../components/ContentSection.vue'
import type { NavConfig } from '../types'

const systemDesignConfig: NavConfig = {
  title: '系统设计面试宝典',
  icon: '🏗️',
  categories: [
    {
      name: '设计基础',
      items: [
        { id: 'design-principles', title: '设计原则', icon: '📐' },
        { id: 'scalability', title: '可扩展性', icon: '📈' },
        { id: 'reliability', title: '可靠性', icon: '🛡️' },
      ],
    },
    {
      name: '经典案例',
      items: [
        { id: 'url-shortener', title: '短链服务', icon: '🔗' },
        { id: 'rate-limiter', title: '限流器', icon: '🚦' },
        { id: 'chat-system', title: '聊天系统', icon: '💬' },
        { id: 'news-feed', title: '信息流', icon: '📰' },
      ],
    },
    {
      name: '组件设计',
      items: [
        { id: 'load-balancer', title: '负载均衡', icon: '⚖️' },
        { id: 'cache', title: '缓存设计', icon: '💾' },
        { id: 'message-queue', title: '消息队列', icon: '📮' },
        { id: 'database-sharding', title: '分库分表', icon: '🗄️' },
      ],
    },
  ],
}

const currentSection = ref('design-principles')

const handleNavChange = (id: string) => {
  currentSection.value = id
}
</script>

<template>
  <div class="page-container">
    <Sidebar :config="systemDesignConfig" :active-id="currentSection" @nav-change="handleNavChange" />
    <main class="main-content">
      <div class="content-header">
        <h1>{{ systemDesignConfig.icon }} {{ systemDesignConfig.title }}</h1>
        <p class="subtitle">掌握系统设计方法论，应对高阶技术面试</p>
      </div>
      <div class="content-body">
        <ContentSection
          v-for="category in systemDesignConfig.categories"
          :key="category.name"
          v-for="item in category.items"
          :id="item.id"
          :title="item.title"
          :icon="item.icon"
        />
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

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import ContentSection from '../components/ContentSection.vue'
import type { NavConfig } from '../types'

const networkConfig: NavConfig = {
  title: '网络面试宝典',
  icon: '🌐',
  categories: [
    {
      name: '网络基础',
      items: [
        { id: 'osi-model', title: 'OSI七层模型', icon: '📚' },
        { id: 'tcp-ip', title: 'TCP/IP协议', icon: '📡' },
        { id: 'http-https', title: 'HTTP/HTTPS', icon: '🔒' },
      ],
    },
    {
      name: '传输层',
      items: [
        { id: 'tcp', title: 'TCP协议', icon: '📨' },
        { id: 'udp', title: 'UDP协议', icon: '📬' },
        { id: 'socket', title: 'Socket编程', icon: '🔌' },
      ],
    },
    {
      name: '应用层',
      items: [
        { id: 'http-methods', title: 'HTTP方法', icon: '🛠️' },
        { id: 'rest-api', title: 'RESTful API', icon: '🔧' },
        { id: 'websocket', title: 'WebSocket', icon: '💬' },
      ],
    },
    {
      name: '网络安全',
      items: [
        { id: 'encryption', title: '加密算法', icon: '🔐' },
        { id: 'authentication', title: '认证授权', icon: '🎫' },
        { id: 'firewall', title: '防火墙', icon: '🧱' },
      ],
    },
  ],
}

</script>

<template>
  <div class="page-container">
    <Sidebar page-type="network" :config="networkConfig" />
    <main class="main-content">
      <div class="content-header">
        <h1>{{ networkConfig.icon }} {{ networkConfig.title }}</h1>
        <p class="subtitle">深入理解网络协议，解决网络相关问题</p>
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

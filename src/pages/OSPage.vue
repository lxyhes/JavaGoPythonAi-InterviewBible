<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import ContentSection from '../components/ContentSection.vue'
import type { NavConfig } from '../types'

const osConfig: NavConfig = {
  title: '操作系统面试宝典',
  icon: '💻',
  categories: [
    {
      name: '进程管理',
      items: [
        { id: 'process-thread', title: '进程与线程', icon: '🔄' },
        { id: 'process-scheduling', title: '进程调度', icon: '⏱️' },
        { id: 'ipc', title: '进程间通信', icon: '📞' },
      ],
    },
    {
      name: '内存管理',
      items: [
        { id: 'memory-model', title: '内存模型', icon: '🧠' },
        { id: 'virtual-memory', title: '虚拟内存', icon: '💾' },
        { id: 'page-replacement', title: '页面置换', icon: '🔄' },
      ],
    },
    {
      name: '文件系统',
      items: [
        { id: 'file-system', title: '文件系统', icon: '📁' },
        { id: 'io-model', title: 'I/O模型', icon: '📥' },
        { id: 'disk-scheduling', title: '磁盘调度', icon: '💿' },
      ],
    },
    {
      name: 'Linux',
      items: [
        { id: 'linux-commands', title: '常用命令', icon: '⌨️' },
        { id: 'shell-scripting', title: 'Shell脚本', icon: '🐚' },
        { id: 'linux-kernel', title: '内核原理', icon: '⚙️' },
      ],
    },
  ],
}

const currentSection = ref('process-thread')

const handleNavChange = (id: string) => {
  currentSection.value = id
}
</script>

<template>
  <div class="page-container">
    <Sidebar :config="osConfig" :active-id="currentSection" @nav-change="handleNavChange" />
    <main class="main-content">
      <div class="content-header">
        <h1>{{ osConfig.icon }} {{ osConfig.title }}</h1>
        <p class="subtitle">理解操作系统原理，掌握底层机制</p>
      </div>
      <div class="content-body">
        <ContentSection
          v-for="category in osConfig.categories"
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

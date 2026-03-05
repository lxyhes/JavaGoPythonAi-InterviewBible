<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import ContentSection from '../components/ContentSection.vue'
import type { NavConfig } from '../types'

const algorithmConfig: NavConfig = {
  title: '算法面试宝典',
  icon: '🧮',
  categories: [
    {
      name: '基础算法',
      items: [
        { id: 'sorting', title: '排序算法', icon: '📊' },
        { id: 'searching', title: '查找算法', icon: '🔍' },
        { id: 'recursion', title: '递归与分治', icon: '🔄' },
      ],
    },
    {
      name: '数据结构',
      items: [
        { id: 'array', title: '数组与链表', icon: '📋' },
        { id: 'stack-queue', title: '栈与队列', icon: '📚' },
        { id: 'tree', title: '树与图', icon: '🌳' },
        { id: 'hash', title: '哈希表', icon: '#️⃣' },
      ],
    },
    {
      name: '进阶算法',
      items: [
        { id: 'dynamic-programming', title: '动态规划', icon: '📈' },
        { id: 'greedy', title: '贪心算法', icon: '💰' },
        { id: 'backtracking', title: '回溯算法', icon: '🔙' },
      ],
    },
    {
      name: 'LeetCode',
      items: [
        { id: 'leetcode-easy', title: '简单题精选', icon: '🟢' },
        { id: 'leetcode-medium', title: '中等题精选', icon: '🟡' },
        { id: 'leetcode-hard', title: '困难题精选', icon: '🔴' },
      ],
    },
  ],
}

const currentSection = ref('sorting')

const handleNavChange = (id: string) => {
  currentSection.value = id
}
</script>

<template>
  <div class="page-container">
    <Sidebar :config="algorithmConfig" :active-id="currentSection" @nav-change="handleNavChange" />
    <main class="main-content">
      <div class="content-header">
        <h1>{{ algorithmConfig.icon }} {{ algorithmConfig.title }}</h1>
        <p class="subtitle">掌握核心算法，轻松应对技术面试</p>
      </div>
      <div class="content-body">
        <ContentSection
          v-for="category in algorithmConfig.categories"
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

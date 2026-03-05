<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import ContentSection from '../components/ContentSection.vue'
import type { NavConfig } from '../types'

const devopsConfig: NavConfig = {
  title: 'DevOps面试宝典',
  icon: '🚀',
  categories: [
    {
      name: '容器化',
      items: [
        { id: 'docker', title: 'Docker', icon: '🐳' },
        { id: 'kubernetes', title: 'Kubernetes', icon: '☸️' },
        { id: 'container-orchestration', title: '容器编排', icon: '📦' },
      ],
    },
    {
      name: 'CI/CD',
      items: [
        { id: 'jenkins', title: 'Jenkins', icon: '🔧' },
        { id: 'gitlab-ci', title: 'GitLab CI', icon: '🦊' },
        { id: 'github-actions', title: 'GitHub Actions', icon: '🐙' },
      ],
    },
    {
      name: '运维工具',
      items: [
        { id: 'prometheus', title: 'Prometheus', icon: '📊' },
        { id: 'grafana', title: 'Grafana', icon: '📈' },
        { id: 'ansible', title: 'Ansible', icon: '🤖' },
        { id: 'terraform', title: 'Terraform', icon: '🏗️' },
      ],
    },
    {
      name: '云平台',
      items: [
        { id: 'aws', title: 'AWS', icon: '☁️' },
        { id: 'aliyun', title: '阿里云', icon: '🇨🇳' },
        { id: 'tencent-cloud', title: '腾讯云', icon: '🔷' },
      ],
    },
  ],
}

const currentSection = ref('docker')

const handleNavChange = (id: string) => {
  currentSection.value = id
}
</script>

<template>
  <div class="page-container">
    <Sidebar :config="devopsConfig" :active-id="currentSection" @nav-change="handleNavChange" />
    <main class="main-content">
      <div class="content-header">
        <h1>{{ devopsConfig.icon }} {{ devopsConfig.title }}</h1>
        <p class="subtitle">掌握DevOps实践，提升运维效率</p>
      </div>
      <div class="content-body">
        <ContentSection
          v-for="category in devopsConfig.categories"
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

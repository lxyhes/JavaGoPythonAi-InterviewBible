<template>
  <a-layout class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="backend" :config="backendConfig" />

    <a-layout-content class="main-content">
      <a-page-header
        :title="t('pageTitles.backend')"
        :sub-title="t('pageSubtitles.backend')"
        @back="() => $router.push('/dashboard')"
        class="page-header"
      >
        <template #extra>
          <a-space>
            <CodeAnalyzer />
            <QuestionGenerator />
          </a-space>
        </template>
      </a-page-header>

      <div class="content-container">
        <a-card id="java-basics" class="section-card" :bordered="false">
          <ContentRenderer :title="t('common.categories.backend') + ' - Java Basics'" :items="javaBasicsQA" anchor-prefix="java-basics" :category="t('common.categories.backend')" />
        </a-card>
        <a-card id="java-advanced" class="section-card" :bordered="false">
          <ContentRenderer :title="t('common.categories.backend') + ' - Java Advanced'" :items="javaAdvancedQA" anchor-prefix="java-advanced" :category="t('common.categories.backend')" />
        </a-card>
        <a-card id="java-jvm" class="section-card" :bordered="false">
          <ContentRenderer title="JVM" :items="javaJVMQA" anchor-prefix="java-jvm" category="JVM" />
        </a-card>
        <a-card id="java-concurrent" class="section-card" :bordered="false">
          <ContentRenderer title="Concurrency" :items="javaConcurrentQA" anchor-prefix="java-concurrent" category="Concurrency" />
        </a-card>
        <a-card id="java-network" class="section-card" :bordered="false">
          <ContentRenderer title="Network Programming" :items="javaNetworkQA" anchor-prefix="java-network" category="Network" />
        </a-card>
        <a-card id="java-spring" class="section-card" :bordered="false">
          <ContentRenderer title="Spring" :items="javaSpringQA" anchor-prefix="java-spring" category="Spring" />
        </a-card>
        <a-card id="java-distributed" class="section-card" :bordered="false">
          <ContentRenderer title="Distributed Systems" :items="javaDistributedQA" anchor-prefix="java-distributed" category="Distributed" />
        </a-card>
        <a-card id="microservices" class="section-card" :bordered="false">
          <ContentRenderer title="Microservices" :items="microservicesQA" anchor-prefix="microservices" category="Microservices" />
        </a-card>
        <a-card id="project-backend" class="section-card" :bordered="false">
          <ContentRenderer title="Project Practice" :items="backendProjectQA" anchor-prefix="project-backend" category="Project" />
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
import CodeAnalyzer from '@/components/CodeAnalyzer.vue'
import QuestionGenerator from '@/components/QuestionGenerator.vue'
import { javaBasicsQA, javaAdvancedQA, javaSpringQA, javaConcurrentQA } from '@/data/backend-java'
import { javaJVMQA, javaNetworkQA, javaDistributedQA } from '@/data/backend-java-advanced'
import { microservicesQA, backendProjectQA } from '@/data/backend'
import type { NavConfig } from '@/types'

const store = useAppStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const backendConfig = computed<NavConfig>(() => ({
  title: t('category.backend.title'),
  icon: 'Coffee',
  categories: [
    {
      name: t('common.categories.backend'),
      items: [
        { id: 'java-basics', title: 'Java Basics', icon: 'Book' },
        { id: 'java-advanced', title: 'Java Advanced', icon: 'Fire' },
        { id: 'java-jvm', title: 'JVM', icon: 'Gear' },
        { id: 'java-concurrent', title: 'Concurrency', icon: 'Lightning' },
        { id: 'java-network', title: 'Network', icon: 'Globe' },
        { id: 'java-spring', title: 'Spring', icon: 'Plant' },
        { id: 'java-distributed', title: 'Distributed', icon: 'LockKey' },
        { id: 'microservices', title: 'Microservices', icon: 'Wrench' },
        { id: 'project-backend', title: 'Project', icon: 'Briefcase' },
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

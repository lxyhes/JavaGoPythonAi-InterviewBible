<template>
  <div class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="backend" :config="backendConfig" />

    <main class="main-content">
      <header class="page-header">
        <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
        <h1 class="page-title">{{ t('pageTitles.backend') }}</h1>
        <p class="page-subtitle">{{ t('pageSubtitles.backend') }}</p>
        <div class="ai-actions">
          <CodeAnalyzer />
          <QuestionGenerator />
        </div>
      </header>

      <div class="content-container">
        <section id="java-basics" class="section">
          <ContentRenderer :title="t('common.categories.backend') + ' - Java Basics'" :items="javaBasicsQA" anchor-prefix="java-basics" :category="t('common.categories.backend')" />
        </section>
        <section id="java-advanced" class="section">
          <ContentRenderer :title="t('common.categories.backend') + ' - Java Advanced'" :items="javaAdvancedQA" anchor-prefix="java-advanced" :category="t('common.categories.backend')" />
        </section>
        <section id="java-jvm" class="section">
          <ContentRenderer title="JVM" :items="javaJVMQA" anchor-prefix="java-jvm" category="JVM" />
        </section>
        <section id="java-concurrent" class="section">
          <ContentRenderer title="Concurrency" :items="javaConcurrentQA" anchor-prefix="java-concurrent" category="Concurrency" />
        </section>
        <section id="java-network" class="section">
          <ContentRenderer title="Network Programming" :items="javaNetworkQA" anchor-prefix="java-network" category="Network" />
        </section>
        <section id="java-spring" class="section">
          <ContentRenderer title="Spring" :items="javaSpringQA" anchor-prefix="java-spring" category="Spring" />
        </section>
        <section id="java-distributed" class="section">
          <ContentRenderer title="Distributed Systems" :items="javaDistributedQA" anchor-prefix="java-distributed" category="Distributed" />
        </section>
        <section id="microservices" class="section">
          <ContentRenderer title="Microservices" :items="microservicesQA" anchor-prefix="microservices" category="Microservices" />
        </section>
        <section id="project-backend" class="section">
          <ContentRenderer title="Project Practice" :items="backendProjectQA" anchor-prefix="project-backend" category="Project" />
        </section>
      </div>
    </main>

    <BackToTop />
  </div>
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
  icon: '☕',
  categories: [
    {
      name: t('common.categories.backend'),
      items: [
        { id: 'java-basics', title: 'Java Basics', icon: '📘' },
        { id: 'java-advanced', title: 'Java Advanced', icon: '🔥' },
        { id: 'java-jvm', title: 'JVM', icon: '⚙️' },
        { id: 'java-concurrent', title: 'Concurrency', icon: '⚡' },
        { id: 'java-network', title: 'Network', icon: '🌐' },
        { id: 'java-spring', title: 'Spring', icon: '🍃' },
        { id: 'java-distributed', title: 'Distributed', icon: '🔒' },
        { id: 'microservices', title: 'Microservices', icon: '🔧' },
        { id: 'project-backend', title: 'Project', icon: '💼' },
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
  padding: 48px 64px;
  max-width: calc(100% - var(--sidebar-width));
  min-height: 100vh;
}

.page-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100px;
  height: 3px;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--text-tertiary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  margin-bottom: 16px;
  transition: var(--transition-base);
}

.back-link:hover {
  color: var(--primary-color);
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1.25rem;
  color: var(--text-tertiary);
  font-weight: 400;
  max-width: 600px;
}

.ai-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
  border: 1px solid var(--border-light);
}

.section:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(99, 102, 241, 0.1);
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    max-width: 100%;
    padding: 32px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1.0625rem;
  }

  .section {
    padding: 24px;
  }
}
</style>

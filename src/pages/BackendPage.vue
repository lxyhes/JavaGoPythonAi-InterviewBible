<template>
  <div class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="backend" :config="backendConfig" />

    <main class="main-content">
      <header class="page-header">
        <router-link to="/" class="back-link">返回首页</router-link>
        <h1 class="page-title">后端开发面试题</h1>
        <p class="page-subtitle">涵盖Java基础、进阶、Spring、并发等核心技术</p>
        <div class="ai-actions">
          <CodeAnalyzer />
          <QuestionGenerator />
        </div>
      </header>

      <div class="content-container">
        <section id="java-basics" class="section">
          <ContentRenderer title="☕ Java 基础" :items="javaBasicsQA" anchor-prefix="java-basics" category="Java" />
        </section>
        <section id="java-advanced" class="section">
          <ContentRenderer title="🔥 Java 进阶" :items="javaAdvancedQA" anchor-prefix="java-advanced" category="Java" />
        </section>
        <section id="java-jvm" class="section">
          <ContentRenderer title="⚙️ JVM 原理" :items="javaJVMQA" anchor-prefix="java-jvm" category="JVM" />
        </section>
        <section id="java-concurrent" class="section">
          <ContentRenderer title="⚡ Java 并发" :items="javaConcurrentQA" anchor-prefix="java-concurrent" category="并发编程" />
        </section>
        <section id="java-network" class="section">
          <ContentRenderer title="🌐 网络编程" :items="javaNetworkQA" anchor-prefix="java-network" category="网络编程" />
        </section>
        <section id="java-spring" class="section">
          <ContentRenderer title="🍃 Spring 框架" :items="javaSpringQA" anchor-prefix="java-spring" category="Spring" />
        </section>
        <section id="java-distributed" class="section">
          <ContentRenderer title="🔒 分布式系统" :items="javaDistributedQA" anchor-prefix="java-distributed" category="分布式" />
        </section>
        <section id="microservices" class="section">
          <ContentRenderer title="🔧 微服务架构" :items="microservicesQA" anchor-prefix="microservices" category="微服务" />
        </section>
        <section id="project-backend" class="section">
          <ContentRenderer title="💼 后端项目实战" :items="backendProjectQA" anchor-prefix="project-backend" category="项目实战" />
        </section>
      </div>
    </main>

    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
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

const backendConfig: NavConfig = {
  title: '后端面试宝典',
  icon: '☕',
  categories: [
    {
      name: 'Java 基础',
      items: [
        { id: 'java-basics', title: 'Java 基础', icon: '📘' },
        { id: 'java-advanced', title: 'Java 进阶', icon: '🔥' },
      ],
    },
    {
      name: 'Java 高级',
      items: [
        { id: 'java-jvm', title: 'JVM 原理', icon: '⚙️' },
        { id: 'java-concurrent', title: '并发编程', icon: '⚡' },
        { id: 'java-network', title: '网络编程', icon: '🌐' },
      ],
    },
    {
      name: '框架与架构',
      items: [
        { id: 'java-spring', title: 'Spring', icon: '🍃' },
        { id: 'java-distributed', title: '分布式系统', icon: '🔒' },
        { id: 'microservices', title: '微服务', icon: '🔧' },
      ],
    },
    {
      name: '项目实战',
      items: [
        { id: 'project-backend', title: '后端项目实战', icon: '💼' },
      ],
    },
  ],
}

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


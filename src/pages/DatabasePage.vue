<template>
  <div class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="database" :config="databaseConfig" />

    <main class="main-content">
      <header class="page-header">
        <router-link to="/" class="back-link">返回首页</router-link>
        <h1 class="page-title">数据库面试题</h1>
        <p class="page-subtitle">涵盖MySQL、Redis、MongoDB等数据库核心知识</p>
      </header>

      <div class="content-container">
        <section id="mysql" class="section">
          <ContentRenderer title="🐬 MySQL 面试题" :items="mysqlQA" />
        </section>
        <section id="redis" class="section">
          <ContentRenderer title="⚡ Redis 面试题" :items="redisQA" />
        </section>
        <section id="mongodb" class="section">
          <ContentRenderer title="🍃 MongoDB 面试题" :items="mongodbQA" />
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
import { mysqlQA, redisQA, mongodbQA } from '@/data/database'
import type { NavConfig } from '@/types'

const store = useAppStore()

const databaseConfig: NavConfig = {
  title: '数据库面试宝典',
  icon: '🗄️',
  categories: [
    {
      name: '关系型数据库',
      items: [{ id: 'mysql', title: '🐬 MySQL', icon: '🐬' }],
    },
    {
      name: 'NoSQL',
      items: [
        { id: 'redis', title: '⚡ Redis', icon: '⚡' },
        { id: 'mongodb', title: '🍃 MongoDB', icon: '🍃' },
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

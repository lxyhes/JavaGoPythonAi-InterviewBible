<template>
  <a-layout class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="database" :config="databaseConfig" />

    <a-layout-content class="main-content">
      <a-page-header
        :title="t('pageTitles.database')"
        :sub-title="t('pageSubtitles.database')"
        @back="() => $router.push('/dashboard')"
        class="page-header"
      />

      <div class="content-container">
        <a-card id="mysql" class="section-card" :bordered="false">
          <ContentRenderer title="MySQL" :items="mysqlQA" anchor-prefix="mysql" />
        </a-card>
        <a-card id="redis" class="section-card" :bordered="false">
          <ContentRenderer title="Redis" :items="redisQA" anchor-prefix="redis" />
        </a-card>
        <a-card id="mongodb" class="section-card" :bordered="false">
          <ContentRenderer title="MongoDB" :items="mongodbQA" anchor-prefix="mongodb" />
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
import { mysqlQA, redisQA, mongodbQA } from '@/data/database'
import type { NavConfig } from '@/types'

const store = useAppStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const databaseConfig = computed<NavConfig>(() => ({
  title: t('category.database.title'),
  icon: 'Database',
  categories: [
    {
      name: t('common.categories.database'),
      items: [
        { id: 'mysql', title: 'MySQL', icon: 'Database' },
        { id: 'redis', title: 'Redis', icon: 'Lightning' },
        { id: 'mongodb', title: 'MongoDB', icon: 'Leaf' },
      ],
    },
  ],
}))

onMounted(() => {
  store.initTheme()
})
</script>

<style scoped>
.section-card {
  margin-bottom: 24px;
  border-radius: 12px;
  transition: all 0.3s;
}

.section-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

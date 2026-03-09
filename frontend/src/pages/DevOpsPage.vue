<template>
  <a-layout class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="devops" :config="devopsConfig" />

    <a-layout-content class="main-content">
      <a-page-header
        :title="t('pageTitles.devops')"
        :sub-title="t('pageSubtitles.devops')"
        @back="() => $router.push('/dashboard')"
        class="page-header"
      />

      <div class="content-container">
        <a-card id="devops" class="section-card" :bordered="false">
          <ContentSection id="devops" title="DevOps" />
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
import ContentSection from '@/components/ContentSection.vue'
import type { NavConfig } from '@/types'

const store = useAppStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const devopsConfig = computed<NavConfig>(() => ({
  title: t('category.devops.title'),
  icon: 'Gear',
  categories: [
    {
      name: t('common.categories.devops'),
      items: [
        { id: 'devops', title: 'DevOps', icon: 'Gear' },
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

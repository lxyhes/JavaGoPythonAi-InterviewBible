<template>
  <a-layout class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="system-design" :config="systemDesignConfig" />

    <a-layout-content class="main-content">
      <a-page-header
        :title="t('pageTitles.systemDesign')"
        :sub-title="t('pageSubtitles.systemDesign')"
        @back="() => $router.push('/dashboard')"
        class="page-header"
      />

      <div class="content-container">
        <a-card id="system-design" class="section-card" :bordered="false">
          <ContentSection id="system-design" title="System Design" />
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

const systemDesignConfig = computed<NavConfig>(() => ({
  title: t('category.systemDesign.title'),
  icon: 'Blueprint',
  categories: [
    {
      name: t('common.categories.system-design'),
      items: [
        { id: 'system-design', title: 'System Design', icon: 'Blueprint' },
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

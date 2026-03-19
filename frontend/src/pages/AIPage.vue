<template>
  <a-layout class="page-layout">
    <ReadingProgress />
    <MobileMenuBtn />
    <Sidebar page-type="ai" :config="aiConfig" />

    <a-layout-content class="main-content">
      <a-page-header
        :title="t('pageTitles.ai')"
        :sub-title="t('pageSubtitles.ai')"
        @back="() => $router.push('/dashboard')"
        class="page-header"
      />

      <div class="content-container">
        <a-card id="ai-basics" class="section-card" :bordered="false">
          <ContentRenderer title="AI Basics" :items="aiBasicsQA" anchor-prefix="ai-basics" />
        </a-card>
        <a-card id="ai-more" class="section-card" :bordered="false">
          <ContentRenderer title="AI Advanced" :items="aiMoreQA" anchor-prefix="ai-more" />
        </a-card>
        <a-card id="deep-learning" class="section-card" :bordered="false">
          <ContentRenderer title="Deep Learning" :items="deepLearningQA" anchor-prefix="deep-learning" />
        </a-card>
        <a-card id="llm" class="section-card" :bordered="false">
          <ContentRenderer title="LLM" :items="llmQA" anchor-prefix="llm" />
        </a-card>
        <a-card id="prompt-engineering" class="section-card" :bordered="false">
          <ContentRenderer title="Prompt Engineering" :items="promptEngineeringQA" anchor-prefix="prompt-engineering" />
        </a-card>
        <a-card id="ai-project" class="section-card" :bordered="false">
          <ContentRenderer title="AI Project" :items="aiProjectQA" anchor-prefix="ai-project" />
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
import { aiBasicsQA, deepLearningQA, promptEngineeringQA, aiProjectQA } from '@/data/ai'
import { aiMoreQA, llmQA } from '@/data/ai-more'
import type { NavConfig } from '@/types'

const store = useAppStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const aiConfig = computed<NavConfig>(() => ({
  title: t('category.ai.title'),
  icon: 'Robot',
  categories: [
    {
      name: t('common.categories.ai'),
      items: [
        { id: 'ai-basics', title: 'AI Basics', icon: 'ChartBar' },
        { id: 'ai-more', title: 'AI Advanced', icon: 'Books' },
        { id: 'deep-learning', title: 'Deep Learning', icon: 'Brain' },
        { id: 'llm', title: 'LLM', icon: 'Fire' },
        { id: 'prompt-engineering', title: 'Prompt Engineering', icon: 'ChatCircle' },
        { id: 'ai-project', title: 'AI Project', icon: 'Briefcase' },
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

<template>
  <div class="not-found">
    <a-result
      status="404"
      title="404"
      :sub-title="t('notFound.description')"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="goHome">
            <HomeOutlined />
            {{ t('notFound.backHome') }}
          </a-button>
          <a-button @click="goBack">
            <ArrowLeftOutlined />
            {{ t('notFound.back') }}
          </a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'

const router = useRouter()
const i18nStore = useI18nStore()
const t = i18nStore.t

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 2rem;
}

:deep(.ant-result-title) {
  font-size: 8rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

:deep(.ant-result-subtitle) {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

@media (max-width: 480px) {
  :deep(.ant-result-title) {
    font-size: 5rem;
  }
}
</style>

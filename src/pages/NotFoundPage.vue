<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import PhosphorIcon from '@/components/PhosphorIcon.vue'

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

<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code">404</div>
      <h1>{{ t('notFound.title') }}</h1>
      <p>{{ t('notFound.description') }}</p>
      <div class="actions">
        <button class="btn btn-primary" @click="goHome">
          <PhosphorIcon name="House" class="icon" />
          {{ t('notFound.backHome') }}
        </button>
        <button class="btn btn-secondary" @click="goBack">
          <PhosphorIcon name="ArrowLeft" class="icon" />
          {{ t('notFound.back') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 2rem;
}

.content {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
}

.icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

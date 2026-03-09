<template>
  <div class="language-switcher">
    <span class="label">{{ i18nStore.t('app.language') }}</span>
    <button
      type="button"
      :class="['chip', { active: i18nStore.locale === 'zh' }]"
      @click="i18nStore.setLocale('zh')"
    >
      {{ i18nStore.t('app.zh') }}
    </button>
    <button
      type="button"
      :class="['chip', { active: i18nStore.locale === 'en' }]"
      @click="i18nStore.setLocale('en')"
    >
      {{ i18nStore.t('app.en') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'

const i18nStore = useI18nStore()
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 80;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.18);
}

.label {
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chip {
  height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  cursor: pointer;
}

.chip.active {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.18);
  color: #fff;
}

@media (max-width: 640px) {
  .language-switcher {
    left: 16px;
    right: auto;
  }
}
</style>

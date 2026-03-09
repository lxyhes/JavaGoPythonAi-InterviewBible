<template>
  <transition name="celebration-pop">
    <aside v-if="celebration" class="celebration-shell" @click="dismiss">
      <div class="celebration-card" @click.stop>
        <p class="eyebrow">{{ badgeLabel }}</p>
        <h2>{{ celebration.title }}</h2>
        <p class="desc">{{ celebration.description }}</p>
        <div class="meter"><div class="meter-fill"></div></div>
        <div class="actions">
          <router-link class="primary-btn" to="/dashboard" @click="dismiss">{{ t('common.viewProgress') }}</router-link>
          <button type="button" class="ghost-btn" @click="dismiss">{{ t('common.continue') }}</button>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useLearningStore } from '@/stores/learning'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const t = i18nStore.t
let timer: number | null = null
const celebration = computed(() => learningStore.activeCelebration)
const badgeLabel = computed(() => !celebration.value ? '' : t(`celebration.${celebration.value.type}`))
const clearTimer = () => { if (timer !== null) { window.clearTimeout(timer); timer = null } }
const dismiss = () => { if (celebration.value) learningStore.dismissCelebration(celebration.value.id) }
watch(celebration, (value) => { clearTimer(); if (!value) return; timer = window.setTimeout(() => dismiss(), 4200) }, { immediate: true })
onBeforeUnmount(clearTimer)
</script>

<style scoped>
.celebration-shell { position: fixed; right: 20px; bottom: 20px; z-index: 70; width: min(420px, calc(100vw - 32px)); }
.celebration-card { position: relative; overflow: hidden; border-radius: 22px; padding: 20px; color: #fff; background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.24), transparent 34%), linear-gradient(135deg, #0f172a 0%, #1d4ed8 58%, #059669 100%); box-shadow: 0 18px 50px rgba(15, 23, 42, 0.28); }
.eyebrow { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.8; }
.celebration-card h2 { margin-top: 8px; font-size: 1.35rem; }
.desc { margin-top: 8px; color: rgba(255, 255, 255, 0.82); line-height: 1.6; }
.meter { margin-top: 14px; height: 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.2); overflow: hidden; }
.meter-fill { height: 100%; width: 100%; background: rgba(255, 255, 255, 0.85); transform-origin: left center; animation: countdown 4.2s linear forwards; }
.actions { margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap; }
.primary-btn, .ghost-btn { height: 36px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 0.86rem; }
.primary-btn { background: #fff; color: #0f172a; }
.ghost-btn { border: 1px solid rgba(255, 255, 255, 0.35); background: transparent; color: #fff; cursor: pointer; }
.celebration-pop-enter-active, .celebration-pop-leave-active { transition: all 0.25s ease; }
.celebration-pop-enter-from, .celebration-pop-leave-to { opacity: 0; transform: translateY(14px) scale(0.98); }
@keyframes countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }
@media (max-width: 640px) { .celebration-shell { right: 16px; left: 16px; bottom: 16px; width: auto; } }
</style>

<template>
  <div class="mermaid-container" ref="container">
    <div class="mermaid" :id="id">
      {{ chart }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{
  chart: string
  id: string
}>()

const container = ref<HTMLElement | null>(null)

onMounted(async () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'loose',
    fontFamily: 'inherit'
  })
  await renderChart()
})

const renderChart = async () => {
  if (!container.value) return
  try {
    const { svg } = await mermaid.render(`mermaid-${props.id}`, props.chart)
    container.value.innerHTML = svg
  } catch (e) {
    console.error('Mermaid render error:', e)
  }
}

watch(() => props.chart, renderChart)
</script>

<style scoped>
.mermaid-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow-x: auto;
}

:deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>

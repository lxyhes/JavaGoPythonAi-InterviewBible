<template>
  <a-card class="skill-radar-card" :title="i18nStore.t('dashboard.radarTitle')">
    <div class="radar-container">
      <svg viewBox="0 0 400 350" class="skill-svg">
        <!-- Static background nodes for demo -->
        <g class="nodes">
          <circle v-for="node in nodes" :key="node.id" :cx="node.x" :cy="node.y" :r="node.r" 
            :class="['node', node.status]" />
          <text v-for="node in nodes" :key="'t'+node.id" :x="node.x" :y="node.y + 35" class="node-label">
            {{ node.label }}
          </text>
        </g>
        <!-- Static links -->
        <g class="links">
          <line v-for="(link, i) in links" :key="i" :x1="link.x1" :y1="link.y1" :x2="link.x2" :y2="link.y2" 
            class="link-line" />
        </g>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div class="readiness-overlay">
        <span class="readiness-val">{{ readiness }}%</span>
        <span class="readiness-label">{{ i18nStore.t('dashboard.categoryMastery') }}</span>
      </div>
    </div>
    <div class="radar-footer">
      <p>{{ i18nStore.t('dashboard.radarFooter') }}</p>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { useI18nStore } from '@/stores/i18n'

const learningStore = useLearningStore()
const i18nStore = useI18nStore()
const readiness = computed(() => learningStore.competitivenessScore)

const nodes = [
  { id: 1, label: 'JVM', x: 200, y: 150, r: 25, status: 'mastered' },
  { id: 2, label: '并发', x: 100, y: 100, r: 20, status: 'mastered' },
  { id: 3, label: '网络', x: 300, y: 100, r: 18, status: 'vague' },
  { id: 4, label: '数据库', x: 100, y: 220, r: 22, status: 'mastered' },
  { id: 5, label: '设计模式', x: 300, y: 220, r: 15, status: 'unknown' },
  { id: 6, label: '系统架构', x: 200, y: 270, r: 28, status: 'mastered' },
]

const links = [
  { x1: 200, y1: 150, x2: 100, y2: 100 },
  { x1: 200, y1: 150, x2: 300, y2: 100 },
  { x1: 200, y1: 150, x2: 100, y2: 220 },
  { x1: 200, y1: 150, x2: 300, y2: 220 },
  { x1: 100, y1: 220, x2: 200, y2: 270 },
  { x1: 300, y1: 220, x2: 200, y2: 270 },
]
</script>

<style scoped>
.skill-radar-card {
  border-radius: 16px;
  height: 100%;
}

.skill-radar-card :deep(.ant-card-head) {
  background: var(--primary-gradient);
}

.skill-radar-card :deep(.ant-card-head-title) {
  color: white;
}

.radar-container {
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
}

.skill-svg {
  width: 100%;
  height: 100%;
}

.node {
  stroke-width: 2;
  transition: all 0.3s;
}

.node.mastered {
  fill: var(--primary-500);
  stroke: var(--primary-200);
  filter: url(#glow);
}

.node.vague {
  fill: var(--primary-200);
  stroke: var(--primary-100);
}

.node.unknown {
  fill: var(--bg-secondary);
  stroke: var(--gray-300);
}

.node-label {
  text-anchor: middle;
  font-size: 12px;
  font-weight: 600;
  fill: var(--text-secondary);
}

.link-line {
  stroke: var(--primary-100);
  stroke-width: 1.5;
  stroke-dasharray: 4;
}

.readiness-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.readiness-val {
  display: block;
  font-size: 2.4rem;
  font-weight: 900;
  color: var(--primary-600);
  line-height: 1;
}

.readiness-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 1px;
}

.radar-footer {
  margin-top: 12px;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>

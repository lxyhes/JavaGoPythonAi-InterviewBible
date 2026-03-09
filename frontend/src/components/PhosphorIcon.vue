<template>
  <Component
    :is="iconComponent"
    :size="size"
    :weight="weight"
    :color="color"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as PhosphorIcons from '@phosphor-icons/vue'

type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

interface Props {
  name: string
  size?: number | string
  weight?: IconWeight
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  weight: 'regular',
})

const iconComponent = computed(() => {
  const iconName = props.name.charAt(0).toUpperCase() + props.name.slice(1)
  const fullIconName = `Ph${iconName}`
  return (PhosphorIcons as Record<string, unknown>)[fullIconName] || PhosphorIcons.PhQuestion
})
</script>

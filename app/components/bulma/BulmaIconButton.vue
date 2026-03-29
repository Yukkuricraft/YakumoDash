<template>
  <BulmaButton v-tooltip="tooltip" :title="tooltip" :variant="variant" :size="size" :loading="loading">
    <span class="icon"><FontAwesomeIcon :icon="icon" :size="iconSize" /></span>
  </BulmaButton>
</template>

<script setup lang="ts">
import type { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BulmaButton from './BulmaButton.vue'

defineProps<{
  icon: IconDefinition
  tooltip?: string
  variant?:
    | 'primary'
    | 'danger'
    | 'ghost'
    | 'dark'
    | 'light'
    | 'info'
    | 'success'
    | 'warning'
    | 'link'
    | 'inverted'
    | 'outlined'
  size?: 'small' | 'medium' | 'large'
  iconSize?: SizeProp
  loading?: boolean
}>()
</script>

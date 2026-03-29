<template>
  <div
    class="notification"
    :class="{
      'is-danger': type === 'danger',
      'is-warning': type === 'warning',
      'is-info': type === 'info',
      'is-success': type === 'success',
      'is-primary': type === 'primary',
      'is-light': light,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'danger' | 'warning' | 'info' | 'success' | 'primary'
  light?: boolean
}>()
</script>

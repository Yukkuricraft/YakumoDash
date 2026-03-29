<template>
  <div class="loading-bars">
    <div v-for="label in loading.labels" :key="label" class="loading-bar-item">
      <progress class="progress is-primary mb-0" max="100" />
      <span class="loading-bar-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '~/stores/loading'

const loading = useLoadingStore()
</script>

<style scoped>
.loading-bars {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.loading-bar-item {
  background: rgba(30, 30, 30, 0.88);
  padding: 0.4rem 0;
}

.loading-bar-item :deep(.progress) {
  border-radius: 0;
}

.loading-bar-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: white;
}
</style>

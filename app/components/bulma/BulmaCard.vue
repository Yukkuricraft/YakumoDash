<template>
  <div class="card">
    <header v-if="title || $slots.title" class="card-header">
      <p class="card-header-title">
        <slot name="title">{{ title }}</slot>
      </p>
      <slot name="header-icon" />
    </header>

    <div class="card-content">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

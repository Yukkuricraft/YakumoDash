<template>
  <div class="modal" :class="{ 'is-active': modelValue }">
    <div class="modal-background" @click="modelValue = false" />
    <div class="modal-card" :style="cardStyle">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <slot name="title" />
        </p>
        <button class="delete" @click="modelValue = false" />
      </header>

      <section class="modal-card-body" :class="bodyClass">
        <slot />
      </section>

      <footer class="modal-card-foot is-justify-content-flex-end">
        <slot name="footer" :close="close" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

const modelValue = defineModel<boolean>({ required: true })

defineProps<{
  cardStyle?: CSSProperties | string
  bodyClass?: string
}>()

function close() {
  modelValue.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <button
    class="button"
    :class="{
      'is-primary': variant === 'primary',
      'is-danger': variant === 'danger',
      'is-ghost': variant === 'ghost',
      'is-dark': variant === 'dark',
      'is-light': variant === 'light',
      'is-info': variant === 'info',
      'is-success': variant === 'success',
      'is-warning': variant === 'warning',
      'is-link': variant === 'link',
      'is-inverted': variant === 'inverted',
      'is-outlined': variant === 'outlined',
      'is-small': size === 'small',
      'is-medium': size === 'medium',
      'is-large': size === 'large',
      'is-loading': loading,
    }"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
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
  loading?: boolean
}>()
</script>

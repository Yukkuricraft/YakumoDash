<template>
  <div class="field">
    <label v-if="(label || $slots.label) && type !== 'checkbox'" class="label" :for="id">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="control">
      <slot v-if="$slots.default" :id="id" :has-error="!!error" />
      <label v-else-if="type === 'checkbox'" class="checkbox">
        <input :id="id" v-bind="$attrs" v-model="checked" type="checkbox" />
        <slot name="label">{{ label }}</slot>
      </label>
      <textarea
        v-else-if="type === 'textarea'"
        :id="id"
        v-bind="$attrs"
        v-model="model"
        class="textarea"
        :class="{ 'is-danger': !!error }"
        :placeholder="placeholder"
      />
      <input
        v-else
        :id="id"
        v-bind="$attrs"
        v-model="model"
        class="input"
        :class="{ 'is-danger': !!error }"
        :type="type"
        :placeholder="placeholder"
      />
    </div>
    <p v-if="error" class="help is-danger">{{ error }}</p>
    <p v-else-if="help" class="help">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const model = defineModel<string>()
const checked = defineModel<boolean>('checked')

const props = defineProps<{
  label?: string
  inputId?: string
  type?: string
  placeholder?: string
  error?: string
  help?: string
}>()

const generatedId = useId()
const id = computed(() => props.inputId ?? generatedId)
</script>

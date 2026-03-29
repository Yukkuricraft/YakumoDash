<template>
  <BulmaCardModal v-model="modelValue">
    <template #title>{{ title }}</template>

    <slot>
      <div v-if="description">{{ description }}</div>
    </slot>

    <template #footer="{ close }">
      <div class="buttons">
        <BulmaButton @click="close">Cancel</BulmaButton>
        <BulmaButton variant="danger" @click="confirm">OK</BulmaButton>
      </div>
    </template>
  </BulmaCardModal>
</template>

<script setup lang="ts">
import BulmaButton from '~/components/bulma/BulmaButton.vue'
import BulmaCardModal from '~/components/bulma/BulmaCardModal.vue'

const modelValue = defineModel<boolean>({ required: true })

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Are you sure?',
  },
)

const emit = defineEmits<{
  confirm: []
}>()

function confirm() {
  emit('confirm')
  modelValue.value = false
}
</script>

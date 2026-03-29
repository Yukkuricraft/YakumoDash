<template>
  <BulmaCardModal v-model="modelValue" card-style="width: 80vw; height: 80vh;">
    <template #title>
      Edit Environment Config
      <div class="subtitle">{{ filePath }}</div>
    </template>

    <div v-if="readFile.isPending.value" class="has-text-centered py-4">Loading…</div>
    <BulmaNotification v-else-if="readFile.isError.value" type="danger">Failed to load config file.</BulmaNotification>
    <template v-else>
      <Codemirror v-model="content" :extensions="extensions" :style="{ height: '100%', fontSize: '13px' }" />
      <label class="checkbox mt-3">
        <input v-model="skipRegenerate" type="checkbox" />
        Skip regenerating configs after save
      </label>
    </template>

    <template #footer="{ close }">
      <div class="buttons">
        <BulmaButton @click="close()">Close and Discard Changes</BulmaButton>
        <BulmaButton
          variant="primary"
          :loading="isSaving"
          :disabled="readFile.isPending.value || readFile.isError.value || isSaving"
          @click="save(close)"
        >
          Save Changes
        </BulmaButton>
      </div>
    </template>
  </BulmaCardModal>
</template>

<script setup lang="ts">
import { StreamLanguage } from '@codemirror/language'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { oneDark } from '@codemirror/theme-one-dark'
import { useQueryClient } from '@tanstack/vue-query'
import { usePreferredDark } from '@vueuse/core'
import { Codemirror } from 'vue-codemirror'

import BulmaButton from '~/components/bulma/BulmaButton.vue'
import BulmaCardModal from '~/components/bulma/BulmaCardModal.vue'
import BulmaNotification from '~/components/bulma/BulmaNotification.vue'
import { useReadFile, useRegenerateEnvConfigs, useWriteFile } from '~/composables/files'
import { useNotificationStore } from '~/stores/notifications'

const props = defineProps<{ envName: string; filePath: string }>()
const modelValue = defineModel<boolean>({ required: true })

const notifications = useNotificationStore()
const readFile = useReadFile()
const writeFile = useWriteFile()
const regenerateConfigs = useRegenerateEnvConfigs()

const prefersDark = usePreferredDark()
const tomlLang = StreamLanguage.define(toml)
const extensions = computed(() => (prefersDark.value ? [tomlLang, oneDark] : [tomlLang]))
const content = ref('')
const originalContent = ref('')
const skipRegenerate = ref(false)

const isSaving = computed(() => writeFile.isPending.value || regenerateConfigs.isPending.value)

watch(modelValue, (open) => {
  if (!open) {
    content.value = originalContent.value
    return
  }
  skipRegenerate.value = false
  readFile.mutate(props.filePath, {
    onSuccess: (data) => {
      content.value = data.content
      originalContent.value = data.content
    },
    onError: () => notifications.add({ message: 'Failed to load config file.', type: 'danger', duration: 4000 }),
  })
})

const queryClient = useQueryClient()
async function save(callback: () => void) {
  function finish() {
    modelValue.value = false
    callback()
    return queryClient.invalidateQueries({ queryKey: ['api'] })
  }

  try {
    await writeFile.mutateAsync({ filePath: props.filePath, content: content.value })
  } catch {
    notifications.add({ message: 'Failed to save config.', type: 'danger', duration: 4000 })
    await finish()
    return
  }

  if (skipRegenerate.value) {
    notifications.notify('Config saved.')
    await finish()
    return
  }

  try {
    await regenerateConfigs.mutateAsync(props.envName)
    notifications.notify('Config saved and configs regenerated.')
  } catch {
    notifications.add({ message: 'Config saved, but failed to regenerate configs.', type: 'warning', duration: 0 })
  }

  await finish()
}
</script>

<style scoped>
:deep(.modal-card-body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
</style>

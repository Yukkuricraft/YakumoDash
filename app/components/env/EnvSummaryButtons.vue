<template>
  <div class="buttons">
    <BulmaIconButton
      :icon="faCirclePlay"
      tooltip="Start Environment"
      :loading="startEnv.isPending.value"
      @click="startEnvironment"
    />
    <BulmaIconButton
      :icon="faCircleStop"
      tooltip="Shut Down Environment"
      :loading="stopEnv.isPending.value"
      @click="showStopConfirm = true"
    />
    <BulmaIconButton :icon="faRotateRight" tooltip="Attempt to Restart Environment" disabled />
    <BulmaIconButton :icon="faPenToSquare" tooltip="Edit Environment Config" @click="showEditConfig = true" />
    <BulmaIconButton
      v-if="envName !== 'env1'"
      :icon="faTrash"
      tooltip="DELETE ENVIRONMENT"
      variant="danger"
      :loading="deleteEnv.isPending.value"
      @click="requestDelete"
    />
  </div>

  <BulmaConfirmModal v-model="showStopConfirm" title="Confirm Shutdown of Environment" @confirm="stopEnvironment">
    This action will stop all containers (servers) for the environment '{{ env.formatted }}'.
  </BulmaConfirmModal>

  <EnvConfigEditorModal v-model="showEditConfig" :env-name="envName" :file-path="`gen/env-toml/${envName}.toml`" />

  <BulmaConfirmModal v-model="showDeleteConfirm" title="Confirm Environment Deletion" @confirm="deleteEnvironment">
    <p>
      This action will <strong>PERMANENTLY</strong> delete the environment <strong>{{ env.formatted }}</strong
      >.
    </p>
    <p class="mt-2">This action is <strong>PERMANENT AND IRREVERSIBLE</strong>. All files and configs will be lost.</p>
    <p class="mt-2">Are you sure?</p>
  </BulmaConfirmModal>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

import { faCirclePlay, faCircleStop, faPenToSquare, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons'

import BulmaConfirmModal from '~/components/bulma/BulmaConfirmModal.vue'
import BulmaIconButton from '~/components/bulma/BulmaIconButton.vue'
import EnvConfigEditorModal from '~/components/env/EnvConfigEditorModal.vue'
import { useDeleteEnvironment, useStartEnvironment, useStopEnvironment } from '~/composables/environments'
import { useNotificationStore } from '~/stores/notifications'

const props = defineProps<{ envName: string; env: components['schemas']['EnvModel'] }>()

const notifications = useNotificationStore()
const router = useRouter()
const formattedEnvName = computed(() => props.env.formatted ?? props.envName)

const startEnv = useStartEnvironment(() => props.envName, formattedEnvName)
const stopEnv = useStopEnvironment(() => props.envName, formattedEnvName)
const deleteEnv = useDeleteEnvironment()

const showStopConfirm = ref(false)
const showDeleteConfirm = ref(false)
const showEditConfig = ref(false)

function startEnvironment() {
  startEnv.mutate(undefined, {
    onSuccess: () => notifications.notify('Environment is starting up.'),
    onError: () => notifications.add({ message: 'Failed to start environment.', type: 'danger', duration: 4000 }),
  })
}

function stopEnvironment() {
  notifications.notify('This might take a bit to complete. Girls are preparing')
  stopEnv.mutate(undefined, {
    onSuccess: () => notifications.notify(`Done shutting down env '${formattedEnvName.value}'`),
    onError: () => notifications.add({ message: 'Failed to stop environment.', type: 'danger', duration: 4000 }),
  })
}

function requestDelete() {
  const envConfig = props.env.config as unknown as { general: { enable_env_protection: boolean } }
  if (envConfig.general.enable_env_protection) {
    notifications.add({
      message: `Env Protection is enabled on ${formattedEnvName.value}. Disable it in the env configs before deleting this env.`,
      type: 'warning',
      duration: 6000,
    })
    return
  }
  showDeleteConfirm.value = true
}

function deleteEnvironment() {
  deleteEnv.mutate(props.envName, {
    onSuccess: () => {
      notifications.notify(`Done deleting env '${formattedEnvName.value}'`)
      router.push('/')
    },
    onError: () => notifications.add({ message: 'Failed to delete environment.', type: 'danger', duration: 4000 }),
  })
}
</script>

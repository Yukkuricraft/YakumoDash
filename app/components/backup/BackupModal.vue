<template>
  <BulmaCardModal v-model="modelValue" card-style="width: 80vw; height: 80vh;" @update:model-value="onModalToggle">
    <template #title>
      <span>Backups for {{ formattedContainerName }}</span>
      <BulmaButton size="small" class="ml-3" :loading="createBackupMutation.isPending.value" @click="createBackup">
        <span class="icon"><FontAwesomeIcon :icon="faFolderPlus" /></span>
        <span>New Backup</span>
      </BulmaButton>
    </template>

    <div v-if="backups.isPending.value" class="has-text-centered py-4">Loading backups…</div>
    <BulmaNotification v-else-if="backups.isError.value" type="danger">Failed to load backups.</BulmaNotification>
    <template v-else>
      <div class="columns">
        <div class="column">
          <BackupTable v-model="selectedBackup" :backups="backups.data?.value?.backups ?? []" />
        </div>

        <div v-if="selectedBackup" class="column box mt-4">
          <BackupDetails
            v-model="selectedBackup"
            :container-running="containerRunning"
            :container-name="container.container_name"
          />
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <BulmaButton @click="close()">Close</BulmaButton>
    </template>
  </BulmaCardModal>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BackupDetails from '~/components/backup/BackupDetails.vue'
import BackupTable from '~/components/backup/BackupTable.vue'
import BulmaButton from '~/components/bulma/BulmaButton.vue'
import BulmaCardModal from '~/components/bulma/BulmaCardModal.vue'
import BulmaNotification from '~/components/bulma/BulmaNotification.vue'
import { useCreateBackup, useListBackups } from '~/composables/backups'
import { getContainerNameLabel, getFormattedContainerName } from '~/composables/containers'
import { useLoadingStore } from '~/stores/loading'
import { useNotificationStore } from '~/stores/notifications'

type LegacyDefinedContainer = components['schemas']['LegacyDefinedContainer']
type Backup = components['schemas']['Backup']

const props = defineProps<{
  container: LegacyDefinedContainer
  envName: string
  containerRunning: boolean
}>()

const modelValue = defineModel<boolean>({ required: true })
const selectedBackup = ref<Backup | null>(null)

const notifications = useNotificationStore()
const loading = useLoadingStore()

const containerNameLabel = computed(() => getContainerNameLabel(props.container.labels))
const formattedContainerName = computed(() => getFormattedContainerName(props.container.labels))

const backups = useListBackups(() => props.envName, containerNameLabel)

const createBackupMutation = useCreateBackup()

function createBackup() {
  loading.start(`Creating new backup: ${props.container.container_name}`)
  createBackupMutation.mutate(
    { envName: props.envName, worldGroup: containerNameLabel.value },
    {
      onSuccess: () => notifications.notify('Backup created successfully.'),
      onError: () => notifications.add({ message: 'Failed to create backup.', type: 'danger', duration: 4000 }),
      onSettled: () => loading.stop(`Creating new backup: ${props.container.container_name}`),
    },
  )
}

function onModalToggle(open: boolean | undefined) {
  if (!open) {
    selectedBackup.value = null
  }
}
</script>

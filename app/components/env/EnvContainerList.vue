<template>
  <div class="columns is-multiline">
    <div v-for="container in containers" :key="container.container_name" class="column is-half">
      <ContainerStatusCard
        :container="container"
        :active-container="activeContainerMap.get(container.container_name)"
        :env-name="envName"
        @manage-backups="() => openBackupModal(container)"
        @open-console="() => openConsoleModal(container)"
      />
    </div>
  </div>

  <BackupModal
    v-if="backupModalContainer"
    v-model="showBackupModal"
    :container="backupModalContainer"
    :env-name="envName"
    :container-running="backupModalContainerRunning"
  />

  <ContainerConsoleModal
    v-if="showConsoleModal && consoleModalContainer && consoleModalActiveContainer"
    v-model="showConsoleModal"
    :container="consoleModalContainer"
    :active-container="consoleModalActiveContainer"
    :env-name="envName"
  />
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

import BackupModal from '~/components/backup/BackupModal.vue'
import ContainerConsoleModal from '~/components/container/ContainerConsoleModal.vue'
import ContainerStatusCard from '~/components/container/ContainerStatusCard.vue'
import { useActiveContainers } from '~/composables/containers'
import { useNotificationStore } from '~/stores/notifications'

type LegacyDefinedContainer = components['schemas']['LegacyDefinedContainer']
type ActiveContainer = components['schemas']['LegacyActiveContainer']

const props = defineProps<{ envName: string; containers: LegacyDefinedContainer[] }>()

const { data: activeContainersData } = useActiveContainers(() => props.envName)

const activeContainerMap = computed(() => {
  const map = new Map<string, ActiveContainer>()
  for (const c of activeContainersData.value?.active_containers ?? []) {
    map.set(c.ContainerName, c)
  }
  return map
})

const showBackupModal = ref(false)
const backupModalContainer = ref<LegacyDefinedContainer | null>(null)

const backupModalContainerRunning = computed(() => {
  if (!backupModalContainer.value) return false
  const active = activeContainerMap.value.get(backupModalContainer.value.container_name)
  return active?.State === 'running'
})

function openBackupModal(container: LegacyDefinedContainer) {
  backupModalContainer.value = container
  showBackupModal.value = true
}

const showConsoleModal = ref(false)
const consoleModalContainer = ref<LegacyDefinedContainer | null>(null)
const consoleModalActiveContainer = computed(() => {
  if (!consoleModalContainer.value) return undefined
  return activeContainerMap.value.get(consoleModalContainer.value.container_name)
})

function openConsoleModal(container: LegacyDefinedContainer) {
  const active = activeContainerMap.value.get(container.container_name)
  if (!active) {
    useNotificationStore().add({
      message: 'Container is not active — cannot open console.',
      type: 'warning',
      duration: 4000,
    })
    return
  }
  consoleModalContainer.value = container
  showConsoleModal.value = true
}
</script>

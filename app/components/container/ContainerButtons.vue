<template>
  <div class="buttons">
    <BulmaIconButton
      :icon="faCirclePlay"
      tooltip="Start the container"
      :disabled="containerState === 'up' || isStarting"
      @click="startContainer"
    />
    <BulmaIconButton
      :icon="faCircleStop"
      tooltip="Stop Container"
      :disabled="containerState === 'down' || isStopping"
      @click="stopContainer"
    />
    <BulmaIconButton
      v-if="isMcOrVelocity"
      :icon="faPenToSquare"
      tooltip="Edit filesystem and configs"
      @click="editConfig"
    />
    <BulmaIconButton
      v-if="isMcOrVelocity"
      :icon="faTerminal"
      tooltip="Connect to this world group's server console"
      :disabled="containerState !== 'up' && !isStarting"
      @click="emit('openConsole')"
    />
    <BulmaIconButton
      v-if="isBackupsEnabled"
      :icon="faCloudArrowUp"
      tooltip="Manage Backups"
      @click="emit('manageBackups')"
    />
  </div>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

import {
  faCirclePlay,
  faCircleStop,
  faCloudArrowUp,
  faPenToSquare,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons'

import BulmaIconButton from '~/components/bulma/BulmaIconButton.vue'
import {
  ContainerType,
  getContainerNameLabel,
  getContainerType,
  useStartContainer,
  useStopContainer,
} from '~/composables/containers'
import { useNotificationStore } from '~/stores/notifications'

type LegacyDefinedContainer = components['schemas']['LegacyDefinedContainer']

const props = defineProps<{
  container: LegacyDefinedContainer
  containerState: 'up' | 'down' | 'unknown' | 'transitioning'
  envName: string
}>()

const emit = defineEmits<{
  openConsole: []
  manageBackups: []
}>()

const containerType = computed(() => getContainerType(props.container.labels))
const isMinecraft = computed(() => containerType.value === ContainerType.Minecraft)
const isVelocity = computed(() => containerType.value === ContainerType.MCProxy)
const isMcOrVelocity = computed(() => isMinecraft.value || isVelocity.value)
const isBackupsEnabled = computed(() => isMinecraft.value)

const { mutate: startContainerMutate, isPending: isStarting } = useStartContainer(
  () => props.container.hostname,
  () => props.envName,
)
const { mutate: stopContainerMutate, isPending: isStopping } = useStopContainer(
  () => props.container.hostname,
  () => props.envName,
)

const notifications = useNotificationStore()
const config = useRuntimeConfig()

function startContainer() {
  startContainerMutate(undefined, {
    onSuccess: () => notifications.notify(`Started ${props.container.hostname}`),
    onError: () =>
      notifications.add({ message: `Failed to start ${props.container.hostname}`, type: 'danger', duration: 4000 }),
  })
}

function stopContainer() {
  stopContainerMutate(undefined, {
    onSuccess: () => notifications.notify(`Stopped ${props.container.hostname}`),
    onError: () =>
      notifications.add({ message: `Failed to stop ${props.container.hostname}`, type: 'danger', duration: 4000 }),
  })
}

function editConfig() {
  let subPath: string
  if (isMinecraft.value) {
    const worldGroup = getContainerNameLabel(props.container.labels)
    subPath = `files/${props.envName}/minecraft/${worldGroup}`
  } else {
    subPath = `files/${props.envName}/velocity`
  }
  window.open(`${config.public.protocol}://${config.public.filebrowserHost}/${subPath}`, '_blank')
}
</script>

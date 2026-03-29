<template>
  <BulmaCard :title="formattedName">
    <template #header-icon>
      <span class="card-header-icon" style="cursor: default">
        <span v-tooltip="stateDescription" class="icon" :class="stateColorClass" :title="stateDescription">
          <FontAwesomeIcon :icon="faCircle" />
        </span>
      </span>
    </template>

    <div class="is-flex is-align-items-center is-justify-content-space-between mb-2">
      <div>
        <span class="has-text-grey">Status:</span>
        <em> {{ activeContainer?.Status ?? 'Offline' }}</em>
      </div>
      <BulmaButton size="small" variant="ghost" @click="toggleInfoLevel">{{ toggleButtonText }}</BulmaButton>
    </div>

    <template v-if="showExtraInfo">
      <div class="mb-1">
        <span class="has-text-grey">Entrypoint Command:</span>
        <code class="ml-1">{{ activeContainer?.Command }}</code>
      </div>
      <div class="mb-1">
        <span class="has-text-grey">Container Name:</span>
        <div v-for="name in activeContainer?.Names" :key="name" class="ml-3">
          <code>{{ name }}</code>
        </div>
      </div>
      <div class="mb-2">
        <span class="has-text-grey">Networks:</span>
        <div v-for="net in activeContainer?.Networks" :key="net" class="ml-3">
          <code>{{ net }}</code>
        </div>
      </div>
    </template>

    <template v-if="showExtraExtraInfo">
      <div class="mb-1">
        <span class="has-text-grey">Ports:</span>
        <div v-for="port in activeContainer?.Ports" :key="port" class="ml-3">
          <code>{{ port }}</code>
        </div>
      </div>
      <div class="mb-2">
        <span class="has-text-grey">Mounts:</span>
        <div v-for="mount in activeContainer?.Mounts" :key="mount" class="ml-3">
          <code>{{ mount }}</code>
        </div>
      </div>
    </template>

    <ContainerButtons
      :container="container"
      :container-state="containerState"
      :env-name="envName"
      @manage-backups="emit('manageBackups')"
      @open-console="emit('openConsole')"
    />
  </BulmaCard>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BulmaButton from '~/components/bulma/BulmaButton.vue'
import BulmaCard from '~/components/bulma/BulmaCard.vue'
import ContainerButtons from '~/components/container/ContainerButtons.vue'
import { getFormattedContainerName } from '~/composables/containers'

type LegacyDefinedContainer = components['schemas']['LegacyDefinedContainer']
type LegacyActiveContainer = components['schemas']['LegacyActiveContainer']

const props = defineProps<{
  container: LegacyDefinedContainer
  activeContainer?: LegacyActiveContainer
  envName: string
}>()

const emit = defineEmits<{
  openConsole: []
  manageBackups: []
}>()

const formattedName = computed(() => getFormattedContainerName(props.container.labels))

const containerState = computed(() => {
  const state = props.activeContainer?.State
  if (!state) return 'down'
  if (state === 'running') return 'up'
  if (['dead', 'exited', 'paused'].includes(state)) return 'down'
  if (['created', 'restarting'].includes(state)) return 'transitioning'
  return 'unknown'
})

const stateColorClass = computed(() => ({
  'has-text-success': containerState.value === 'up',
  'has-text-danger': containerState.value === 'down',
  'has-text-warning': containerState.value === 'transitioning',
  'has-text-dark': containerState.value === 'unknown',
}))

const stateDescription = computed(
  () =>
    ({
      up: 'Container is running.',
      down: 'Container is down.',
      transitioning: 'Container is changing waiting for changes...',
      unknown: 'Unknown...',
    })[containerState.value],
)

const MAX_LEVELS = 3
const infoLevel = ref(0)
const showExtraInfo = computed(() => infoLevel.value >= 1)
const showExtraExtraInfo = computed(() => infoLevel.value >= 2)
const toggleButtonText = computed(() => {
  if (infoLevel.value === 0) return 'Show More'
  if (infoLevel.value === 1) return 'Show MORE'
  return 'Hide'
})

function toggleInfoLevel() {
  infoLevel.value = (infoLevel.value + 1) % MAX_LEVELS
}
</script>

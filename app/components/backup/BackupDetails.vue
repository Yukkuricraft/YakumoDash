<template>
  <div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
    <h4 class="title is-5 mb-0">Backup Details</h4>
    <button class="delete" @click="emit('update:modelValue', null)" />
  </div>

  <dl class="backup-details mb-4">
    <dt>Restic Version:</dt>
    <dd>{{ modelValue.program_version }}</dd>
    <dt>Backup Date:</dt>
    <dd>{{ new Date(modelValue.time) }}</dd>
    <dt>Snapshot ID:</dt>
    <dd>
      <code>{{ modelValue.short_id }}</code>
    </dd>
    <dt>Tags:</dt>
    <dd>{{ modelValue.tags?.join(', ') ?? '' }}</dd>
  </dl>

  <div class="mb-4">
    <h5 class="title is-6">Select Worlds To Restore</h5>
    <div v-if="snapshotWorlds.isPending.value">Loading worlds…</div>
    <BulmaNotification v-else-if="snapshotWorlds.isError.value" type="danger" light>
      Failed to load worlds.
    </BulmaNotification>
    <template v-else>
      <label class="checkbox mb-2 is-block">
        <input
          type="checkbox"
          :checked="allSelected"
          :indeterminate.prop="someSelected"
          @change="toggleAll(($event.target as HTMLInputElement).checked)"
        />
        All
      </label>
      <ul>
        <li v-for="world in worldSelections" :key="world.name">
          <label class="checkbox">
            <input v-model="world.selected" type="checkbox" />
            {{ world.name }}
          </label>
        </li>
      </ul>
    </template>
  </div>

  <BulmaNotification v-if="containerRunning" type="warning" light class="mb-4">
    <h5 class="title is-6">Bypass Running Container Restriction?</h5>
    <label class="checkbox mb-2 is-block">
      <input
        v-model="preBypass"
        type="checkbox"
        @change="
          () => {
            if (!preBypass) bypass = false
          }
        "
      />
      Rolling back while the server is running can cause CATASTROPHIC DAMAGE if done incorrectly. Be 100% sure the
      worlds you are restoring are unloaded in Multiverse before proceeding.
    </label>
    <label v-if="preBypass" class="checkbox">
      <input v-model="bypass" type="checkbox" />
      Absolutely sure?
    </label>
  </BulmaNotification>

  <div
    v-tooltip="
      isConfirmDisabled
        ? 'You must select at least one world to restore AND the container must be stopped UNLESS the bypass checkbox is ticked.'
        : 'Start rollback'
    "
  >
    <BulmaButton
      variant="primary"
      :disabled="isConfirmDisabled"
      :loading="restoreBackupMutation.isPending.value"
      @click="confirmRollback"
    >
      Rollback {{ selectedWorlds.length }} {{ selectedWorlds.length === 1 ? 'World' : 'Worlds' }}
    </BulmaButton>
  </div>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

import BulmaButton from '~/components/bulma/BulmaButton.vue'
import BulmaNotification from '~/components/bulma/BulmaNotification.vue'
import { useRestoreBackup, useSnapshotWorlds } from '~/composables/backups'
import { useLoadingStore } from '~/stores/loading'
import { useNotificationStore } from '~/stores/notifications'

type Backup = components['schemas']['Backup']

const props = defineProps<{ modelValue: Backup; containerRunning: boolean; containerName: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: Backup | null): void }>()

const loading = useLoadingStore()
const notifications = useNotificationStore()

const snapshotWorlds = useSnapshotWorlds(() => props.modelValue.short_id)

interface WorldSelection {
  name: string
  selected: boolean
}
const worldSelections = ref<WorldSelection[]>([])

watch(
  () => snapshotWorlds.data.value?.worlds,
  (worlds) => {
    worldSelections.value = (worlds ?? []).map((name) => ({ name, selected: false }))
  },
)

const allSelected = computed(() => worldSelections.value.length > 0 && worldSelections.value.every((w) => w.selected))
const someSelected = computed(() => worldSelections.value.some((w) => w.selected) && !allSelected.value)
const selectedWorlds = computed(() => worldSelections.value.filter((w) => w.selected).map((w) => w.name))

function toggleAll(checked: boolean) {
  worldSelections.value.forEach((w) => (w.selected = checked))
}

const preBypass = ref(false)
const bypass = ref(false)

const isConfirmDisabled = computed(() => selectedWorlds.value.length === 0 || (props.containerRunning && !bypass.value))

const restoreBackupMutation = useRestoreBackup()

function confirmRollback() {
  const backup = props.modelValue
  loading.start(`Rolling back: ${backup.id}`)
  restoreBackupMutation.mutate(
    {
      hostname: backup.hostname,
      snapshotId: backup.id,
      worlds: selectedWorlds.value,
      bypassRunning: bypass.value,
    },
    {
      onSuccess: () => {
        notifications.notify(
          `Successfully rolled back ${props.containerName} to ${new Date(backup.time).toLocaleString()}.`,
        )
      },
      onError: () => {
        notifications.add({ message: 'Failed to start rollback.', type: 'danger', duration: 4000 })
      },
      onSettled: () => {
        loading.stop(`Rolling back: ${backup.id}`)
      },
    },
  )
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      preBypass.value = false
      bypass.value = false
      worldSelections.value = []
    }
  },
)
</script>

<style scoped>
.backup-details {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 0.75rem;
  row-gap: 0.25rem;
}

.backup-details dt {
  font-weight: 600;
}

.backup-details dd {
  font-style: italic;
}
</style>

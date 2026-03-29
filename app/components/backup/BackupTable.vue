<template>
  <table class="table is-fullwidth is-hoverable is-striped">
    <thead>
      <tr>
        <th>Date</th>
        <th>ID</th>
        <th>Tags</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="backup in backups.toReversed()"
        :key="backup.id"
        class="is-clickable"
        :class="{ 'is-selected': selectedBackup?.id === backup.id }"
        @click="selectedBackup = backup"
      >
        <td>{{ new Date(backup.time).toLocaleString() }}</td>
        <td>
          <code>{{ backup.short_id }}</code>
        </td>
        <td>{{ backup.tags?.join(', ') ?? '' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

type Backup = components['schemas']['Backup']

defineProps<{ backups: Backup[] }>()
const selectedBackup = defineModel<Backup | null>({ required: true })
</script>

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useListBackups(envName: MaybeRefOrGetter<string>, containerNameLabel: MaybeRefOrGetter<string>) {
  const { $ycApi } = useNuxtApp()
  return useQuery({
    queryKey: computed(() => ['api', 'backups', 'list', toValue(envName), toValue(containerNameLabel)]),
    queryFn: ({ signal }) =>
      $ycApi('/backups/list', {
        method: 'POST',
        signal,
        body: {
          env_str: toValue(envName),
          target_tags: [toValue(containerNameLabel)],
        },
      }),
  })
}

export function useSnapshotWorlds(snapshotId: MaybeRefOrGetter<string>) {
  const { $ycApi } = useNuxtApp()
  return useQuery({
    queryKey: computed(() => ['api', 'backups', 'snapshot', toValue(snapshotId), 'worlds']),
    queryFn: ({ signal }) =>
      $ycApi('/backups/snapshot/{target_id}/worlds', {
        signal,
        path: { target_id: toValue(snapshotId)! },
      }),
  })
}

export function useCreateBackup() {
  const { $ycApi } = useNuxtApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ envName, worldGroup }: { envName: string; worldGroup: string }) => {
      const result = await $ycApi('/backups/create', {
        method: 'POST',
        body: {
          target_env: envName,
          target_world_group: worldGroup,
        },
      })
      if (!result.success) throw new Error(result.output)
      return result
    },
    onSuccess: (_, { envName }) =>
      queryClient.invalidateQueries({ queryKey: ['api', 'backups', 'list', toValue(envName)] }),
  })
}

export function useRestoreBackup() {
  const { $ycApi } = useNuxtApp()
  return useMutation({
    mutationFn: async ({
      hostname,
      snapshotId,
      worlds,
      bypassRunning,
    }: {
      hostname: string
      snapshotId: string
      worlds: string[]
      bypassRunning: boolean
    }) => {
      const result = await $ycApi('/backups/restore', {
        method: 'POST',
        body: {
          target_hostname: hostname,
          target_snapshot_id: snapshotId,
          target_worlds: worlds,
          bypass_running_container_restriction: bypassRunning,
        },
      })
      if (!result.success) throw new Error(result.output)
      return result
    },
  })
}

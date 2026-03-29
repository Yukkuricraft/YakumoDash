import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { useLoadingStore } from '~/stores/loading'

export const ContainerType = {
  Minecraft: 'minecraft',
  Backup: 'backup',
  MySQL: 'mysql',
  Postgres: 'postgres',
  MCProxy: 'velocity',
  Redis: 'redis',
  Unknown: 'unknown',
} as const
export type ContainerType = (typeof ContainerType)[keyof typeof ContainerType]

export const AuxContainerTypes: ContainerType[] = [
  ContainerType.MCProxy,
  ContainerType.MySQL,
  ContainerType.Postgres,
  ContainerType.Redis,
]

export function getContainerType(labels: Record<string, string>): ContainerType {
  const type = labels['net.yukkuricraft.container_type']
  return Object.values(ContainerType).includes(type as ContainerType) ? (type as ContainerType) : ContainerType.Unknown
}

export function getContainerNameLabel(labels: Record<string, string>): string {
  return labels['net.yukkuricraft.container_name'] ?? 'UnknownContainer'
}

export function getFormattedContainerName(labels: Record<string, string>): string {
  const name = getContainerNameLabel(labels)
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function useDefinedContainers(envName: MaybeRefOrGetter<string>) {
  const { $ycApi } = useNuxtApp()
  return useQuery({
    queryKey: computed(() => ['api', 'containers', 'defined', toValue(envName)]),
    queryFn: ({ signal }) =>
      $ycApi('/server/cluster/{env_str}/defined', {
        signal,
        path: { env_str: toValue(envName) },
      }),
  })
}

export function useActiveContainers(envName: MaybeRefOrGetter<string>) {
  const { $ycApi } = useNuxtApp()
  return useQuery({
    queryKey: computed(() => ['api', 'containers', 'active', toValue(envName)]),
    queryFn: ({ signal }) =>
      $ycApi('/server/cluster/{env_str}/active', {
        signal,
        path: { env_str: toValue(envName) },
      }),
  })
}

export function useStartContainer(containerHostname: MaybeRefOrGetter<string>, envName: MaybeRefOrGetter<string>) {
  const { $ycApi } = useNuxtApp()
  const queryClient = useQueryClient()
  const loading = useLoadingStore()
  return useMutation({
    mutationFn: () =>
      $ycApi('/server/container/{container_name}/up', {
        method: 'POST',
        path: { container_name: toValue(containerHostname) },
      }),
    onMutate: () => loading.start(`Spinning up: ${toValue(containerHostname)}`),
    onSettled: () => {
      loading.stop(`Spinning up: ${toValue(containerHostname)}`)
      return queryClient.invalidateQueries({ queryKey: ['api', 'containers', 'active', toValue(envName)] })
    },
  })
}

export function useStopContainer(containerHostname: MaybeRefOrGetter<string>, envName: MaybeRefOrGetter<string>) {
  const { $ycApi } = useNuxtApp()
  const queryClient = useQueryClient()
  const loading = useLoadingStore()
  return useMutation({
    mutationFn: () =>
      $ycApi('/server/container/{container_name}/down', {
        method: 'POST',
        path: { container_name: toValue(containerHostname) },
      }),
    onMutate: () => loading.start(`Shutting down: ${toValue(containerHostname)}`),
    onSettled: () => {
      loading.stop(`Shutting down: ${toValue(containerHostname)}`)
      return queryClient.invalidateQueries({ queryKey: ['api', 'containers', 'active', toValue(envName)] })
    },
  })
}

export function usePrepareWsAttach() {
  const { $ycApi } = useNuxtApp()
  return useMutation({
    mutationFn: (containerHostname: string) =>
      $ycApi('/server/container/{container_name}/prepare_ws_attach', {
        method: 'POST',
        path: { container_name: containerHostname },
      }),
  })
}

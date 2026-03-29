import type { YcApiRequestBody } from '#open-fetch'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { useLoadingStore } from '~/stores/loading'

export function useEnvironments() {
  const { $ycApi } = useNuxtApp()
  return useQuery({
    queryKey: ['api', 'environment', 'list'],
    queryFn: ({ signal }) => $ycApi('/environments/list', { signal }),
  })
}

export function useCreateEnvironment() {
  const { $ycApi } = useNuxtApp()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: YcApiRequestBody<'environment_create_post'>) =>
      $ycApi('/environments/create', {
        method: 'POST',
        body,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api', 'environment', 'list'] }),
  })
}

export function useStartEnvironment(envName: MaybeRefOrGetter<string>, envFormatted: MaybeRefOrGetter<string>) {
  const { $ycApi } = useNuxtApp()
  const queryClient = useQueryClient()
  const loadingLabel = computed(() => `Spinning up: ${toValue(envFormatted)}`)
  const loading = useLoadingStore()
  return useMutation({
    mutationFn: () =>
      $ycApi('/server/cluster/{env_str}/up', {
        method: 'POST',
        path: { env_str: toValue(envName) },
      }),
    onMutate: () => loading.start(loadingLabel.value),
    onSettled: () => {
      loading.stop(loadingLabel.value)
      return queryClient.invalidateQueries({ queryKey: ['api', 'containers', 'active', toValue(envName)] })
    },
  })
}

export function useStopEnvironment(envName: MaybeRefOrGetter<string>, envFormatted: MaybeRefOrGetter<string>) {
  const { $ycApi } = useNuxtApp()
  const queryClient = useQueryClient()
  const loadingLabel = computed(() => `Shutting down: ${toValue(envFormatted)}`)
  const loading = useLoadingStore()
  return useMutation({
    mutationFn: () =>
      $ycApi('/server/cluster/{env_str}/down', {
        method: 'POST',
        path: { env_str: toValue(envName) },
      }),
    onMutate: () => loading.start(loadingLabel.value),
    onSettled: () => {
      loading.stop(loadingLabel.value)
      return queryClient.invalidateQueries({ queryKey: ['api', 'containers', 'active', toValue(envName)] })
    },
  })
}

export function useDeleteEnvironment() {
  const { $ycApi } = useNuxtApp()
  const queryClient = useQueryClient()
  const loading = useLoadingStore()
  return useMutation({
    mutationFn: (envName: string) =>
      $ycApi('/environments/{env_str}', {
        method: 'DELETE',
        path: { env_str: envName },
      }),
    onMutate: (envName) => loading.start(`Deleting: ${envName}`),
    onSettled: (_, __, envName) => {
      loading.stop(`Deleting: ${envName}`)
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['api', 'environment', 'list'] }),
        queryClient.invalidateQueries({ queryKey: ['api', 'containers', 'active', toValue(envName)] }),
      ])
    },
  })
}

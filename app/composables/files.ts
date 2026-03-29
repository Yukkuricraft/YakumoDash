import { useMutation } from '@tanstack/vue-query'

export function useReadFile() {
  const { $ycApi } = useNuxtApp()
  return useMutation({
    mutationFn: (filePath: string) =>
      $ycApi('/files/read', {
        method: 'POST',
        body: { FILE_PATH: filePath },
      }),
  })
}

export function useWriteFile() {
  const { $ycApi } = useNuxtApp()
  return useMutation({
    mutationFn: ({ filePath, content }: { filePath: string; content: string }) =>
      $ycApi('/files/write', {
        method: 'POST',
        body: { FILE_PATH: filePath, CONTENT: content },
      }),
  })
}

export function useRegenerateEnvConfigs() {
  const { $ycApi } = useNuxtApp()
  return useMutation({
    mutationFn: (envName: string) =>
      $ycApi('/environments/{env_str}/generate/configs', {
        method: 'POST',
        path: { env_str: envName },
      }),
  })
}

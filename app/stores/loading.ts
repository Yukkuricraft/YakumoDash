export const useLoadingStore = defineStore('loading', () => {
  const active = ref<Map<string, number>>(new Map())

  function start(label: string) {
    active.value.set(label, (active.value.get(label) ?? 0) + 1)
  }

  function stop(label: string) {
    const count = active.value.get(label) ?? 0
    if (count <= 1) active.value.delete(label)
    else active.value.set(label, count - 1)
  }

  const labels = computed(() => [...active.value.keys()])

  return { labels, start, stop }
})

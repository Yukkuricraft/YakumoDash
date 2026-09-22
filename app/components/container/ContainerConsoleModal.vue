<template>
  <BulmaCardModal v-model="modelValue" card-style="width: 90vw; height: 90vh" body-class="console-modal-body">
    <template #title>Server Console - {{ containerTitle }}</template>

    <div ref="terminalEl" class="terminal-container" />
  </BulmaCardModal>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

import { useDebounceFn } from '@vueuse/core'
import { AttachAddon } from '@xterm/addon-attach'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'

import BulmaCardModal from '~/components/bulma/BulmaCardModal.vue'
import { ContainerType, getContainerType, useResizeContainerTty } from '~/composables/containers'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'

type LegacyDefinedContainer = components['schemas']['LegacyDefinedContainer']
type LegacyActiveContainer = components['schemas']['LegacyActiveContainer']

const props = defineProps<{
  container: LegacyDefinedContainer
  activeContainer: LegacyActiveContainer
  envName: string
}>()

const modelValue = defineModel<boolean>({ required: true })

const config = useRuntimeConfig()
const auth = useAuthStore()
const notifications = useNotificationStore()

const containerTitle = computed(() => props.activeContainer.Names[0] ?? props.container.container_name)

const terminalEl = ref<HTMLElement | null>(null)

const terminal = shallowRef<Terminal>()
const socket = shallowRef<WebSocket>()
const fitAddon = shallowRef<FitAddon>()

const lastLogReceivedCheckIntervalMs = 250
const checkLogsLoadedInterval = ref<ReturnType<typeof setInterval> | null>(null)
const lastLogReceivedTime = ref<number | null>(null)
const logsLoaded = ref(false)

const { mutateAsync: resizeContainerTty } = useResizeContainerTty()

// Docker's websocket attach carries no resize channel, and containers come up with a
// 0x0 TTY that leaves jline3 rendering nothing back. Push the real dimensions over the
// API instead, both before attaching and whenever the terminal is refitted.
async function sendTerminalSize() {
  const h = terminal.value?.rows
  const w = terminal.value?.cols
  if (!h || !w) return

  try {
    await resizeContainerTty({ containerHostname: props.activeContainer.Hostname, h, w })
  } catch {
    notifications.add({
      message: 'Could not set the console size — input may not render correctly.',
      type: 'warning',
      duration: 6000,
    })
  }
}

const onWsMessageReceived = () => {
  if (!logsLoaded.value) {
    lastLogReceivedTime.value = Date.now()
  }
}

const checkLogsLoaded = () => {
  if (!lastLogReceivedTime.value || !checkLogsLoadedInterval.value) return

  const timeSinceLastLog = Date.now() - lastLogReceivedTime.value
  if (timeSinceLastLog > lastLogReceivedCheckIntervalMs) {
    logsLoaded.value = true
    clearInterval(checkLogsLoadedInterval.value)
    checkLogsLoadedInterval.value = null
    socket.value?.removeEventListener('message', onWsMessageReceived)
  }
}

const setUpTerminal = () => {
  if (!fitAddon.value || !terminalEl.value || !terminal.value) return

  terminal.value.open(terminalEl.value)
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.attachCustomKeyEventHandler((ev) => {
    if (ev.type !== 'keydown') return true

    const key = ev.key.toLowerCase()

    if (ev.ctrlKey && !ev.shiftKey) {
      if (key === 'c') {
        // Copy selected text to clipboard, but always block SIGINT reaching the process
        const selection = terminal.value?.getSelection()
        if (selection) navigator.clipboard.writeText(selection)
        return false
      }
      if (key === 'd') return false // Block EOF — would disconnect/kill process
      if (key === 'z') return false // Block SIGTSTP — would suspend process
      if (ev.key === '\\') return false // Block SIGQUIT
    }

    // Ctrl+Shift+C — explicit copy
    if (ev.ctrlKey && ev.shiftKey && key === 'c') {
      const selection = terminal.value?.getSelection()
      if (selection) navigator.clipboard.writeText(selection)
      return false
    }

    // Ctrl+V / Ctrl+Shift+V — paste from clipboard
    if (ev.ctrlKey && key === 'v') {
      navigator.clipboard.readText().then((text) => {
        // Strip C0 control characters (except tab) and DEL — prevents pasting raw
        // signal bytes (e.g. \x03 SIGINT) that would bypass the keyboard-level blocks above
        // eslint-disable-next-line no-control-regex
        const sanitized = text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
        terminal.value?.paste(sanitized)
      })
      return false
    }

    return true
  })
  fitAddon.value.fit()
}

const onWsSocketOpen = () => {
  if (!socket.value || !terminal.value) return
  terminal.value.loadAddon(new AttachAddon(socket.value))
  // Re-send now that layout has definitely settled, in case the pre-attach fit
  // measured a modal that hadn't been laid out yet and reported no dimensions.
  void sendTerminalSize()
}

const sendTerminalSizeDebounced = useDebounceFn(sendTerminalSize, 200)

const onWindowResize = () => {
  fitAddon.value?.fit()
  void sendTerminalSizeDebounced()
}

function openConsole() {
  if (!terminalEl.value) return

  // convertEol: containers without a TTY (velocity) have no kernel onlcr translation and
  // their jline falls back to raw System.out, so their output arrives as bare LF and would
  // otherwise staircase. Harmless for TTY containers, whose CRLF already returns the cursor.
  terminal.value = new Terminal({ convertEol: true })
  fitAddon.value = new FitAddon()

  // Open and fit first so the TTY can be sized from real dimensions below.
  setUpTerminal()

  checkLogsLoadedInterval.value = setInterval(checkLogsLoaded, lastLogReceivedCheckIntervalMs)

  void sendTerminalSize().then(() => {
    const isVelocity = getContainerType(props.container.labels) === ContainerType.MCProxy
    const useLogs = isVelocity ? 'logs=1&' : ''
    const protocol = config.public.useAuth ? 'wss' : 'ws'
    // TODO: Should change auth token to a WSS specific auth token with request origin validation because it's not
    // encrypted - traffic snooping could reuse it in theory
    const wsUrl = `${protocol}://${config.public.wssHost}/containers/${props.activeContainer.ID}/attach/ws?${useLogs}stdin=1&stdout=1&stderr=1&stream=1&Authorization=${auth.accessToken}`

    socket.value = new WebSocket(wsUrl)
    socket.value.addEventListener('message', onWsMessageReceived)
    socket.value.addEventListener('open', onWsSocketOpen)
  })
}

function cleanup() {
  if (socket.value) {
    socket.value.close()
    socket.value = undefined
  }

  terminal.value?.clear()
  terminal.value?.dispose()
  terminal.value = undefined

  if (checkLogsLoadedInterval.value !== null) {
    clearInterval(checkLogsLoadedInterval.value)
    checkLogsLoadedInterval.value = null
  }
}

onMounted(() => {
  openConsole()
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style>
@import '@xterm/xterm/css/xterm.css';

.console-modal-body {
  padding: 0 !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
}

.console-modal-body .terminal-container {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}
</style>

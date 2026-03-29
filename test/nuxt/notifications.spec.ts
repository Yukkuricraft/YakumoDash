import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useNotificationStore } from '~/stores/notifications'

describe('useNotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with an empty notification list', () => {
    const store = useNotificationStore()
    expect(store.notifications).toHaveLength(0)
  })

  it('add() appends a notification', () => {
    const store = useNotificationStore()
    store.add({ message: 'hello', type: 'info', duration: 0 })
    expect(store.notifications).toHaveLength(1)
    const n = store.notifications[0]!
    expect(n.message).toBe('hello')
    expect(n.type).toBe('info')
  })

  it('add() assigns incrementing ids', () => {
    const store = useNotificationStore()
    store.add({ message: 'first', type: 'info', duration: 0 })
    store.add({ message: 'second', type: 'success', duration: 0 })
    expect(store.notifications[0]!.id).toBe(0)
    expect(store.notifications[1]!.id).toBe(1)
  })

  it('remove() deletes a notification by id', () => {
    const store = useNotificationStore()
    store.add({ message: 'to remove', type: 'warning', duration: 0 })
    const { id } = store.notifications[0]!
    store.remove(id)
    expect(store.notifications).toHaveLength(0)
  })

  it('remove() leaves other notifications intact', () => {
    const store = useNotificationStore()
    store.add({ message: 'keep', type: 'info', duration: 0 })
    store.add({ message: 'remove', type: 'danger', duration: 0 })
    store.remove(store.notifications[1]!.id)
    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0]!.message).toBe('keep')
  })

  it('auto-dismisses a notification after its duration elapses', () => {
    const store = useNotificationStore()
    store.add({ message: 'temporary', type: 'success', duration: 2000 })
    expect(store.notifications).toHaveLength(1)
    vi.advanceTimersByTime(2000)
    expect(store.notifications).toHaveLength(0)
  })

  it('does not dismiss a notification before its duration elapses', () => {
    const store = useNotificationStore()
    store.add({ message: 'not yet', type: 'info', duration: 3000 })
    vi.advanceTimersByTime(2999)
    expect(store.notifications).toHaveLength(1)
  })

  it('never auto-dismisses a notification with duration 0', () => {
    const store = useNotificationStore()
    store.add({ message: 'persistent', type: 'danger', duration: 0 })
    vi.advanceTimersByTime(60_000)
    expect(store.notifications).toHaveLength(1)
  })

  it('notify() creates an info notification with 4 s duration', () => {
    const store = useNotificationStore()
    store.notify('simple message')
    expect(store.notifications).toHaveLength(1)
    const n = store.notifications[0]!
    expect(n.message).toBe('simple message')
    expect(n.type).toBe('info')
    expect(n.duration).toBe(4000)
  })

  it('notify() auto-dismisses after 4 s', () => {
    const store = useNotificationStore()
    store.notify('will disappear')
    vi.advanceTimersByTime(4000)
    expect(store.notifications).toHaveLength(0)
  })

  it('notify() attaches an optional action', () => {
    const store = useNotificationStore()
    const fn = vi.fn()
    store.notify('with action', { label: 'Undo', fn })
    const { action } = store.notifications[0]!
    expect(action?.label).toBe('Undo')
    expect(action?.fn).toBe(fn)
  })
})

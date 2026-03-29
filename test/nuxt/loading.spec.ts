import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'

import { useLoadingStore } from '~/stores/loading'

describe('useLoadingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with no active labels', () => {
    const store = useLoadingStore()
    expect(store.labels).toHaveLength(0)
  })

  it('start() makes a label appear in labels', () => {
    const store = useLoadingStore()
    store.start('fetching data')
    expect(store.labels).toContain('fetching data')
  })

  it('stop() removes a label after a single start/stop pair', () => {
    const store = useLoadingStore()
    store.start('task')
    store.stop('task')
    expect(store.labels).not.toContain('task')
  })

  it('requires as many stop() calls as start() calls (ref counting)', () => {
    const store = useLoadingStore()
    store.start('task')
    store.start('task')
    store.stop('task')
    expect(store.labels).toContain('task') // still active

    store.stop('task')
    expect(store.labels).not.toContain('task') // now fully stopped
  })

  it('stop() on a label that was never started does not throw', () => {
    const store = useLoadingStore()
    expect(() => store.stop('ghost')).not.toThrow()
    expect(store.labels).not.toContain('ghost')
  })

  it('tracks multiple independent labels simultaneously', () => {
    const store = useLoadingStore()
    store.start('alpha')
    store.start('beta')

    expect(store.labels).toContain('alpha')
    expect(store.labels).toContain('beta')

    store.stop('alpha')
    expect(store.labels).not.toContain('alpha')
    expect(store.labels).toContain('beta')
  })

  it('labels computed property reflects current active keys', () => {
    const store = useLoadingStore()
    expect(store.labels).toEqual([])

    store.start('x')
    store.start('y')
    expect(store.labels).toHaveLength(2)

    store.stop('x')
    store.stop('y')
    expect(store.labels).toEqual([])
  })
})

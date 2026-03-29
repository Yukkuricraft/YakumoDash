export interface Notification {
  id: number
  message: string
  action?: { label: string; fn: () => void }
  type: 'info' | 'success' | 'warning' | 'danger'
  duration: number
}

type NotificationInput = Omit<Notification, 'id'>

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  let nextId = 0

  function add(notification: NotificationInput) {
    const id = nextId++
    notifications.value.push({ id, ...notification })

    if (notification.duration > 0) {
      setTimeout(() => remove(id), notification.duration)
    }
  }

  function remove(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  function notify(message: string, action?: Notification['action']) {
    add({ message, action, type: 'info', duration: 4000 })
  }

  return { notifications, add, remove, notify }
})

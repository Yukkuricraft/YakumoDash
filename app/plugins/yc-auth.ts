import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()

  nuxtApp.hook('openFetch:onRequest:ycApi', (ctx) => {
    if (auth.accessToken) {
      ctx.options.headers.set('Authorization', `Bearer ${auth.accessToken}`)
    }
  })

  nuxtApp.hook('openFetch:onResponseError:ycApi', async (ctx) => {
    if (ctx.response.status === 401 && !ctx.request.toString().includes('/auth/login')) {
      const notifications = useNotificationStore()
      auth.accessToken = null
      notifications.notify('Could not authenticate you. Redirecting to Login Page.')
      await nuxtApp.runWithContext(() => navigateTo('/login'))
    }
  })
})

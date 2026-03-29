import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const auth = useAuthStore()
  const {
    public: { useAuth },
  } = useRuntimeConfig()

  if (!useAuth) return

  if (!auth.loggedIn) {
    return navigateTo('/login')
  }

  if (!auth.validated) {
    const ok = await auth.validate()
    if (!ok) return navigateTo('/login')
  }
})

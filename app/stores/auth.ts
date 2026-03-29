import { useSessionStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const { $ycApi } = useNuxtApp()

  const accessToken = useSessionStorage<string | null>('auth.yakumo.access_token', null)
  const loggedIn = computed(() => accessToken.value !== null)
  const validated = ref(false)

  async function validate() {
    if (!accessToken.value) return false
    try {
      await $ycApi('/auth/me')
      validated.value = true
      return true
    } catch {
      accessToken.value = null
      validated.value = false
      return false
    }
  }

  async function login(idToken: string) {
    // eslint-disable-next-line camelcase
    const { access_token } = await $ycApi('/auth/login', {
      method: 'POST',
      body: { id_token: idToken },
    })
    // eslint-disable-next-line camelcase
    accessToken.value = access_token
    validated.value = true
  }

  async function bypassLogin() {
    accessToken.value = 'bypass'
    await login('Bearer token bypass')
  }

  async function logout() {
    if (accessToken.value) {
      await $ycApi('/auth/logout', { method: 'POST' })
      console.log('LOGOUT SUCCESSFUL')
    }
    accessToken.value = null
    validated.value = false
    await navigateTo('/login')
  }

  return { accessToken, loggedIn, validated, validate, login, bypassLogin, logout }
})

<template>
  <div ref="buttonEl" />
</template>

<script setup lang="ts">
import { useScriptGoogleSignIn } from '#nuxt-scripts/registry/google-sign-in.js'

import { useAuthStore } from '~/stores/auth'

const buttonEl = ref<HTMLElement | null>(null)
const auth = useAuthStore()
const config = useRuntimeConfig()

const { load } = useScriptGoogleSignIn({
  clientId: config.public.gOauth2ClientId,
})

onMounted(async () => {
  const { accounts } = await load()

  accounts.id.initialize({
    client_id: config.public.gOauth2ClientId,
    callback: async ({ credential }) => {
      await auth.login(credential)
      await navigateTo('/')
    },
  })

  if (buttonEl.value) {
    accounts.id.renderButton(buttonEl.value, {
      theme: 'outline',
      size: 'large',
    })
  }
})
</script>

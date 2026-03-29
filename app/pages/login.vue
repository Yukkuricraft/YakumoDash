<template>
  <section class="login-section">
    <div class="card login-card">
      <div class="card-content has-text-centered">
        <p style="margin-bottom: 8px; font-style: italic">Let The Machine Consume You</p>
        <BulmaButton v-if="bypassAuth" variant="primary" @click="onBypassLogin">"Log in"</BulmaButton>
        <GoogleSignInButton v-else />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BulmaButton from '~/components/bulma/BulmaButton.vue'
import GoogleSignInButton from '~/components/GoogleSignInButton.vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const {
  public: { useAuth },
} = useRuntimeConfig()

const bypassAuth = !useAuth

if (auth.loggedIn) {
  await navigateTo('/')
}

async function onBypassLogin() {
  await auth.bypassLogin()
  await navigateTo('/')
}
</script>

<style scoped>
.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-card {
  min-width: 25vw;
  min-height: 10vh;
}
</style>

<template>
  <nav class="navbar is-primary">
    <div class="container">
      <div class="navbar-brand">
        <span class="navbar-item has-text-white" style="font-style: italic">Yakumo Dash</span>

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          style="--bulma-navbar-burger-color: white"
          @click="toggleNavMenu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div ref="navMenu" class="navbar-menu">
        <div class="navbar-end">
          <div v-if="authStore.loggedIn" class="navbar-item">
            <BulmaButton variant="dark" @click="authStore.logout()">Log out</BulmaButton>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <div class="section site-content is-flex">
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import BulmaButton from '~/components/bulma/BulmaButton.vue'
import { useAuthStore } from '~/stores/auth'

const navMenu = ref<HTMLElement | null>(null)
const authStore = useAuthStore()

function toggleNavMenu(ev: Event) {
  if (navMenu.value) {
    navMenu.value.classList.toggle('is-active')
  }
  if (ev.currentTarget instanceof HTMLElement) {
    ev.currentTarget.classList.toggle('is-active')
  }
}
</script>

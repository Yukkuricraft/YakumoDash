import { config } from '@fortawesome/fontawesome-svg-core'

export default defineNuxtPlugin(() => {
  // Disable auto-adding CSS — Nuxt handles this via the css config
  config.autoAddCss = false
})

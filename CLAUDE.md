# YakumoDash Nuxt

A Nuxt 4 rewrite of YakumoDash — a dashboard for managing Docker containers and
Minecraft server environments for Yukkuricraft. The original app lives at
`~/DevProjects/Stable/YakumoDash` (Angular 17) and is the reference for porting
features.

## Tech Stack

- **Nuxt 4** — SPA mode (`ssr: false`), no server
- **Bulma** — CSS framework, loaded via SCSS in `app/assets/css/main.scss`
- **Pinia** — state management
- **TanStack Query** — data fetching and caching
- **nuxt-open-fetch** — typed API client generated from the OpenAPI spec
- **VueUse** — utility composables
- **Font Awesome** — icons (per-component imports only, no global library
  registration)

## Environment Config

Three environments mirroring the Angular app:

| Environment     | How to activate                              |
| --------------- | -------------------------------------------- |
| Dev (default)   | `runtimeConfig` defaults in `nuxt.config.ts` |
| Production      | `.env.production`                            |
| Local (no auth) | `.env.local`                                 |

`yarn dev` loads `.env.local` automatically (`--dotenv .env.local`).

Key public runtime config keys: `protocol`, `useAuth`, `apiHost`,
`filebrowserHost`, `wssHost`, `gOauth2ClientId`, `minProxyPort`, `maxProxyPort`,
`openFetch.ycApi.baseURL`.

## API Client

Generated from `https://api.yukkuricraft.net/openapi/openapi.json` by
`nuxt-open-fetch`. Types are auto-generated on `nuxt dev`/`nuxt prepare`.

- **`$ycApi`** — imperative typed fetch
- **`useYcApi`** / **`useLazyYcApi`** — `useFetch`-style wrappers

Domain-specific query/mutation composables live in `app/composables/` (e.g.
`environments.ts`).

## Auth

- Google OAuth via `@nuxt/scripts` `useScriptGoogleSignIn` — client-side only,
  no server
- `app/stores/auth.ts` — Pinia store; `accessToken` backed by
  `useSessionStorage`
- `app/middleware/auth.global.ts` — global middleware, skips `/login`, respects
  `useAuth=false` for local dev
- `app/components/GoogleSignInButton.vue` — renders the GSI button; calls
  `auth.login(credential)` on success
- `app/pages/login.vue` — full login page; shows bypass button when
  `useAuth=false`

## Notifications

`useNotificationStore()` — add toasts from anywhere:

```ts
const notifications = useNotificationStore()
notifications.notify('Message') // info, 4s
notifications.add({ message: '...', type: 'success', duration: 3000 })
notifications.add({
  message: '...',
  type: 'warning',
  duration: 0, // stays until dismissed
  action: { label: 'Undo', fn: doThing },
})
```

`NotificationSnackbar` is mounted globally in `app/app.vue`.

## Components

```vue
<template>
  <span class="icon"><FontAwesomeIcon :icon="faTrash" /></span>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
</script>
```

## Style conventions

Template over scripts in Vue SFC files

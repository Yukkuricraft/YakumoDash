// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-03-28',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@pinia/nuxt', '@nuxt/scripts', 'nuxt-open-fetch'],

  css: ['~/assets/css/main.scss', '@fortawesome/fontawesome-svg-core/styles.css', 'floating-vue/dist/style.css'],

  ssr: false,

  imports: {
    scan: false,
  },
  components: {
    dirs: [],
  },

  runtimeConfig: {
    public: {
      // Dev defaults — override per environment via .env.local files
      // Env var naming: NUXT_PUBLIC_<SCREAMING_SNAKE_CASE>
      protocol: 'https',
      useAuth: true,
      apiHost: 'dev.api.yukkuricraft.net',
      filebrowserHost: 'dev.files.yakumo.yukkuricraft.net',
      wssHost: 'dev.docker.yukkuricraft.net',
      gOauth2ClientId: '1084736521175-2b5rrrpcs422qdc5458dhisdsj8auo0p.apps.googleusercontent.com',
      minProxyPort: 26600,
      maxProxyPort: 26700,
    },
  },

  openFetch: {
    clients: {
      ycApi: {
        schema: 'https://api.yukkuricraft.net/openapi/openapi.json',
        baseURL: 'https://dev.api.yukkuricraft.net',
      },
    },
  },

  vite: {
    server: {
      allowedHosts: process.env.NUXT_DEV_ALLOWED_HOSTS?.split(',') ?? [],
    },
  },
})

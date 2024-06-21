// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxthub/core',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],

  hub: {
    blob: true,
  },

  ui: {
    icons: ['simple-icons'],
  },

  experimental: {
    viewTransition: true,
  },

  devtools: { enabled: true },

  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        semi: true,
      },
    },
  },
});

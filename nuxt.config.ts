import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Design Tokens Showcase - Figma MCP',
      meta: [
        { name: 'description', content: 'Figma Tokens Studio + GitHub Actions + Style Dictionary + Tailwind CSS v4 통합 테스트' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
          rel: 'stylesheet'
        }
      ]
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/design-tokens.css',
    '~/assets/css/theme-tokens.css',
  ],

  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET,
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3001/api',
      appName: 'Design Tokens Showcase'
    }
  }
})
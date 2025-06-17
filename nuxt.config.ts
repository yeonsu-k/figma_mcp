import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  
  // GitHub Pages 배포를 위한 설정
  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },

  
  // GitHub Pages의 baseURL 설정 (레포지토리 이름)
  app: {
    baseURL: '/figma_mcp/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Design Tokens Showcase - Figma MCP',
      meta: [
        { name: 'description', content: 'Figma Tokens Studio + GitHub Actions + Style Dictionary + Tailwind CSS v4 통합 테스트' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/figma_mcp/favicon.ico' },
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
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET,
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE || 'https://yeonsu-k.github.io/figma_mcp/api',
      appName: 'Design Tokens Showcase'
    }
  }
})
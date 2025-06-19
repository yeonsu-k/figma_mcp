import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  
  // Tailwind CSS v4 필수 설정
  vite: {
    plugins: [tailwindcss()],
  },
  
  // GitHub Pages 배포를 위한 설정
  nitro: {
    prerender: {
      routes: ['/'],
      // 정적 파일들을 포함하도록 설정
      crawlLinks: true
    },
    // SPA 모드를 위한 설정 (404 페이지 처리)
    routeRules: {
      '/': { prerender: true },
      '/**': { ssr: false }
    }
  },
  
  // SPA 모드 설정 (GitHub Pages에서 동적 라우팅 지원)
  ssr: false,
  
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
      appName: 'Design Tokens Showcase',
      baseURL: '/figma_mcp'
    }
  }
})
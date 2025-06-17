<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Design Tokens Showcase</h1>
            <p class="text-gray-600 mt-1">Figma Tokens Studio + Style Dictionary 통합 테스트</p>
          </div>
          <!-- <div class="flex items-center gap-4">
            <button @click="toggleDarkMode" class="btn-outline flex items-center">
              <SunIcon v-if="isDarkMode" class="w-4 h-4 mr-2" />
              <MoonIcon v-else class="w-4 h-4 mr-2" />
              {{ isDarkMode ? '라이트 모드' : '다크 모드' }}
            </button>
          </div> -->
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Status Section -->
      <section class="mb-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-xl font-semibold mb-4">🔄 연동 상태</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircleIcon class="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p class="font-medium text-green-900">Figma Tokens Studio</p>
                  <p class="text-sm text-green-700">연결됨</p>
                </div>
              </div>
              <div class="flex items-center p-4 bg-blue-50 rounded-lg">
                <CodeBracketIcon class="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p class="font-medium text-blue-900">Style Dictionary</p>
                  <p class="text-sm text-blue-700">빌드 완료</p>
                </div>
              </div>
              <div class="flex items-center p-4 bg-purple-50 rounded-lg">
                <SwatchIcon class="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p class="font-medium text-purple-900">Tailwind CSS v4</p>
                  <p class="text-sm text-purple-700">활성화됨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Colors Section -->
      <section class="mb-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold mb-6">🎨 Color Tokens</h2>
            
            <!-- Primary Colors -->
            <div class="mb-6">
              <h3 class="text-lg font-medium mb-3">Primary Colors</h3>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div v-for="shade in [50, 100, 500, 600, 900]" :key="shade" 
                     class="text-center">
                  <div 
                    :class="`w-full h-20 rounded-lg mb-2 shadow-sm`"
                    :style="{ backgroundColor: `var(--colors-primary-${shade})` }"
                  ></div>
                  <p class="text-sm font-medium">primary-{{ shade }}</p>
                  <p class="text-xs text-gray-500 font-mono">{{ getTokenValue(`colors-primary-${shade}`) }}</p>
                </div>
              </div>
            </div>

            <!-- Gray Colors -->
            <div class="mb-6">
              <h3 class="text-lg font-medium mb-3">Gray Colors</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="shade in [50, 100, 500, 900]" :key="shade" 
                     class="text-center">
                  <div 
                    :class="`w-full h-20 rounded-lg mb-2 shadow-sm`"
                    :style="{ backgroundColor: `var(--colors-gray-${shade})` }"
                  ></div>
                  <p class="text-sm font-medium">gray-{{ shade }}</p>
                  <p class="text-xs text-gray-500 font-mono">{{ getTokenValue(`colors-gray-${shade}`) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Spacing Section -->
      <section class="mb-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold mb-6">📏 Spacing Tokens</h2>
            <div class="space-y-4">
              <div v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" 
                   class="flex items-center">
                <div class="w-20 text-sm font-medium">{{ size }}</div>
                <div 
                  class="bg-blue-200 h-8 rounded"
                  :style="{ width: `var(--spacing-${size})` }"
                ></div>
                <div class="ml-4 text-sm text-gray-600 font-mono">
                  {{ getTokenValue(`spacing-${size}`) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Typography Section -->
      <section class="mb-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold mb-6">📝 Typography Showcase</h2>
            <div class="space-y-6">
              <div>
                <h1 class="text-4xl font-bold text-primary-600 mb-2">
                  Heading 1 - Design System
                </h1>
                <p class="text-gray-600">primary-600 색상을 사용한 대제목</p>
              </div>
              
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-2">
                  Heading 2 - Section Title
                </h2>
                <p class="text-gray-600">섹션 제목용 스타일</p>
              </div>

              <div>
                <p class="text-base text-gray-800 leading-relaxed">
                  본문 텍스트입니다. 이 텍스트는 기본 색상과 간격을 사용하여 
                  디자인 토큰이 올바르게 적용되는지 확인할 수 있습니다.
                </p>
              </div>

              <div>
                <p class="text-sm text-gray-500">
                  작은 텍스트와 보조 정보를 위한 스타일입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Token Information -->
      <section class="mb-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold mb-6">ℹ️ 토큰 정보</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-medium mb-3">파일 위치</h3>
                <ul class="space-y-2 text-sm">
                  <li><code class="bg-gray-100 px-2 py-1 rounded">tokens/global.json</code> - 원본 토큰</li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">assets/css/design-tokens.css</code> - CSS 변수</li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">assets/css/theme-tokens.css</code> - Tailwind 테마</li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">composables/useDesignTokens.ts</code> - TS 타입</li>
                </ul>
              </div>
              <div>
                <h3 class="font-medium mb-3">워크플로우</h3>
                <ul class="space-y-2 text-sm">
                  <li>1. Figma에서 토큰 수정</li>
                  <li>2. Tokens Studio로 GitHub 푸시</li>
                  <li>3. GitHub Actions 자동 실행</li>
                  <li>4. Style Dictionary 빌드</li>
                  <li>5. 웹사이트 자동 업데이트</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center text-gray-500 text-sm">
          <p>Figma Tokens Studio + GitHub Actions + Style Dictionary + Tailwind CSS v4</p>
          <p class="mt-1">마지막 업데이트: {{ lastUpdated }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { 
  ArrowPathIcon, 
  SunIcon, 
  MoonIcon, 
  CheckCircleIcon, 
  CodeBracketIcon, 
  SwatchIcon 
} from '@heroicons/vue/24/outline'

// Reactive data
const isDarkMode = ref(false)
const lastUpdated = ref(new Date().toLocaleString('ko-KR'))
const tokens = ref({})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

const getTokenValue = (tokenName) => {
  // CSS 변수 값 가져오기
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${tokenName}`)
      .trim()
    return value || 'undefined'
  }
  return 'undefined'
}

// Lifecycle
onMounted(() => {
  // 다크 모드 초기 설정
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

// Head metadata
useHead({
  title: 'Design Tokens Showcase - Figma MCP',
  meta: [
    { name: 'description', content: 'Figma Tokens Studio와 Style Dictionary 통합 테스트 페이지' }
  ]
})
</script>

<style scoped>
/* 컴포넌트별 스타일은 main.css의 전역 클래스 사용 */
</style>
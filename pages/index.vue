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
            
            <!-- Dynamic Color Groups -->
            <div v-for="(colorGroup, groupName) in colorTokens" :key="groupName" class="mb-8">
              <h3 class="text-lg font-medium mb-4 capitalize">{{ formatColorGroupName(groupName) }}</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="(colorData, shadeName) in colorGroup" :key="shadeName" 
                     class="text-center">
                  <div 
                    class="w-full h-20 rounded-lg mb-2 shadow-sm border"
                    :style="{ backgroundColor: colorData.value }"
                  ></div>
                  <p class="text-sm font-medium">{{ groupName }}-{{ shadeName }}</p>
                  <p class="text-xs text-gray-500 font-mono">{{ colorData.value }}</p>
                </div>
              </div>
            </div>

            <!-- Fallback for empty tokens -->
            <div v-if="Object.keys(colorTokens).length === 0" class="text-center py-8">
              <p class="text-gray-500">
                색상 토큰을 로드할 수 없습니다. 
                <code class="bg-gray-100 px-2 py-1 rounded text-sm">npm run tokens:build</code>를 실행해주세요.
              </p>
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
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-semibold">ℹ️ 토큰 정보</h2>
              <button 
                @click="refreshTokens" 
                :disabled="isRefreshing"
                class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowPathIcon 
                  :class="['w-4 h-4 mr-2', { 'animate-spin': isRefreshing }]" 
                />
                {{ isRefreshing ? '새로고침 중...' : '토큰 새로고침' }}
              </button>
            </div>
            
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
                <h3 class="font-medium mb-3">현재 상태</h3>
                <ul class="space-y-2 text-sm">
                  <li>색상 그룹: <span class="font-mono bg-blue-50 px-2 py-1 rounded">{{ Object.keys(colorTokens).length }}개</span></li>
                  <li>총 색상: <span class="font-mono bg-green-50 px-2 py-1 rounded">{{ getTotalColorsCount() }}개</span></li>
                  <li>마지막 새로고침: <span class="font-mono bg-gray-50 px-2 py-1 rounded">{{ lastUpdated }}</span></li>
                  <li>자동 감지: <span class="text-green-600 font-medium">활성화됨</span></li>
                </ul>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t">
              <h3 class="font-medium mb-3">워크플로우</h3>
              <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                  <p class="text-xs font-medium">Figma에서 토큰 수정</p>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                  <p class="text-xs font-medium">Tokens Studio 푸시</p>
                </div>
                <div class="text-center p-3 bg-purple-50 rounded-lg">
                  <div class="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                  <p class="text-xs font-medium">GitHub Actions 실행</p>
                </div>
                <div class="text-center p-3 bg-orange-50 rounded-lg">
                  <div class="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                  <p class="text-xs font-medium">Style Dictionary 빌드</p>
                </div>
                <div class="text-center p-3 bg-indigo-50 rounded-lg">
                  <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">5</div>
                  <p class="text-xs font-medium">웹사이트 자동 업데이트</p>
                </div>
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
const colorTokens = ref({})
const isRefreshing = ref(false)

/**
 * 색상 토큰을 동적로 로드하는 함수
 * @returns {Promise<void>}
 */
const loadColorTokens = async () => {
  try {
    // API에서 토큰 정보 가져오기
    const response = await $fetch('/api/tokens', { 
      method: 'GET'
    })

    // API 응답에서 색상 토큰 추출
    if (response.success && response.data && response.data.colors) {
      colorTokens.value = response.data.colors
      console.log('색상 토큰 로드 완료:', Object.keys(colorTokens.value).length, '개 그룹')
    }
  } catch (error) {
    console.warn('색상 토큰 로드 실패, 기본값 사용:', error)
    
    // API 실패 시 로컬 파일에서 직접 로드 시도
    try {
      const response = await fetch('/tokens/global.json')
      const tokens = await response.json()
      
      if (tokens && tokens.colors) {
        // 색상 토큰만 필터링
        const filteredColors = {}
        for (const [groupName, group] of Object.entries(tokens.colors)) {
          if (typeof group === 'object' && group !== null) {
            filteredColors[groupName] = {}
            
            for (const [shadeName, shade] of Object.entries(group)) {
              if (shade && typeof shade === 'object' && shade.type === 'color') {
                filteredColors[groupName][shadeName] = {
                  value: shade.value,
                  type: shade.type
                }
              }
            }
          }
        }
        
        colorTokens.value = filteredColors
        console.log('로컬 파일에서 색상 토큰 로드 완료')
      }
    } catch (localError) {
      console.warn('로컬 파일 로드도 실패, 기본 색상 사용:', localError)
      
      // 모든 방법이 실패하면 기본 색상 토큰 설정
      colorTokens.value = {
        primary: {
          '50': { value: '#eff6ff', type: 'color' },
          '100': { value: '#dbeafe', type: 'color' },
          '500': { value: '#3b82f6', type: 'color' },
          '600': { value: '#2563eb', type: 'color' },
          '900': { value: '#1e3a8a', type: 'color' }
        },
        gray: {
          '50': { value: '#f9fafb', type: 'color' },
          '100': { value: '#f3f4f6', type: 'color' },
          '500': { value: '#6b7280', type: 'color' },
          '900': { value: '#111827', type: 'color' }
        }
      }
    }
  }
}

/**
 * 색상 그룹명을 사용자 친화적으로 포맷팅
 * @param {string} groupName - 원본 그룹명
 * @returns {string} 포맷된 그룹명
 */
const formatColorGroupName = (groupName) => {
  return groupName
    .replace(/([A-Z])/g, ' $1') // camelCase를 띄어쓰기로 변환
    .replace(/^./, str => str.toUpperCase()) // 첫 글자 대문자
    .trim()
}

/**
 * 전체 색상 개수를 계산하는 함수
 * @returns {number} 총 색상 개수
 */
const getTotalColorsCount = () => {
  return Object.values(colorTokens.value).reduce(
    (total, group) => total + Object.keys(group).length, 
    0
  )
}

/**
 * 토큰을 새로고침하는 함수
 * @returns {Promise<void>}
 */
const refreshTokens = async () => {
  isRefreshing.value = true
  try {
    await loadColorTokens()
    lastUpdated.value = new Date().toLocaleString('ko-KR')
    
    // 성공 알림 (선택적)
    console.log('토큰 새로고침 완료')
  } catch (error) {
    console.error('토큰 새로고침 실패:', error)
  } finally {
    isRefreshing.value = false
  }
}

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
onMounted(async () => {
  // 색상 토큰 로드
  await loadColorTokens()
  
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
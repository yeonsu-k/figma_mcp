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
          <div v-if="loadingError" class="text-red-500 text-sm">
            ⚠️ {{ loadingError }}
          </div>
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

      <!-- Color Palettes Section -->
      <section v-if="Object.keys(colorPalettes).length > 0" class="mb-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold mb-6">🎨 Color Palettes</h2>
            
            <!-- Dynamic Color Palettes -->
            <div v-for="(colorGroup, groupName) in colorPalettes" :key="groupName" class="mb-8">
              <h3 class="text-lg font-medium mb-4">{{ formatColorGroupName(groupName) }}</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2">
                <div v-for="(colorData, shadeName) in colorGroup" :key="shadeName" 
                     class="text-center">
                  <div 
                    class="w-full h-16 md:h-20 rounded-lg mb-2 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    :style="{ backgroundColor: colorData.value }"
                    :title="`${groupName}-${shadeName}: ${colorData.value}`"
                    @click="copyToClipboard(colorData.value)"
                  ></div>
                  <p class="text-xs font-medium text-gray-700">{{ shadeName }}</p>
                  <p class="text-xs text-gray-500 font-mono">{{ colorData.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Single Colors Section -->
      <section v-if="Object.keys(singleColors).length > 0" class="mb-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold mb-6">🎯 Single Colors</h2>
            
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div v-for="(colorData, colorName) in singleColors" :key="colorName" 
                   class="text-center">
                <div 
                  class="w-full h-20 rounded-lg mb-2 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                  :style="{ backgroundColor: colorData.value }"
                  :title="`${colorName}: ${colorData.value}`"
                  @click="copyToClipboard(colorData.value)"
                ></div>
                <p class="text-sm font-medium text-gray-700 capitalize">{{ formatColorGroupName(colorName) }}</p>
                <p class="text-xs text-gray-500 font-mono">{{ colorData.value }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Other Tokens Section -->
      <section v-if="Object.keys(otherTokens).length > 0" class="mb-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold mb-6">📋 Other Tokens</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(tokenData, tokenName) in otherTokens" :key="tokenName" 
                   class="p-4 bg-gray-50 rounded-lg border">
                <p class="text-sm font-medium text-gray-700 mb-1">{{ tokenName }}</p>
                <p class="text-xs text-gray-500 font-mono">{{ tokenData.value || JSON.stringify(tokenData) }}</p>
                <p class="text-xs text-blue-600 mt-1">{{ tokenData.type || 'unknown' }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Fallback for empty tokens -->
      <section v-if="Object.keys(colorPalettes).length === 0 && Object.keys(singleColors).length === 0" class="mb-8">
        <div class="card">
          <div class="card-body text-center py-12">
            <div class="text-gray-400 mb-4">
              <SwatchIcon class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">토큰을 로드할 수 없습니다</h3>
            <p class="text-gray-500 mb-4">
              디자인 토큰을 빌드하거나 새로고침해주세요.
            </p>
            <div class="space-y-2 text-sm text-gray-600">
              <p><code class="bg-gray-100 px-2 py-1 rounded">npm run tokens:build</code></p>
              <p>또는 아래 새로고침 버튼을 클릭하세요.</p>
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
                  <li>색상 팔레트: <span class="font-mono bg-blue-50 px-2 py-1 rounded">{{ Object.keys(colorPalettes).length }}개</span></li>
                  <li>단일 색상: <span class="font-mono bg-green-50 px-2 py-1 rounded">{{ Object.keys(singleColors).length }}개</span></li>
                  <li>총 색상: <span class="font-mono bg-purple-50 px-2 py-1 rounded">{{ getTotalColorsCount() }}개</span></li>
                  <li>기타 토큰: <span class="font-mono bg-orange-50 px-2 py-1 rounded">{{ Object.keys(otherTokens).length }}개</span></li>
                  <li>마지막 새로고침: <span class="font-mono bg-gray-50 px-2 py-1 rounded">{{ lastUpdated }}</span></li>
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

    <!-- Toast notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity"
      :class="{ 'opacity-0': !showToast }"
    >
      색상이 클립보드에 복사되었습니다!
    </div>
  </div>
</template>

<script setup>
import { 
  ArrowPathIcon, 
  CheckCircleIcon, 
  CodeBracketIcon, 
  SwatchIcon 
} from '@heroicons/vue/24/outline'

// Reactive data
const lastUpdated = ref(new Date().toLocaleString('ko-KR'))
const colorPalettes = ref({})
const singleColors = ref({})
const otherTokens = ref({})
const statistics = ref({})
const isRefreshing = ref(false)
const loadingError = ref('')
const showToast = ref(false)

/**
 * 토큰을 동적으로 로드하는 함수
 * @returns {Promise<void>}
 */
const loadTokens = async () => {
  try {
    loadingError.value = ''
    
    // API에서 토큰 정보 가져오기
    const response = await $fetch('/api/tokens', { 
      method: 'GET'
    })

    if (response.success && response.data) {
      // 색상 팔레트
      const { single, ...palettes } = response.data.colors
      colorPalettes.value = palettes
      
      // 단일 색상
      singleColors.value = single || {}
      
      // 기타 토큰들
      otherTokens.value = response.data.other || {}
      
      // 통계
      statistics.value = response.data.statistics || {}
      
      console.log('토큰 로드 완료:', {
        팔레트: Object.keys(colorPalettes.value).length,
        단일색상: Object.keys(singleColors.value).length,
        기타: Object.keys(otherTokens.value).length
      })
    } else {
      throw new Error(response.error?.message || '응답 형식이 올바르지 않습니다')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
    loadingError.value = errorMessage
    console.error('토큰 로드 실패:', errorMessage)
    
    // 기본값 설정
    colorPalettes.value = {
      slate: {
        '50': { value: '#f8fafc', type: 'color' },
        '500': { value: '#64748b', type: 'color' },
        '900': { value: '#0f172a', type: 'color' }
      }
    }
    singleColors.value = {
      black: { value: '#000000', type: 'color' },
      white: { value: '#ffffff', type: 'color' }
    }
    otherTokens.value = {}
    statistics.value = {}
  }
}

/**
 * 색상 그룹명을 사용자 친화적으로 포맷팅
 * @param {string} groupName - 원본 그룹명
 * @returns {string} 포맷된 그룹명
 */
const formatColorGroupName = (groupName) => {
  // 특별한 이름들 매핑
  const nameMap = {
    'slate': 'Slate Gray',
    'sky': 'Sky Blue',
    'primary': 'Primary',
    'secondary': 'Secondary',
    'black': 'Black',
    'white': 'White'
  }
  
  return nameMap[groupName.toLowerCase()] || groupName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * 전체 색상 개수를 계산하는 함수
 * @returns {number} 총 색상 개수
 */
const getTotalColorsCount = () => {
  const paletteCount = Object.values(colorPalettes.value).reduce(
    (total, group) => total + Object.keys(group).length, 
    0
  )
  const singleCount = Object.keys(singleColors.value).length
  return paletteCount + singleCount
}

/**
 * 토큰을 새로고침하는 함수
 * @returns {Promise<void>}
 */
const refreshTokens = async () => {
  isRefreshing.value = true
  try {
    await loadTokens()
    lastUpdated.value = new Date().toLocaleString('ko-KR')
    
    console.log('토큰 새로고침 완료')
  } catch (error) {
    console.error('토큰 새로고침 실패:', error)
  } finally {
    isRefreshing.value = false
  }
}

/**
 * 클립보드에 색상 복사
 * @param {string} colorValue - 복사할 색상값
 */
const copyToClipboard = async (colorValue) => {
  try {
    await navigator.clipboard.writeText(colorValue)
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  } catch (error) {
    console.error('클립보드 복사 실패:', error)
  }
}

// Lifecycle
onMounted(async () => {
  // 토큰 로드
  await loadTokens()
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

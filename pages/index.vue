<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center py-6 sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Design Tokens Showcase</h1>
            <p class="text-slate-600 mt-1">Figma Tokens Studio + Style Dictionary 통합 테스트</p>
          </div>
          <div v-if="loadingError" class="text-red-500 text-sm">
            ⚠️ {{ loadingError }}
          </div>
          <div v-else class="text-green-700 text-sm flex items-center gap-2">
            <CheckCircleIcon class="size-5 text-green-600" /> Figma Tokens Studio 연결됨
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
      <!-- Token Status & Information Combined -->
      <section>
        <div class="card">
          <div class="card-body">
            <!-- Always Visible Header with Refresh Controls -->
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div class="flex items-center space-x-3">
                <h2 class="text-xl font-semibold text-slate-800">🎯 토큰 관리</h2>
                <span class="text-sm text-slate-600">
                  마지막 새로고침: <span class="font-mono bg-gray-50 px-2 py-1 rounded">{{ lastUpdated }}</span>
                </span>
              </div>
              <button 
                @click="refreshTokens" 
                :disabled="isRefreshing"
                class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowPathIcon 
                  :class="['w-4 h-4 mr-2 stroke-2', { 'animate-spin': isRefreshing }]" 
                />
                {{ isRefreshing ? '새로고침 중...' : '토큰 새로고침' }}
              </button>
            </div>

            <!-- Token Summary (Always Visible) -->
            <div class="flex items-center space-x-2 text-sm text-slate-600 mb-4">
              <span class="bg-blue-50 px-2 py-1 rounded font-mono">{{ getTotalColorsCount() }}개 색상</span>
              <span class="bg-green-50 px-2 py-1 rounded font-mono">{{ getSpacingTokens().length }}개 간격</span>
              <span class="bg-purple-50 px-2 py-1 rounded font-mono">{{ getTypographyTokens().length + getFontTokens().length }}개 타이포그래피</span>
              <span class="bg-orange-50 px-2 py-1 rounded font-mono">{{ getAssetTokens().length + getBorderTokens().length + getOtherNonVisualTokens().length }}개 기타</span>
            </div>

            <!-- Token Information Accordion -->
            <div>
              <!-- Accordion Header -->
              <div 
                class="cursor-pointer select-none border border-slate-200/80 p-4 transition-colors shaodw-sm"
                :class="{ 'rounded-lg': !isTokenInfoExpanded, 'rounded-t-lg': isTokenInfoExpanded, }"
                @click="isTokenInfoExpanded = !isTokenInfoExpanded"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-lg font-medium text-slate-700">ℹ️ 상세 정보</h3>
                    <span class="text-xs text-slate-500 leading-none">파일 위치, 통계, 워크플로우</span>
                  </div>
                  <div class="transition-transform duration-200" :class="{ 'rotate-180': isTokenInfoExpanded }">
                    <ChevronDownIcon class="size-4 text-slate-800" />
                  </div>
                </div>
              </div>
              
              <!-- Accordion Content -->
              <div 
                class="overflow-hidden transition-all duration-300 ease-in-out px-4 border border-slate-200/80 rounded-b-lg border-t-0"
                :class="isTokenInfoExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'"
              >
                <div class="py-4 mt-2">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-medium mb-3 text-slate-700">파일 위치</h4>
                      <ul class="space-y-2 text-sm">
                        <li><code class="bg-slate-100 px-2 py-1 rounded">tokens/global.json</code> - 원본 토큰</li>
                        <li><code class="bg-slate-100 px-2 py-1 rounded">assets/css/theme-tokens.css</code> - TailwindCSS v4 테마</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium mb-3 text-slate-700">상세 통계</h4>
                      <ul class="space-y-2 text-sm grid grid-cols-1 md:grid-cols-2">
                        <li>색상 그룹: <span class="font-mono bg-blue-50 px-2 py-1 rounded">{{ Object.keys(colorPalettes).length }}개</span></li>
                        <li>단일 색상: <span class="font-mono bg-green-50 px-2 py-1 rounded">{{ Object.keys(singleColors).length }}개</span></li>
                        <li>간격 토큰: <span class="font-mono bg-yellow-50 px-2 py-1 rounded">{{ getSpacingTokens().length }}개</span></li>
                        <li>폰트 토큰: <span class="font-mono bg-violet-50 px-2 py-1 rounded">{{ getFontTokens().length }}개</span></li>
                        <li>에셋 토큰: <span class="font-mono bg-emerald-50 px-2 py-1 rounded">{{ getAssetTokens().length }}개</span></li>
                        <li>테두리 토큰: <span class="font-mono bg-orange-50 px-2 py-1 rounded">{{ getBorderTokens().length }}개</span></li>
                        <li>타이포그래피: <span class="font-mono bg-indigo-50 px-2 py-1 rounded">{{ getTypographyTokens().length }}개</span></li>
                        <li>기타 토큰: <span class="font-mono bg-slate-50 px-2 py-1 rounded">{{ getOtherNonVisualTokens().length }}개</span></li>
                      </ul>
                    </div>
                  </div>

                  <div class="mt-3 pt-3 border-t border-slate-100">
                    <h4 class="font-medium mb-3 text-slate-700">워크플로우</h4>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div class="text-center p-3 bg-blue-50 rounded-lg">
                        <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                        <p class="text-xs font-medium">Figma에서 토큰 수정</p>
                      </div>
                      <div class="text-center p-3 bg-green-50 rounded-lg">
                        <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                        <p class="text-xs font-medium">Tokens Studio 푸시</p>
                      </div>
                      <div class="text-center p-3 bg-purple-50 rounded-lg">
                        <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                        <p class="text-xs font-medium">GitHub Actions 실행</p>
                      </div>
                      <div class="text-center p-3 bg-orange-50 rounded-lg">
                        <div class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                        <p class="text-xs font-medium">Style Dictionary 빌드</p>
                      </div>
                      <div class="text-center p-3 bg-indigo-50 rounded-lg">
                        <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">5</div>
                        <p class="text-xs font-medium">웹사이트 자동 업데이트</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Token Categories & Content Combined -->
      <section>
        <div class="card">
          <div class="card-body">
            <!-- Categories Header -->
            <div class="mb-8">
              <h2 class="text-2xl font-semibold mb-6">🎯 Design Tokens</h2>
              <div class="flex flex-wrap gap-3 mb-6">
                <button 
                  v-for="keyword in availableKeywords"
                  :key="keyword.id"
                  @click="activeCategory = keyword.id"
                  :class="[
                    'category-tab px-4 py-2 rounded-full border-2 font-medium transition-all duration-200 gap-2',
                    activeCategory === keyword.id 
                      ? 'bg-blue-500/90 text-white border-blue-500/90 shadow-lg' 
                      : 'bg-white text-slate-700 border-slate-300 hover:border-blue-300 hover:bg-blue-50'
                  ]"
                >
                  <span>{{ keyword.icon }}</span> {{ keyword.label }}
                  <span class="text-xs opacity-75">({{ keyword.count }})</span>
                </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="min-h-[400px] transition-all duration-300 ease-in-out">
              <!-- Colors Content -->
              <div v-if="activeCategory === 'colors' && (Object.keys(colorPalettes).length > 0 || Object.keys(singleColors).length > 0)" 
                   class="animate-fade-in">
                <div class="flex items-center mb-6">
                  <span class="text-3xl mr-3">🎨</span>
                  <h3 class="text-xl font-semibold text-slate-800">Color Palettes</h3>
                </div>
                
                <!-- Single Colors (단일 색상을 먼저 표시) -->
                <div v-if="Object.keys(singleColors).length > 0" class="mb-8">
                  <h4 class="text-lg font-medium mb-4">Single Colors</h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2">
                    <div v-for="(colorData, colorName) in singleColors" :key="`single-${colorName}`" class="text-center">
                      <div 
                        class="w-full h-16 md:h-20 rounded-lg mb-2 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                        :style="getSingleColorStyle(colorName)"
                        :title="`${colorName}: ${colorData.value}`"
                        @click="copyToClipboard(colorData.value)"
                      />
                      <p class="text-xs font-medium text-slate-700 capitalize">{{ formatColorGroupName(colorName) }}</p>
                      <p class="text-xs font-medium text-slate-700">bg-{{ colorName.toLowerCase() }}</p>
                      <p class="text-xs text-slate-500 font-mono">{{ colorData.value }}</p>
                    </div>
                  </div>
                </div>

                <!-- Dynamic Color Palettes (색상 팔레트) -->
                <div v-for="(colorGroup, groupName) in colorPalettes" :key="`palette-${groupName}`" class="mb-8">
                  <h4 class="text-lg font-medium mb-4">{{ formatColorGroupName(groupName) }}</h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2">
                    <div v-for="(colorData, shadeName) in colorGroup" :key="`${groupName}-${shadeName}`" class="text-center">
                      <div 
                        class="w-full h-16 md:h-20 rounded-lg mb-2 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                        :style="getColorStyle(groupName, shadeName)"
                        :title="`${groupName}-${shadeName}: ${colorData.value}`"
                        @click="copyToClipboard(colorData.value)"
                      />
                      <p class="text-xs font-medium text-slate-700">{{ shadeName }}</p>
                      <p class="text-xs font-medium text-slate-700">bg-{{ groupName.toLowerCase() }}-{{ shadeName }}</p>
                      <p class="text-xs text-slate-500 font-mono">{{ colorData.value }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Spacing Content -->
              <div v-if="activeCategory === 'spacing' && getSpacingTokens().length > 0" 
                   class="animate-fade-in">
                <div class="flex items-center mb-6">
                  <span class="text-3xl mr-3">📏</span>
                  <h3 class="text-xl font-semibold text-slate-800">Spacing Tokens</h3>
                </div>
                
                <!-- 박스 형태 시각화 -->
                <div class="mb-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-6">
                    <div v-for="token in getSpacingTokens()" :key="`box-${token.name}-${token.value}`" class="text-center">
                      <!-- 간격을 padding/margin으로 시각화 -->
                      <div class="flex flex-col items-center space-y-3 h-full">
                        <div class="flex-1 flex items-center justify-center">
                          <!-- 외부 박스 (margin 효과) -->
                          <div 
                            class="relative bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                            :style="{ padding: token.value }"
                            :title="`${token.name}: ${token.value}`"
                            @click="copyToClipboard(token.value)"
                          >
                            <!-- 내부 박스 (실제 spacing) -->
                            <div 
                              class="bg-blue-500 rounded-sm flex items-center justify-center size-4"       
                              :title="`${token.name}: ${token.value}`"
                            />
                          </div>
                        </div>
                        
                        <!-- 토큰 정보 -->
                        <div>
                          <p class="text-sm font-medium text-slate-700">{{ token.name }}</p>
                          <p class="text-xs font-medium text-blue-600">{{ getSpacingClass(token.name) }}</p>
                          <p class="text-xs text-slate-500 font-mono">{{ token.value }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Assets Content -->
              <div v-if="activeCategory === 'assets' && getAssetTokens().length > 0" 
                   class="animate-fade-in">
                <div class="flex items-center mb-6">
                  <span class="text-3xl mr-3">🖼️</span>
                  <h3 class="text-xl font-semibold text-slate-800">Asset Tokens</h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div v-for="token in getAssetTokens()" :key="token.name" class="p-4 border border-slate-200 rounded-lg">
                    <!-- 이미지 미리보기 -->
                    <div class="mb-4 h-32 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img 
                        :src="token.value" 
                        :alt="token.name"
                        class="max-w-full max-h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                        @error="handleImageError"
                        @click="copyToClipboard(token.value)"
                      />
                    </div>
                    
                    <!-- 토큰 정보 -->
                    <div class="pt-3 border-t border-slate-100">
                      <p class="text-sm font-medium text-slate-700 capitalize">{{ formatAssetName(token.name) }}</p>
                      <p class="text-xs font-medium text-green-600">img-{{ token.name.toLowerCase() }}</p>
                      <p class="text-xs text-slate-500 font-mono truncate" :title="token.value">{{ token.value }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Borders Content -->
              <div v-if="activeCategory === 'borders' && getBorderTokens().length > 0" 
                   class="animate-fade-in">
                <div class="flex items-center mb-6">
                  <span class="text-3xl mr-3">🔲</span>
                  <h3 class="text-xl font-semibold text-slate-800">Border Tokens</h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div v-for="token in getBorderTokens()" :key="token.name" class="p-4 border border-slate-200 rounded-lg">
                    <!-- 테두리 미리보기 -->
                    <div class="mb-4 h-20 bg-slate-50 rounded-lg flex items-center justify-center">
                      <div 
                        class="w-16 h-12 bg-white rounded cursor-pointer hover:scale-105 transition-transform"
                        :style="getBorderStyle(token)"
                        :title="`${token.name}: ${JSON.stringify(token.value)}`"
                        @click="copyToClipboard(JSON.stringify(token.value))"
                      />
                    </div>
                    
                    <!-- 토큰 정보 -->
                    <div class="pt-3 border-t border-slate-100">
                      <p class="text-sm font-medium text-slate-700 capitalize">{{ formatBorderName(token.name) }}</p>
                      <p class="text-xs font-medium text-orange-600">border-{{ token.name.toLowerCase() }}</p>
                      <p class="text-xs text-slate-500 font-mono">{{ formatBorderValue(token.value) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Typography Content -->
              <div v-if="activeCategory === 'typography' && (getTypographyTokens().length > 0 || getFontTokens().length > 0)" 
                   class="animate-fade-in">
                <div class="flex items-center mb-6">
                  <span class="text-3xl mr-3">✏️</span>
                  <h3 class="text-xl font-semibold text-slate-800">Typography Tokens</h3>
                </div>
                
                <!-- Typography Styles -->
                <div v-if="getTypographyTokens().length > 0" class="mb-8">
                  <h4 class="text-lg font-medium mb-4">Typography Styles</h4>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="token in getTypographyTokens()" :key="token.name" class="p-4 border border-slate-200 rounded-lg">
                      <!-- 타이포그래피 미리보기 -->
                      <div 
                        class="mb-4 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                        :style="getTypographyStyle(token)"
                        @click="copyToClipboard(JSON.stringify(token.value))"
                      >
                        <p class="mb-2">ABC abc 123</p>
                        <p class="mb-1">가나다 한글 테스트</p>
                        <p class="text-slate-600">The quick brown fox jumps over the lazy dog</p>
                      </div>
                      
                      <!-- 토큰 정보 -->
                      <div class="pt-3 border-t border-slate-100">
                        <p class="text-sm font-medium text-slate-700 capitalize">{{ formatTypographyName(token.name) }}</p>
                        <p class="text-xs font-medium text-indigo-600">text-{{ token.name.toLowerCase() }}</p>
                        <p class="text-xs text-slate-500 font-mono">{{ formatTypographyValue(token.value) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Font Families -->
                <div v-if="getFontTokens().length > 0">
                  <h4 class="text-lg font-medium mb-4">Font Families</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="p-4 border border-slate-200 rounded-lg font-mono">
                      <div class="mb-4">
                        <p class="text-2xl font-normal mb-2">ABC abc 123</p>
                        <p class="text-lg font-medium mb-1">가나다 한글 테스트</p>
                        <p class="text-sm text-slate-600">The quick brown fox jumps</p>
                      </div>
                      <div class="pt-3 border-t border-slate-100">
                        <p class="text-sm font-medium text-slate-700 capitalize">Space Mono</p>
                        <p class="text-xs font-medium text-violet-600">font-mono</p>
                        <p class="text-xs text-slate-500 font-mono">Space Mono Variable</p>
                      </div>
                    </div>

                    <div v-for="token in getFontTokens()" :key="token.name" class="p-4 border border-slate-200 rounded-lg">
                      <!-- 폰트 미리보기 -->
                      <div 
                        class="mb-4 cursor-pointer hover:bg-slate-50 transition-colors p-2 rounded"
                        :style="{ fontFamily: token.value }"
                        @click="copyToClipboard(token.value)"
                      >
                        <p class="text-2xl font-normal mb-2">ABC abc 123</p>
                        <p class="text-lg font-medium mb-1">가나다 한글 테스트</p>
                        <p class="text-sm text-slate-600">The quick brown fox jumps</p>
                      </div>
                      
                      <!-- 토큰 정보 -->
                      <div class="pt-3 border-t border-slate-100">
                        <p class="text-sm font-medium text-slate-700 capitalize">{{ formatFontName(token.name) }}</p>
                        <p class="text-xs font-medium text-violet-600">{{ getFontClass(token.name) }}</p>
                        <p class="text-xs text-slate-500 font-mono">{{ token.value }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Other Tokens Content -->
              <div v-if="activeCategory === 'other' && getOtherNonVisualTokens().length > 0" 
                   class="animate-fade-in">
                <div class="flex items-center mb-6">
                  <span class="text-3xl mr-3">📋</span>
                  <h3 class="text-xl font-semibold text-slate-800">Other Properties</h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="token in getOtherNonVisualTokens()" :key="token.name" 
                       class="p-4 bg-slate-50 rounded-lg border cursor-pointer hover:bg-slate-100 transition-colors"
                       @click="copyToClipboard(token.value)">
                    <p class="text-sm font-medium text-slate-700 mb-1">{{ token.name }}</p>
                    <p class="text-xs text-slate-500 font-mono wrap-anywhere">{{ token.value }}</p>
                    <p class="text-xs text-blue-600 mt-1">{{ token.type }}</p>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="availableKeywords.length === 0" class="text-center py-12">
                <div class="text-slate-400 mb-4">
                  <SwatchIcon class="w-16 h-16 mx-auto" />
                </div>
                <h3 class="text-lg font-medium text-slate-700 mb-2">토큰을 로드할 수 없습니다</h3>
                <p class="text-slate-500 mb-4">
                  디자인 토큰을 빌드하거나 새로고침해주세요.
                </p>
                <div class="space-y-2 text-sm text-slate-600">
                  <p><code class="bg-slate-100 px-2 py-1 rounded">npm run tokens:build</code></p>
                  <p>또는 아래 새로고침 버튼을 클릭하세요.</p>
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
        <div class="text-center text-slate-500 text-sm">
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
      값이 클립보드에 복사되었습니다!
    </div>
  </div>
</template>

<script setup>
import {ArrowPathIcon, SwatchIcon, ChevronDownIcon} from '@heroicons/vue/24/outline'
import {CheckCircleIcon} from '@heroicons/vue/20/solid'

// Reactive data
const lastUpdated = ref(new Date().toLocaleString('ko-KR'))
const colorPalettes = ref({})
const singleColors = ref({})
const otherTokens = ref({})
const statistics = ref({})
const isRefreshing = ref(false)
const loadingError = ref('')
const showToast = ref(false)
const activeCategory = ref('colors') // 기본 활성 카테고리
const isTokenInfoExpanded = ref(false) // 토큰 정보 아코디언 상태

/**
 * 사용 가능한 키워드 목록을 계산하는 computed 속성
 * @returns {Array} 키워드 배열
 */
const availableKeywords = computed(() => {
  const keywords = [
    {
      id: 'colors',
      label: 'Colors',
      icon: '🎨',
      count: getTotalColorsCount()
    },
    {
      id: 'spacing',
      label: 'Spacing',
      icon: '📏',
      count: getSpacingTokens().length
    },
    {
      id: 'typography',
      label: 'Typography',
      icon: '✏️',
      count: getTypographyTokens().length + getFontTokens().length
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: '🖼️',
      count: getAssetTokens().length
    },
    {
      id: 'borders',
      label: 'Borders',
      icon: '🔲',
      count: getBorderTokens().length
    },
    {
      id: 'other',
      label: 'Other',
      icon: '📋',
      count: getOtherNonVisualTokens().length
    }
  ]
  
  // 토큰이 있는 카테고리만 필터링
  return keywords.filter(keyword => keyword.count > 0)
})

/**
 * 토큰을 동적으로 로드하는 함수
 * GitHub Pages 호환성을 위해 정적 JSON 파일 사용
 * @returns {Promise<void>}
 */
const loadTokens = async () => {
  try {
    loadingError.value = ''
    
    // 우선 API 엔드포인트 시도 (로컬 개발용)
    let response
    try {
      response = await $fetch('/api/tokens', { method: 'GET' })
      console.log('📡 API 엔드포인트에서 토큰 로드 성공')
    } catch (apiError) {
      console.log('📄 API 엔드포인트 실패, 정적 파일 사용 중...')
      
    // API 실패 시 정적 JSON 파일 사용 (GitHub Pages용)
      const { $config } = useNuxtApp()
      const baseURL = $config.public.baseURL || '/figma_mcp'
      const staticResponse = await fetch(`${baseURL}/api/tokens.json`)
      if (!staticResponse.ok) {
        throw new Error(`정적 파일 로드 실패: ${staticResponse.status}`)
      }
      response = await staticResponse.json()
      console.log('📄 정적 JSON 파일에서 토큰 로드 성공')
    }

    if (response.success && response.data) {
      // 색상 팔레트 (slate, sky 등)
      const { single, ...palettes } = response.data.colors
      colorPalettes.value = palettes
      
      // 단일 색상 (black, white, primary, secondary)
      singleColors.value = single || {}
      
      // 기타 토큰들
      otherTokens.value = response.data.other || {}
      
      // 통계
      statistics.value = response.data.statistics || {}
      
      console.log('🎨 토큰 로드 완료:', {
        팔레트: Object.keys(colorPalettes.value).length,
        단일색상: Object.keys(singleColors.value).length,
        기타: Object.keys(otherTokens.value).length,
        소스: response.data.statistics?.buildTime ? '정적 파일' : 'API 엔드포인트'
      })
    } else {
      throw new Error(response.error?.message || '응답 형식이 올바르지 않습니다')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
    loadingError.value = errorMessage
    console.error('🚨 토큰 로드 실패:', errorMessage)
    
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
  return groupName
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
 * CSS 커스텀 속성을 사용하여 동적 색상 스타일 생성 (팔레트용)
 * @param {string} groupName - 색상 그룹명 (예: 'slate', 'mlbb', 'primary')
 * @param {string} shadeName - 색상 단계명 (예: '50', '500', '900')
 * @returns {object} CSS 스타일 객체 또는 빈 객체
 */
const getColorStyle = (groupName, shadeName) => {
  // colorPalettes에서 해당 색상 조합이 존재하는지 확인
  if (!colorPalettes.value || !colorPalettes.value[groupName] || !colorPalettes.value[groupName][shadeName]) {
    return {}
  }
  
  // CSS 변수명 생성 (kebab-case)
  const normalizedGroup = groupName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const normalizedShade = shadeName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const cssVarName = `--color-${normalizedGroup}-${normalizedShade}`
  
  return {
    backgroundColor: `var(${cssVarName}, ${colorPalettes.value[groupName][shadeName].value})`
  }
}

/**
 * CSS 커스텀 속성을 사용하여 동적 색상 스타일 생성 (단일 색상용)
 * @param {string} colorName - 색상명 (예: 'black', 'white', 'primary', 'secondary')
 * @returns {object} CSS 스타일 객체 또는 빈 객체
 */
const getSingleColorStyle = (colorName) => {
  // singleColors에서 해당 색상이 존재하는지 확인
  if (!singleColors.value || !singleColors.value[colorName]) {
    return {}
  }
  
  // CSS 변수명 생성 (kebab-case)
  const normalizedColor = colorName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const cssVarName = `--color-${normalizedColor}`
  
  return {
    backgroundColor: `var(${cssVarName}, ${singleColors.value[colorName].value})`
  }
}

/**
 * Other Tokens를 유형별로 분류하고 시각화하는 함수들
 */

/**
 * Token Set prefix를 동적으로 제거하는 함수
 * @param {string} tokenName - 토큰 이름
 * @returns {string} prefix가 제거된 토큰 이름
 */
const removeTokenSetPrefix = (tokenName) => {
  // statistics에서 tokenSetName 가져오기
  const tokenSetName = statistics.value?.tokenSetName;
  if (tokenSetName && tokenName.startsWith(`${tokenSetName}.`)) {
    return tokenName.replace(`${tokenSetName}.`, '');
  }
  // 하위 호환성을 위해 'global.' prefix도 확인
  if (tokenName.startsWith('global.')) {
    return tokenName.replace('global.', '');
  }
  return tokenName;
};

/**
 * Spacing 토큰들을 추출하는 함수
 * @returns {Array} spacing 토큰 배열
 */
const getSpacingTokens = () => {
  const spacingTokens = []
  
  Object.entries(otherTokens.value).forEach(([tokenName, tokenData]) => {
    if (tokenData.type === 'spacing') {
      spacingTokens.push({
        name: removeTokenSetPrefix(tokenName),
        value: `${tokenData.value}px`,
        type: tokenData.type,
        rawValue: tokenData.value
      })
    }
  })
  
  // 크기 순으로 정렬
  return spacingTokens.sort((a, b) => parseInt(a.rawValue) - parseInt(b.rawValue))
}

/**
 * Font 토큰들을 추출하는 함수
 * @returns {Array} font 토큰 배열
 */
const getFontTokens = () => {
  const fontTokens = []
  
  Object.entries(otherTokens.value).forEach(([tokenName, tokenData]) => {
    if (tokenData.type === 'fontFamilies' || tokenData.type === 'fontFamily') {
      fontTokens.push({
        name: removeTokenSetPrefix(tokenName),
        value: tokenData.value,
        type: tokenData.type
      })
    }
  })
  
  return fontTokens
}

/**
 * Asset(이미지/에셋) 토큰들을 추출하는 함수
 * @returns {Array} asset 토큰 배열
 */
const getAssetTokens = () => {
  const assetTokens = []
  
  Object.entries(otherTokens.value).forEach(([tokenName, tokenData]) => {
    if (tokenData.type === 'asset') {
      assetTokens.push({
        name: removeTokenSetPrefix(tokenName),
        value: tokenData.value,
        type: tokenData.type
      })
    }
  })
  
  return assetTokens
}

/**
 * Border 토큰들을 추출하는 함수
 * @returns {Array} border 토큰 배열
 */
const getBorderTokens = () => {
  const borderTokens = []
  
  Object.entries(otherTokens.value).forEach(([tokenName, tokenData]) => {
    if (tokenData.type === 'border') {
      borderTokens.push({
        name: removeTokenSetPrefix(tokenName),
        value: tokenData.value,
        type: tokenData.type
      })
    }
  })
  
  return borderTokens
}

/**
 * Typography 토큰들을 추출하는 함수
 * @returns {Array} typography 토큰 배열
 */
const getTypographyTokens = () => {
  const typographyTokens = []
  
  Object.entries(otherTokens.value).forEach(([tokenName, tokenData]) => {
    if (tokenData.type === 'typography') {
      typographyTokens.push({
        name: removeTokenSetPrefix(tokenName),
        value: tokenData.value,
        type: tokenData.type
      })
    }
  })
  
  return typographyTokens
}

/**
 * 시각화되지 않는 기타 토큰들을 추출하는 함수
 * @returns {Array} 기타 토큰 배열
 */
const getOtherNonVisualTokens = () => {
  const otherNonVisualTokens = []
  const visualizedTypes = ['spacing', 'fontFamilies', 'fontFamily', 'asset', 'border', 'typography']
  
  Object.entries(otherTokens.value).forEach(([tokenName, tokenData]) => {
    // 이미 시각화된 타입들을 제외한 나머지 토큰들
    if (!visualizedTypes.includes(tokenData.type)) {
      otherNonVisualTokens.push({
        name: removeTokenSetPrefix(tokenName),
        value: tokenData.value || JSON.stringify(tokenData),
        type: tokenData.type || 'unknown'
      })
    }
  })
  
  return otherNonVisualTokens
}

/**
 * Spacing 토큰의 TailwindCSS 클래스명 생성
 * @param {string} spacingName - spacing 토큰명
 * @returns {string} TailwindCSS 클래스명
 */
const getSpacingClass = (spacingName) => {
  const name = spacingName.toLowerCase()
  return `spacing-${name}` // 예: spacing-xs, spacing-md
}

/**
 * Font 토큰의 TailwindCSS 클래스명 생성
 * @param {string} fontName - font 토큰명
 * @returns {string} TailwindCSS 클래스명
 */
const getFontClass = (fontName) => {
  const name = fontName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return `font-${name}` // 예: font-pretendard
}

/**
 * Font 이름을 사용자 친화적으로 포매팅
 * @param {string} fontName - 원본 폰트명
 * @returns {string} 포매팅된 폰트명
 */
const formatFontName = (fontName) => {
  return fontName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Asset 이름을 사용자 친화적으로 포매팅
 * @param {string} assetName - 원본 에셋명
 * @returns {string} 포매팅된 에셋명
 */
const formatAssetName = (assetName) => {
  return assetName
    .replace(/[_-]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Border 이름을 사용자 친화적으로 포매팅
 * @param {string} borderName - 원본 보더명
 * @returns {string} 포매팅된 보더명
 */
const formatBorderName = (borderName) => {
  return borderName
    .replace(/[_-]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Typography 이름을 사용자 친화적으로 포매팅
 * @param {string} typographyName - 원본 타이포그래피명
 * @returns {string} 포매팅된 타이포그래피명
 */
const formatTypographyName = (typographyName) => {
  return typographyName
    .replace(/[_-]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Border 토큰을 CSS border 스타일로 변환
 * @param {object} token - border 토큰 객체
 * @returns {object} CSS 스타일 객체
 */
const getBorderStyle = (token) => {
  const borderValue = token.value
  if (typeof borderValue === 'object') {
    return {
      border: `${borderValue.width || '1px'} ${borderValue.style || 'solid'} ${borderValue.color || '#000'}`
    }
  }
  return {
    border: borderValue
  }
}

/**
 * Typography 토큰을 CSS 스타일로 변환
 * @param {object} token - typography 토큰 객체
 * @returns {object} CSS 스타일 객체
 */
const getTypographyStyle = (token) => {
  const typographyValue = token.value
  if (typeof typographyValue === 'object') {
    return {
      fontFamily: typographyValue.fontFamily,
      fontSize: typographyValue.fontSize,
      fontWeight: typographyValue.fontWeight,
      lineHeight: typographyValue.lineHeight
    }
  }
  return {}
}
 
/**
 * Border 값을 읽기 쉬운 형태로 포매팅
 * @param {object|string} borderValue - border 값
 * @returns {string} 포매팅된 문자열
 */
const formatBorderValue = (borderValue) => {
  if (typeof borderValue === 'object') {
    return `${borderValue.width} ${borderValue.style} ${borderValue.color}`
  }
  return borderValue
}

/**
 * Typography 값을 읽기 쉬운 형태로 포매팅
 * @param {object|string} typographyValue - typography 값
 * @returns {string} 포매팅된 문자열
 */
const formatTypographyValue = (typographyValue) => {
  if (typeof typographyValue === 'object') {
    return `${typographyValue.fontSize} / ${typographyValue.lineHeight} ${typographyValue.fontWeight}`
  }
  return typographyValue
}

/**
 * 이미지 로드 에러 핸들러
 * @param {Event} event - 이미지 에러 이벤트
 */
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkMxOS40NDc3IDI2IDE5IDI1LjU1MjMgMTkgMjVDMTkgMjQuNDQ3NyAxOS40NDc3IDI0IDIwIDI0QzIwLjU1MjMgMjQgMjEgMjQuNDQ3NyAyMSAyNUMyMSAyNS41NTIzIDIwLjU1MjMgMjYgMjAgMjZaIiBmaWxsPSIjOTQ5Njk5Ii8+CjxwYXRoIGQ9Ik0yNiAxNkgyNkwyMC41IDEyTDE1IDE2SDE0VjE0SDE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0SDE1VjE0IiBzdHJva2U9IiM5NDk2OTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0OTY5OSIgZm9udC1zaXplPSI4Ij5FUlJPUjwvdGV4dD4KPC9zdmc+'
  event.target.alt = 'Image load failed'
}

/**
 * 클립보드에 값 복사
 * @param {string} value - 복사할 값
 */
const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
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
  
  // 첫 번째 사용 가능한 카테고리로 기본 설정
  nextTick(() => {
    if (availableKeywords.value.length > 0) {
      activeCategory.value = availableKeywords.value[0].id
    }
  })
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

/* 페이드 인 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

/* 카테고리 탭 호버 효과 개선 */
.category-tab {
  transition: all 0.2s ease-in-out;
}

.category-tab:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
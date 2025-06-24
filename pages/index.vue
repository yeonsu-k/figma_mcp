<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="border-b bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center py-6 sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Design Tokens Showcase</h1>
            <p class="mt-1 text-slate-600">Figma Tokens Studio + Style Dictionary 통합 테스트</p>
          </div>
          <div v-if="loadingError" class="text-sm text-red-500">⚠️ {{ loadingError }}</div>
          <div v-else class="flex items-center gap-2 text-sm text-green-700"><CheckCircleIcon class="size-5 text-green-600" /> Figma Tokens Studio 연결됨</div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- Token Status & Information Combined -->
      <section>
        <div class="card">
          <div class="card-body">
            <!-- Always Visible Header with Refresh Controls -->
            <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center space-x-3">
                <h2 class="text-xl font-semibold text-slate-800">🎯 토큰 관리</h2>
                <span class="text-sm text-slate-600">
                  마지막 새로고침: <span class="rounded bg-gray-50 px-2 py-1 font-mono">{{ lastUpdated }}</span>
                </span>
              </div>
              <button
                @click="refreshTokens"
                :disabled="isRefreshing"
                class="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowPathIcon :class="['mr-2 h-4 w-4 stroke-2', {'animate-spin': isRefreshing}]" />
                {{ isRefreshing ? '새로고침 중...' : '토큰 새로고침' }}
              </button>
            </div>

            <!-- Token Information Accordion -->
            <div>
              <!-- Accordion Header -->
              <div
                class="shaodw-sm cursor-pointer border border-slate-200/80 p-4 transition-colors select-none"
                :class="{'rounded-lg': !isTokenInfoExpanded, 'rounded-t-lg': isTokenInfoExpanded}"
                @click="isTokenInfoExpanded = !isTokenInfoExpanded"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-lg font-medium text-slate-700">ℹ️ 상세 정보</h3>
                    <span class="text-xs leading-none text-slate-500">파일 위치, 워크플로우</span>
                  </div>
                  <div class="transition-transform duration-200" :class="{'rotate-180': isTokenInfoExpanded}">
                    <ChevronDownIcon class="size-4 text-slate-800" />
                  </div>
                </div>
              </div>

              <!-- Accordion Content -->
              <div
                class="overflow-hidden rounded-b-lg border border-t-0 border-slate-200/80 px-4 transition-all duration-300 ease-in-out"
                :class="isTokenInfoExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'"
              >
                <div class="mt-2 py-4">
                  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h4 class="mb-3 font-medium text-slate-700">파일 위치</h4>
                      <ul class="space-y-2 text-sm">
                        <li><code class="rounded bg-slate-100 px-2 py-1">tokens/global.json</code> - 원본 토큰</li>
                        <li><code class="rounded bg-slate-100 px-2 py-1">assets/css/theme-tokens.css</code> - TailwindCSS v4 테마</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="mb-3 font-medium text-slate-700">워크플로우</h4>
                      <ol class="space-y-2 text-sm">
                        <li>
                          <span class="flex items-center">
                            <span class="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">1</span>
                            Figma에서 Tokens Studio 플러그인으로 토큰 정의
                          </span>
                        </li>
                        <li>
                          <span class="flex items-center">
                            <span class="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">2</span>
                            GitHub에 push 시 GitHub Actions 실행
                          </span>
                        </li>
                        <li>
                          <span class="flex items-center">
                            <span class="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">3</span>
                            Style Dictionary로 CSS 변수 및 Tailwind 테마 생성
                          </span>
                        </li>
                        <li>
                          <span class="flex items-center">
                            <span class="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">4</span>
                            웹사이트에서 토큰 확인 및 복사
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Token Categories & Display -->
      <section>
        <div class="card">
          <div class="card-body">
            <!-- Categories Header -->
            <div class="mb-8">
              <h2 class="mb-6 text-2xl font-semibold">🎯 Design Tokens</h2>
              <div class="mb-6 flex flex-wrap gap-3">
                <button
                  v-for="keyword in availableKeywords"
                  :key="keyword.id"
                  @click="activeCategory = keyword.id"
                  :class="[
                    'category-tab gap-2 rounded-full border-2 px-4 py-2 font-medium transition-all duration-200',
                    activeCategory === keyword.id
                      ? 'border-blue-500/90 bg-blue-600/90 text-white shadow-lg'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
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
              <ColorTokensView
                v-if="activeCategory === 'colors' && (Object.keys(colorPalettes).length > 0 || Object.keys(singleColors).length > 0)"
                :color-palettes="colorPalettes"
                :single-colors="singleColors"
                @copy-to-clipboard="handleCopyToClipboard"
              />

              <!-- Spacing Content -->
              <SpacingTokensView
                v-if="activeCategory === 'spacing' && getSpacingTokens(otherTokens).length > 0"
                :spacing-tokens="getSpacingTokens(otherTokens)"
                @copy-to-clipboard="handleCopyToClipboard"
              />

              <!-- Assets Content -->
              <AssetsTokensView
                v-if="activeCategory === 'assets' && getAssetTokens(otherTokens).length > 0"
                :asset-tokens="getAssetTokens(otherTokens)"
                @copy-to-clipboard="handleCopyToClipboard"
              />

              <!-- Borders Content -->
              <BorderTokensView
                v-if="activeCategory === 'borders' && getBorderTokens(otherTokens).length > 0"
                :border-tokens="getBorderTokens(otherTokens)"
                @copy-to-clipboard="handleCopyToClipboard"
              />

              <!-- Typography Content -->
              <TypographyTokensView
                v-if="activeCategory === 'typography' && (getTypographyTokens(otherTokens).length > 0 || getFontTokens(otherTokens).length > 0)"
                :typography-tokens="getTypographyTokens(otherTokens)"
                :font-tokens="getFontTokens(otherTokens)"
                @copy-to-clipboard="handleCopyToClipboard"
              />

              <!-- Opacity Content -->
              <OpacityTokensView
                v-if="activeCategory === 'opacity' && getOpacityTokens(otherTokens).length > 0"
                :opacity-tokens="getOpacityTokens(otherTokens)"
                @copy-to-clipboard="handleCopyToClipboard"
              />

              <!-- Border Radius Content -->
              <BorderRadiusTokensView
                v-if="activeCategory === 'borderRadius' && getBorderRadiusTokens(otherTokens).length > 0"
                :border-radius-tokens="getBorderRadiusTokens(otherTokens)"
                @copy-to-clipboard="handleCopyToClipboard"
              />

              <!-- Other Tokens Content -->
              <OtherTokensView
                v-if="activeCategory === 'other' && getOtherNonVisualTokens(otherTokens).length > 0"
                :other-tokens="getOtherNonVisualTokens(otherTokens)"
                @copy-to-clipboard="handleCopyToClipboard"
              />

              <!-- Empty State -->
              <div v-if="availableKeywords.length === 0" class="py-12 text-center">
                <div class="mb-4 text-slate-400">
                  <SwatchIcon class="mx-auto h-16 w-16" />
                </div>
                <h3 class="mb-2 text-lg font-medium text-slate-700">토큰을 로드할 수 없습니다</h3>
                <p class="mb-4 text-slate-500">디자인 토큰을 빌드하거나 새로고침해주세요.</p>
                <div class="space-y-2 text-sm text-slate-600">
                  <p><code class="rounded bg-slate-100 px-2 py-1">npm run tokens:build</code></p>
                  <p>또는 아래 새로고침 버튼을 클릭하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t bg-white">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-slate-500">
          <p>Figma Tokens Studio + GitHub Actions + Style Dictionary + Tailwind CSS v4</p>
          <p class="mt-1">마지막 업데이트: {{ lastUpdated }}</p>
        </div>
      </div>
    </footer>

    <!-- Toast notification -->
    <div
      v-if="showToast"
      class="fixed right-4 bottom-4 rounded-lg px-4 py-2 text-white shadow-lg transition-opacity"
      :class="[{'opacity-0': !showToast}, toastType === 'success' ? 'bg-green-600' : 'bg-red-600']"
    >
      {{ toastMessage || '값이 클립보드에 복사되었습니다!' }}
    </div>
  </div>
</template>

<script setup>
import {ArrowPathIcon, SwatchIcon, ChevronDownIcon} from '@heroicons/vue/24/outline'
import {CheckCircleIcon} from '@heroicons/vue/20/solid'

// 컴포넌트 import
import ColorTokensView from '~/components/tokens/ColorTokensView.vue'
import SpacingTokensView from '~/components/tokens/SpacingTokensView.vue'
import AssetsTokensView from '~/components/tokens/AssetsTokensView.vue'
import BorderTokensView from '~/components/tokens/BorderTokensView.vue'
import TypographyTokensView from '~/components/tokens/TypographyTokensView.vue'
import OpacityTokensView from '~/components/tokens/OpacityTokensView.vue'
import BorderRadiusTokensView from '~/components/tokens/BorderRadiusTokensView.vue'
import OtherTokensView from '~/components/tokens/OtherTokensView.vue'

// Composables import
import {useTokens} from '~/composables/useTokens'
import {useTokenExtractors} from '~/composables/useTokenExtractors'
import {useTokenCategories} from '~/composables/useTokenCategories'
import {useClipboard} from '~/composables/useClipboard'

// Initialize composables
const {lastUpdated, colorPalettes, singleColors, otherTokens, isRefreshing, loadingError, loadTokens, refreshTokens} = useTokens()

const {
  getSpacingTokens,
  getFontTokens,
  getAssetTokens,
  getBorderTokens,
  getTypographyTokens,
  getOpacityTokens,
  getBorderRadiusTokens,
  getOtherNonVisualTokens
} = useTokenExtractors()

const {generateAvailableKeywords, getDefaultCategory} = useTokenCategories()

const {copyToClipboard, copyTokenValue, showToast, toastMessage, toastType} = useClipboard()

// Local reactive state
const activeCategory = ref('colors') // 기본 활성 카테고리
const isTokenInfoExpanded = ref(false) // 토큰 정보 아코디언 상태

/**
 * 클립보드 복사를 처리하는 통합 함수
 * @param {string} value - 복사할 값
 * @param {string} tokenName - 토큰 이름 (선택적)
 */
const handleCopyToClipboard = (value, tokenName = '') => {
  if (tokenName) {
    copyTokenValue(value, tokenName)
  } else {
    copyToClipboard(value)
  }
}

/**
 * 사용 가능한 키워드 목록을 계산하는 computed 속성
 * @returns {Array} 키워드 배열
 */
const availableKeywords = computed(() => {
  const spacingTokens = getSpacingTokens(otherTokens.value)
  const typographyTokens = getTypographyTokens(otherTokens.value)
  const fontTokens = getFontTokens(otherTokens.value)
  const assetTokens = getAssetTokens(otherTokens.value)
  const borderTokens = getBorderTokens(otherTokens.value)
  const opacityTokens = getOpacityTokens(otherTokens.value)
  const borderRadiusTokens = getBorderRadiusTokens(otherTokens.value)
  const otherNonVisualTokens = getOtherNonVisualTokens(otherTokens.value)

  return generateAvailableKeywords({
    colorPalettes: colorPalettes.value,
    singleColors: singleColors.value,
    spacingTokens,
    typographyTokens,
    fontTokens,
    assetTokens,
    borderTokens,
    opacityTokens,
    borderRadiusTokens,
    otherTokens: otherNonVisualTokens
  })
})

// Lifecycle
onMounted(async () => {
  // 토큰 로드
  await loadTokens()

  // 첫 번째 사용 가능한 카테고리로 기본 설정
  nextTick(() => {
    const defaultCategory = getDefaultCategory(availableKeywords.value)
    if (defaultCategory) {
      activeCategory.value = defaultCategory
    }
  })
})

// Head metadata
useHead({
  title: 'Design Tokens Showcase - Figma MCP',
  meta: [{name: 'description', content: 'Figma Tokens Studio와 Style Dictionary 통합 테스트 페이지'}]
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

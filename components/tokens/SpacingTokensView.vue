<template>
  <div class="animate-fade-in">
    <CategoryHeader icon="📏" title="Spacing Tokens" />

    <!-- 박스 형태 시각화 -->
    <div class="mb-6">
      <TokenGrid variant="visual">
        <div v-for="token in spacingTokens" :key="`box-${token.name}-${token.value}`" class="text-center">
          <!-- 간격을 padding/margin으로 시각화 -->
          <div class="flex h-full flex-col items-center space-y-3">
            <div class="flex flex-1 items-center justify-center">
              <!-- 외부 박스 (margin 효과) -->
              <div
                class="relative cursor-pointer rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 transition-transform hover:scale-105"
                :style="{padding: token.value}"
                :title="`${token.name}: ${token.originalValue || token.value}`"
                @click="copyToClipboard(token.originalValue || token.value, token.name)"
              >
                <!-- 내부 박스 (실제 spacing) -->
                <div class="flex size-4 items-center justify-center rounded-sm bg-blue-500" :title="`${token.name}: ${token.originalValue || token.value}`" />
              </div>
            </div>

            <!-- 토큰 정보 -->
            <div>
              <p class="text-sm font-medium text-slate-700">{{ token.name }}</p>
              <p class="text-xs font-medium text-blue-600">{{ getSpacingClass(token.name) }}</p>
              <p class="font-mono text-xs text-slate-500">{{ token.originalValue || token.value }}</p>
            </div>
          </div>
        </div>
      </TokenGrid>
    </div>
  </div>
</template>

<script setup>
// 공통 컴포넌트 import
import CategoryHeader from '~/components/CategoryHeader.vue'
import TokenGrid from '~/components/TokenGrid.vue'

// Props 정의
const props = defineProps({
  spacingTokens: {
    type: Array,
    default: () => []
  }
})

// Emits 정의
const emit = defineEmits(['copy-to-clipboard'])

/**
 * Spacing 토큰에 대한 CSS 클래스명 생성
 * @param {string} tokenName - 토큰명
 * @returns {string} CSS 클래스명
 */
const getSpacingClass = tokenName => {
  // 토큰명을 기반으로 Tailwind CSS 클래스 생성
  const cleanName = tokenName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return `p-${cleanName}, m-${cleanName}, gap-${cleanName}`
}

/**
 * 클립보드에 값을 복사하는 함수
 * @param {string} value - 복사할 값
 * @param {string} tokenName - 토큰 이름 (선택적)
 */
const copyToClipboard = (value, tokenName = '') => {
  emit('copy-to-clipboard', value, tokenName)
}
</script>

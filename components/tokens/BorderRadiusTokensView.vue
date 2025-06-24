<template>
  <div class="animate-fade-in">
    <CategoryHeader icon="📐" title="Border Radius Tokens" />

    <!-- Border Radius 시각화 -->
    <div class="mb-6">
      <TokenGrid variant="visual">
        <div class="text-center">
          <!-- Border Radius를 시각적으로 표현 -->
          <div class="flex h-full flex-col items-center space-y-3">
            <div class="flex flex-1 items-center justify-center">
              <!-- Border Radius가 적용된 박스 -->
              <div class="relative">
                <div class="size-18 cursor-pointer bg-sky-400 shadow-md transition-transform hover:scale-105">
                  <!-- 중앙 텍스트 -->
                  <div class="flex h-full items-center justify-center">
                    <span class="text-xs font-medium text-white opacity-90"> 0px </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 토큰 정보 -->
            <div>
              <p class="text-sm font-medium text-slate-700">0px</p>
              <p class="text-xs font-medium text-sky-600">rounded-none</p>
              <p class="font-mono text-xs text-slate-500">0px</p>
            </div>
          </div>
        </div>

        <div v-for="token in borderRadiusTokens" :key="`border-radius-${token.name}-${token.value}`" class="text-center">
          <!-- Border Radius를 시각적으로 표현 -->
          <div class="flex h-full flex-col items-center space-y-3">
            <div class="flex flex-1 items-center justify-center">
              <!-- Border Radius가 적용된 박스 -->
              <div class="relative">
                <div
                  class="size-18 cursor-pointer bg-sky-400 shadow-md transition-transform hover:scale-105"
                  :style="{
                    borderRadius: token.value
                  }"
                  :title="`${token.name}: ${token.value}`"
                  @click="copyToClipboard(token.value, token.name)"
                >
                  <!-- 중앙 텍스트 -->
                  <div class="flex h-full items-center justify-center">
                    <span class="text-xs font-medium text-white opacity-90">
                      {{ token.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 토큰 정보 -->
            <div>
              <p class="text-sm font-medium text-slate-700">{{ token.name }}</p>
              <p class="text-xs font-medium text-sky-600">radius-{{ token.name }}</p>
              <p class="font-mono text-xs text-slate-500">{{ token.value }}</p>
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
  borderRadiusTokens: {
    type: Array,
    default: () => []
  }
})

// Emits 정의
const emit = defineEmits(['copy-to-clipboard'])

/**
 * 클립보드에 값을 복사하는 함수
 * @param {string} value - 복사할 값
 * @param {string} tokenName - 토큰 이름 (선택적)
 */
const copyToClipboard = (value, tokenName = '') => {
  emit('copy-to-clipboard', value, tokenName)
}

/**
 * Border Radius 값에 따른 박스 크기 계산
 * @param {string} borderRadiusValue - border-radius 값
 * @returns {string} 박스의 크기 (width/height)
 */
const getBorderRadiusBoxSize = borderRadiusValue => {
  // px 값 추출
  const match = borderRadiusValue.match(/(\d+(?:\.\d+)?)px/)
  if (match) {
    const value = parseFloat(match[1])
    // 반경이 클수록 박스도 크게 (최소 40px, 최대 80px)
    return `${Math.min(Math.max(value * 2 + 20, 40), 80)}px`
  }

  // rem 값 처리
  const remMatch = borderRadiusValue.match(/(\d+(?:\.\d+)?)rem/)
  if (remMatch) {
    const value = parseFloat(remMatch[1])
    const pxValue = value * 16 // 1rem = 16px
    return `${Math.min(Math.max(pxValue * 2 + 20, 40), 80)}px`
  }

  // % 값이나 기타 값들은 기본 크기
  return '50px'
}
</script>

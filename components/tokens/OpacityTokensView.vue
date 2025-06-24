<template>
  <div class="animate-fade-in">
    <CategoryHeader icon="🌫️" title="Opacity Tokens" />

    <!-- 투명도 시각화 -->
    <div class="mb-6">
      <TokenGrid variant="visual">
        <div class="text-center">
          <!-- 투명도를 시각적으로 표현 -->
          <div class="flex h-full flex-col items-center space-y-3">
            <div class="flex flex-1 items-center justify-center">
              <!-- 배경 체크 패턴 -->
              <div class="bg-checkerboard bg-opacity-20 relative h-20 w-20 overflow-hidden rounded-lg shadow-md">
                <!-- 투명도가 적용된 오버레이 -->
                <div class="absolute inset-0 cursor-pointer bg-indigo-500 transition-transform hover:scale-105" />
                <!-- 중앙 텍스트 -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs font-bold text-white drop-shadow-md"> 100% </span>
                </div>
              </div>
            </div>

            <!-- 토큰 정보 -->
            <div>
              <p class="text-sm font-medium text-slate-700">100</p>
              <p class="text-xs font-medium text-indigo-600">opacity-100</p>
              <p class="font-mono text-xs text-slate-500">100%</p>
            </div>
          </div>
        </div>

        <div v-for="token in opacityTokens" :key="`opacity-${token.name}-${token.value}`" class="text-center">
          <!-- 투명도를 시각적으로 표현 -->
          <div class="flex h-full flex-col items-center space-y-3">
            <div class="flex flex-1 items-center justify-center">
              <!-- 배경 체크 패턴 -->
              <div class="bg-checkerboard bg-opacity-20 relative h-20 w-20 overflow-hidden rounded-lg shadow-md">
                <!-- 투명도가 적용된 오버레이 -->
                <div
                  class="absolute inset-0 cursor-pointer bg-indigo-500 transition-transform hover:scale-105"
                  :style="{opacity: token.value}"
                  :title="`${token.name}: ${token.value}`"
                  @click="copyToClipboard(token.value, token.name)"
                />
                <!-- 중앙 텍스트 -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs font-bold text-white drop-shadow-md"> {{ Math.round(parseFloat(token.value) * 100) }}% </span>
                </div>
              </div>
            </div>

            <!-- 토큰 정보 -->
            <div>
              <p class="text-sm font-medium text-slate-700">{{ token.name }}</p>
              <p class="text-xs font-medium text-indigo-600">opacity-{{ token.name }}</p>
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
  opacityTokens: {
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
</script>

<style scoped>
/* 체크 패턴 배경 */
.bg-checkerboard {
  background-image:
    linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 8px 8px;
  background-position:
    0 0,
    0 4px,
    4px -4px,
    -4px 0px;
}
</style>

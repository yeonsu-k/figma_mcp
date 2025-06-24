<template>
  <div class="animate-fade-in">
    <CategoryHeader icon="🖼️" title="Asset Tokens" />

    <TokenGrid variant="cards">
      <TokenCard
        v-for="token in assetTokens"
        :key="token.name"
        :token-name="formatAssetName(token.name)"
        :css-class="`img-${token.name.toLowerCase()}`"
        css-class-color="text-green-600"
        :display-value="token.value"
        :full-value="token.value"
        :truncate-value="true"
        preview-classes="h-32 bg-slate-100"
      >
        <template #preview>
          <img
            :src="token.value"
            :alt="token.name"
            class="max-h-full max-w-full cursor-pointer object-contain transition-transform hover:scale-105"
            @error="handleImageError"
            @click="copyToClipboard(token.value)"
          />
        </template>
      </TokenCard>
    </TokenGrid>
  </div>
</template>

<script setup>
// 공통 컴포넌트 import
import CategoryHeader from '~/components/CategoryHeader.vue'
import TokenGrid from '~/components/TokenGrid.vue'
import TokenCard from '~/components/TokenCard.vue'

// Props 정의
const props = defineProps({
  assetTokens: {
    type: Array,
    default: () => []
  }
})

// Emits 정의
const emit = defineEmits(['copy-to-clipboard'])

/**
 * Asset 이름을 사용자 친화적으로 포매팅
 * @param {string} assetName - 원본 에셋명
 * @returns {string} 포매팅된 에셋명
 */
const formatAssetName = assetName => {
  return assetName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * 이미지 로드 실패 처리
 * @param {Event} event - 에러 이벤트
 */
const handleImageError = event => {
  event.target.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0yMCAyNkM5IDE2IDExIDEzIDIwIDEzQzI5IDEzIDMxIDE2IDIwIDI2WiIgZmlsbD0iIzk0QTNCOCIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjE2IiByPSIzIiBmaWxsPSIjOTRBM0I4Ii8+Cjwvc3ZnPgo='
  event.target.alt = '이미지를 로드할 수 없습니다'
}

/**
 * 클립보드에 값을 복사하는 함수
 * @param {string} value - 복사할 값
 */
const copyToClipboard = value => {
  emit('copy-to-clipboard', value)
}
</script>

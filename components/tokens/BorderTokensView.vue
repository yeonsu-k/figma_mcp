<template>
  <div class="animate-fade-in">
    <CategoryHeader icon="🔲" title="Border Tokens" />

    <TokenGrid variant="cards">
      <TokenCard
        v-for="token in borderTokens"
        :key="token.name"
        :token-name="formatBorderName(token.name)"
        :css-class="`border-${token.name.toLowerCase()}`"
        css-class-color="text-orange-600"
        :display-value="formatBorderValue(token.value)"
        :full-value="JSON.stringify(token.value)"
        preview-classes="h-20 bg-slate-50"
      >
        <template #preview>
          <div
            class="h-12 w-16 cursor-pointer rounded bg-white transition-transform hover:scale-105"
            :style="getBorderStyle(token)"
            :title="`${token.name}: ${JSON.stringify(token.value)}`"
            @click="copyToClipboard(JSON.stringify(token.value))"
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
  borderTokens: {
    type: Array,
    default: () => []
  }
})

// Emits 정의
const emit = defineEmits(['copy-to-clipboard'])

/**
 * Border 이름을 사용자 친화적으로 포매팅
 * @param {string} borderName - 원본 보더명
 * @returns {string} 포매팅된 보더명
 */
const formatBorderName = borderName => {
  return borderName
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
const getBorderStyle = token => {
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
 * Border 값을 읽기 쉬운 형태로 포매팅
 * @param {object|string} borderValue - border 값
 * @returns {string} 포매팅된 문자열
 */
const formatBorderValue = borderValue => {
  if (typeof borderValue === 'object') {
    return `${borderValue.width} ${borderValue.style} ${borderValue.color}`
  }
  return borderValue
}

/**
 * 클립보드에 값을 복사하는 함수
 * @param {string} value - 복사할 값
 */
const copyToClipboard = value => {
  emit('copy-to-clipboard', value)
}
</script>

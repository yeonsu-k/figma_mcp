<template>
  <div class="animate-fade-in">
    <CategoryHeader icon="✏️" title="Typography Tokens" />

    <!-- Typography Styles -->
    <div v-if="typographyTokens.length > 0" class="mb-8">
      <h4 class="mb-4 text-lg font-medium">Typography Styles</h4>
      <TokenGrid variant="default">
        <TokenCard
          v-for="token in typographyTokens"
          :key="token.name"
          :token-name="formatTypographyName(token.name)"
          :css-class="`text-${token.name.toLowerCase()}`"
          css-class-color="text-indigo-600"
          :display-value="formatTypographyValue(token.value)"
          :full-value="JSON.stringify(token.value)"
          preview-classes="bg-slate-50 p-4"
        >
          <template #preview>
            <div
              class="cursor-pointer transition-colors hover:bg-slate-100"
              :style="getTypographyStyle(token)"
              @click="copyToClipboard(JSON.stringify(token.value))"
            >
              <p class="mb-2">ABC abc 123</p>
              <p class="mb-1">가나다 한글 테스트</p>
              <p class="text-slate-600">The quick brown fox jumps over the lazy dog</p>
            </div>
          </template>
        </TokenCard>
      </TokenGrid>
    </div>

    <!-- Font Families -->
    <div v-if="fontTokens.length > 0">
      <h4 class="mb-4 text-lg font-medium">Font Families</h4>
      <TokenGrid variant="default">
        <!-- Built-in mono font card -->
        <TokenCard token-name="Space Mono" css-class="font-mono" css-class-color="text-violet-600" display-value="Space Mono Variable" preview-classes="p-4">
          <template #preview>
            <div class="font-mono">
              <p class="mb-2 text-2xl font-normal">ABC abc 123</p>
              <p class="mb-1 text-lg font-medium">가나다 한글 테스트</p>
              <p class="text-sm text-slate-600">The quick brown fox jumps</p>
            </div>
          </template>
        </TokenCard>

        <!-- Dynamic font tokens -->
        <TokenCard
          v-for="token in fontTokens"
          :key="token.name"
          :token-name="formatFontName(token.name)"
          :css-class="getFontClass(token.name)"
          css-class-color="text-violet-600"
          :display-value="token.value"
          preview-classes="p-2"
        >
          <template #preview>
            <div class="cursor-pointer transition-colors hover:bg-slate-50" :style="{fontFamily: token.value}" @click="copyToClipboard(token.value)">
              <p class="mb-2 text-2xl font-normal">ABC abc 123</p>
              <p class="mb-1 text-lg font-medium">가나다 한글 테스트</p>
              <p class="text-sm text-slate-600">The quick brown fox jumps</p>
            </div>
          </template>
        </TokenCard>
      </TokenGrid>
    </div>
  </div>
</template>

<script setup>
// 공통 컴포넌트 import
import CategoryHeader from '~/components/CategoryHeader.vue'
import TokenGrid from '~/components/TokenGrid.vue'
import TokenCard from '~/components/TokenCard.vue'

// Props 정의
const props = defineProps({
  typographyTokens: {
    type: Array,
    default: () => []
  },
  fontTokens: {
    type: Array,
    default: () => []
  }
})

// Emits 정의
const emit = defineEmits(['copy-to-clipboard'])

/**
 * Typography 이름을 사용자 친화적으로 포매팅
 * @param {string} typographyName - 원본 타이포그래피명
 * @returns {string} 포매팅된 타이포그래피명
 */
const formatTypographyName = typographyName => {
  return typographyName
    .replace(/[_-]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Font 이름을 사용자 친화적으로 포매팅
 * @param {string} fontName - 원본 폰트명
 * @returns {string} 포매팅된 폰트명
 */
const formatFontName = fontName => {
  return fontName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Font 토큰의 TailwindCSS 클래스명 생성
 * @param {string} fontName - font 토큰명
 * @returns {string} TailwindCSS 클래스명
 */
const getFontClass = fontName => {
  const name = fontName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return `font-${name}` // 예: font-pretendard
}

/**
 * Typography 토큰을 CSS 스타일로 변환
 * @param {object} token - typography 토큰 객체
 * @returns {object} CSS 스타일 객체
 */
const getTypographyStyle = token => {
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
 * Typography 값을 읽기 쉬운 형태로 포매팅
 * @param {object|string} typographyValue - typography 값
 * @returns {string} 포매팅된 문자열
 */
const formatTypographyValue = typographyValue => {
  if (typeof typographyValue === 'object') {
    return `${typographyValue.fontSize} / ${typographyValue.lineHeight} ${typographyValue.fontWeight}`
  }
  return typographyValue
}

/**
 * 클립보드에 값을 복사하는 함수
 * @param {string} value - 복사할 값
 */
const copyToClipboard = value => {
  emit('copy-to-clipboard', value)
}
</script>

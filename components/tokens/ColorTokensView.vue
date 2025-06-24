<template>
  <div class="animate-fade-in">
    <CategoryHeader icon="🎨" title="Color Palettes" />

    <!-- Single Colors (단일 색상을 먼저 표시) -->
    <div v-if="Object.keys(singleColors).length > 0" class="mb-8">
      <h4 class="mb-4 text-lg font-medium">Single Colors</h4>
      <TokenGrid variant="colors">
        <div v-for="(colorData, colorName) in singleColors" :key="`single-${colorName}`" class="text-center">
          <div
            class="mb-2 h-16 w-full cursor-pointer rounded-lg shadow-sm transition-transform hover:scale-105 md:h-20"
            :style="getSingleColorStyle(colorName)"
            :title="`${colorName}: ${colorData.value}`"
            @click="copyToClipboard(colorData.value)"
          />
          <p class="text-xs font-medium text-slate-700 capitalize">{{ formatColorGroupName(colorName) }}</p>
          <p class="text-xs font-medium text-slate-700">bg-{{ colorName.toLowerCase() }}</p>
          <p class="font-mono text-xs text-slate-500">{{ colorData.value }}</p>
        </div>
      </TokenGrid>
    </div>

    <!-- Dynamic Color Palettes (색상 팔레트) -->
    <div v-for="(colorGroup, groupName) in colorPalettes" :key="`palette-${groupName}`" class="mb-8">
      <h4 class="mb-4 text-lg font-medium">{{ formatColorGroupName(groupName) }}</h4>
      <TokenGrid variant="colors">
        <div v-for="(colorData, shadeName) in colorGroup" :key="`${groupName}-${shadeName}`" class="text-center">
          <div
            class="mb-2 h-16 w-full cursor-pointer rounded-lg shadow-sm transition-transform hover:scale-105 md:h-20"
            :style="getColorStyle(groupName, shadeName)"
            :title="`${groupName}-${shadeName}: ${colorData.value}`"
            @click="copyToClipboard(colorData.value)"
          />
          <p class="text-xs font-medium text-slate-700">{{ shadeName }}</p>
          <p class="text-xs font-medium text-slate-700">bg-{{ groupName.toLowerCase() }}-{{ shadeName }}</p>
          <p class="font-mono text-xs text-slate-500">{{ colorData.value }}</p>
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
  colorPalettes: {
    type: Object,
    default: () => ({})
  },
  singleColors: {
    type: Object,
    default: () => ({})
  }
})

// Emits 정의 - 부모 컴포넌트에서 정의된 함수들을 사용하기 위해
const emit = defineEmits(['copy-to-clipboard'])

/**
 * 색상 그룹명을 사용자 친화적으로 포맷팅
 * @param {string} groupName - 그룹명
 * @returns {string} 포맷된 그룹명
 */
const formatColorGroupName = groupName => {
  if (!groupName) return ''
  return groupName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * CSS 커스텀 속성을 사용하여 동적 색상 스타일 생성 (팔레트용)
 * @param {string} groupName - 색상 그룹명 (예: 'slate', 'mlbb', 'primary')
 * @param {string} shadeName - 색상 단계명 (예: '50', '500', '900')
 * @returns {Object} CSS 스타일 객체
 */
const getColorStyle = (groupName, shadeName) => {
  // colorPalettes에서 해당 색상 조합이 존재하는지 확인
  const palette = props.colorPalettes[groupName]
  if (palette && palette[shadeName] && palette[shadeName].value) {
    return {
      backgroundColor: palette[shadeName].value,
      // 텍스트가 보이도록 대비 설정
      color: shouldUseLightText(palette[shadeName].value) ? '#ffffff' : '#000000'
    }
  }

  // 기본값 (회색)
  return {
    backgroundColor: '#f1f5f9',
    color: '#64748b'
  }
}

/**
 * CSS 커스텀 속성을 사용하여 동적 색상 스타일 생성 (단일 색상용)
 * @param {string} colorName - 색상명 (예: 'black', 'white', 'primary', 'secondary')
 * @returns {Object} CSS 스타일 객체
 */
const getSingleColorStyle = colorName => {
  // singleColors에서 해당 색상이 존재하는지 확인
  const colorData = props.singleColors[colorName]
  if (colorData && colorData.value) {
    return {
      backgroundColor: colorData.value,
      // 텍스트가 보이도록 대비 설정
      color: shouldUseLightText(colorData.value) ? '#ffffff' : '#000000'
    }
  }

  // 기본값 (회색)
  return {
    backgroundColor: '#f1f5f9',
    color: '#64748b'
  }
}

/**
 * 색상 밝기에 따라 텍스트 색상을 결정하는 함수
 * @param {string} hexColor - HEX 색상값
 * @returns {boolean} 밝은 텍스트 사용 여부
 */
const shouldUseLightText = hexColor => {
  if (!hexColor || typeof hexColor !== 'string') return false

  // #을 제거하고 RGB 값 추출
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // 밝기 계산 (0.299*R + 0.587*G + 0.114*B)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // 밝기가 128보다 작으면 밝은 텍스트 사용
  return brightness < 128
}

/**
 * 클립보드에 값을 복사하는 함수
 * @param {string} value - 복사할 값
 */
const copyToClipboard = value => {
  emit('copy-to-clipboard', value)
}
</script>

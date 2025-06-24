<template>
  <div class="rounded-lg border border-slate-200 p-4">
    <!-- 미리보기 영역 -->
    <div class="mb-4 flex items-center justify-center overflow-hidden rounded-lg" :class="previewClasses" :style="previewStyles">
      <slot name="preview">
        <!-- 기본 미리보기 내용 -->
        <div class="text-slate-400">
          <span class="text-2xl">{{ previewIcon || '📋' }}</span>
        </div>
      </slot>
    </div>

    <!-- 토큰 정보 영역 -->
    <div class="border-t border-slate-100 pt-3">
      <p class="text-sm font-medium text-slate-700 capitalize">{{ tokenName }}</p>
      <p class="text-xs font-medium" :class="cssClassColor">{{ cssClass }}</p>
      <p class="font-mono text-xs text-slate-500" :class="{truncate: truncateValue}" :title="fullValueComputed">
        {{ displayValue }}
      </p>
    </div>
  </div>
</template>

<script setup>
/**
 * 토큰 카드 컴포넌트
 * 모든 토큰 타입에서 재사용 가능한 카드 레이아웃 제공
 */

// Props 정의
const props = defineProps({
  /**
   * 토큰 이름
   * @type {string}
   */
  tokenName: {
    type: String,
    required: true
  },
  /**
   * CSS 클래스명 (예: bg-blue-500, font-bold)
   * @type {string}
   */
  cssClass: {
    type: String,
    required: true
  },
  /**
   * CSS 클래스 텍스트 색상 (Tailwind 클래스)
   * @type {string}
   */
  cssClassColor: {
    type: String,
    default: 'text-blue-600'
  },
  /**
   * 표시할 값
   * @type {string}
   */
  displayValue: {
    type: String,
    required: true
  },
  /**
   * 전체 값 (tooltip용)
   * @type {string}
   */
  fullValue: {
    type: String,
    default: ''
  },
  /**
   * 값을 잘라서 표시할지 여부
   * @type {boolean}
   */
  truncateValue: {
    type: Boolean,
    default: false
  },
  /**
   * 미리보기 영역의 추가 클래스
   * @type {string|Array}
   */
  previewClasses: {
    type: [String, Array],
    default: 'h-20 bg-slate-50'
  },
  /**
   * 미리보기 영역의 인라인 스타일
   * @type {Object}
   */
  previewStyles: {
    type: Object,
    default: () => ({})
  },
  /**
   * 기본 미리보기 아이콘 (슬롯이 비어있을 때)
   * @type {string}
   */
  previewIcon: {
    type: String,
    default: ''
  }
})

// Computed
const fullValueComputed = computed(() => {
  return props.fullValue || props.displayValue
})
</script>

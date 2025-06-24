<template>
  <div class="grid gap-6" :class="gridClasses">
    <slot />
  </div>
</template>

<script setup>
/**
 * 토큰 그리드 컴포넌트
 * 반응형 그리드 레이아웃을 제공하는 래퍼 컴포넌트
 */

// Props 정의
const props = defineProps({
  /**
   * 그리드 타입별 반응형 클래스
   * @type {string}
   */
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'colors', 'spacing', 'cards'].includes(value)
  },
  /**
   * 커스텀 그리드 클래스 (variant를 오버라이드)
   * @type {string|Array}
   */
  customClasses: {
    type: [String, Array],
    default: ''
  }
})

// Computed
const gridClasses = computed(() => {
  if (props.customClasses) {
    return props.customClasses
  }

  const variants = {
    default: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    colors: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11',
    spacing: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8',
    cards: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return variants[props.variant] || variants.default
})
</script>

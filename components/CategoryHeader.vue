<template>
  <div class="mb-6 flex items-center">
    <span class="mr-3 text-3xl">{{ icon }}</span>
    <h3 class="text-xl font-semibold text-slate-800">{{ title }}</h3>
  </div>
</template>

<script setup>
/**
 * 카테고리 헤더 컴포넌트
 * 각 토큰 카테고리의 공통 헤더 스타일을 제공
 */

// Props 정의
const props = defineProps({
  /**
   * 카테고리 아이콘 (이모지)
   * @type {string}
   */
  icon: {
    type: String,
    required: true
  },
  /**
   * 카테고리 제목
   * @type {string}
   */
  title: {
    type: String,
    required: true
  }
})
</script>

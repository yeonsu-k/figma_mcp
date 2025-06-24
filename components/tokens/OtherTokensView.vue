<template>
  <div class="animate-fade-in">
    <CategoryHeader icon="📋" title="Other Properties" />

    <TokenGrid variant="default">
      <div
        v-for="token in otherTokens"
        :key="token.name"
        class="cursor-pointer rounded-lg border bg-slate-50 p-4 transition-colors hover:bg-slate-100"
        @click="copyToClipboard(token.value)"
      >
        <p class="mb-1 text-sm font-medium text-slate-700">{{ token.name }}</p>
        <p class="font-mono text-xs wrap-anywhere text-slate-500">{{ token.value }}</p>
        <p class="mt-1 text-xs text-blue-600">{{ token.type }}</p>
      </div>
    </TokenGrid>
  </div>
</template>

<script setup>
// 공통 컴포넌트 import
import CategoryHeader from '~/components/CategoryHeader.vue'
import TokenGrid from '~/components/TokenGrid.vue'

// Props 정의
const props = defineProps({
  otherTokens: {
    type: Array,
    default: () => []
  }
})

// Emits 정의
const emit = defineEmits(['copy-to-clipboard'])

/**
 * 클립보드에 값을 복사하는 함수
 * @param {string} value - 복사할 값
 */
const copyToClipboard = value => {
  emit('copy-to-clipboard', value)
}
</script>

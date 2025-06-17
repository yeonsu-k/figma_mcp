<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">페이지를 찾을 수 없습니다</h2>
      <p class="text-gray-600 mb-8">요청하신 페이지가 존재하지 않습니다.</p>
      <NuxtLink to="/" class="btn-primary">
        홈으로 돌아가기
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '404 - Page Not Found',
  meta: [
    { name: 'description', content: '페이지를 찾을 수 없습니다.' }
  ]
})
</script>
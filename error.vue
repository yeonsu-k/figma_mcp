<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="mb-4 text-6xl font-bold text-gray-900">404</h1>
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">페이지를 찾을 수 없습니다</h2>
      <p class="mb-8 text-gray-600">요청하신 페이지가 존재하지 않습니다.</p>
      <NuxtLink to="/" class="btn-primary"> 홈으로 돌아가기 </NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '404 - Page Not Found',
  meta: [{name: 'description', content: '페이지를 찾을 수 없습니다.'}]
})
</script>

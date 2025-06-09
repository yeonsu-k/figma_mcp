<template>
  <div class="min-h-screen">
    <NuxtPage />
  </div>
</template>

<script setup>
// Initialize auth store on app start
const authStore = useAuthStore()

// Initialize authentication state
onMounted(async () => {
  await authStore.initAuth()
})
</script>

<style>
/* Global styles are imported through assets/css/main.css */
</style>
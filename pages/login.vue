<template>
  <div class="min-h-screen bg-slate-100 relative">
    <!-- Background with image and blur effect -->
    <div class="fixed inset-0 -top-16">
      <!-- Background image -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800"></div>
      <!-- Overlay -->
      <div class="absolute inset-0 bg-slate-700 bg-opacity-90"></div>
      <!-- Backdrop blur -->
      <div class="absolute inset-0 backdrop-blur-sm"></div>
    </div>

    <!-- Main Content Container -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <!-- Central Content Area -->
      <div class="flex-1 flex flex-col justify-center items-center px-4 pb-20">
        <!-- Logo Section -->
        <div class="mb-10 text-center">
          <div class="flex items-end justify-center gap-3 mb-3">
            <!-- CyberGuard Logo -->
            <div class="text-white text-2xl font-bold tracking-wider">
              CYBERGUARD
            </div>
          </div>
          <h1 class="text-slate-300 text-xl font-semibold">관리자 페이지</h1>
        </div>

        <!-- Login Box -->
        <div class="bg-white rounded-3xl shadow-lg border border-slate-200 p-10 w-full max-w-[480px]">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Error Message -->
            <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-md p-3">
              <p class="text-red-600 text-sm">{{ authStore.error }}</p>
            </div>

            <!-- Email Input -->
            <div class="space-y-1.5">
              <label class="block text-slate-600 text-xs font-medium">
                아이디(이메일)
              </label>
              <div class="relative">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="아이디(이메일)를 입력해 주세요."
                  class="w-full px-4 py-3 border border-slate-400 rounded-md text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-1.5">
              <label class="block text-slate-600 text-xs font-medium">
                비밀번호
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="비밀번호를 입력해 주세요."
                  class="w-full px-4 py-3 border border-slate-400 rounded-md text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Buttons -->
            <div class="space-y-5 pt-4">
              <button
                type="submit"
                class="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium text-base py-3 px-4 rounded-md transition-colors duration-200"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading" class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  로그인 중...
                </span>
                <span v-else>로그인</span>
              </button>
              
              <button
                type="button"
                class="w-full border border-slate-600 text-slate-600 hover:bg-slate-50 font-medium text-base py-3 px-4 rounded-md transition-colors duration-200"
                @click="downloadAgent"
              >
                에이전트 설치파일 다운로드
              </button>
            </div>
          </form>
        </div>

        <!-- Sub Links -->
        <div class="flex items-center justify-center mt-10">
          <button 
            class="text-white text-sm font-medium px-4 py-1 hover:text-slate-300 transition-colors"
            @click="showPasswordReset"
          >
            비밀번호 찾기
          </button>
          <div class="w-px h-4 bg-slate-400 mx-1"></div>
          <button 
            class="text-white text-sm font-medium px-4 py-1 hover:text-slate-300 transition-colors"
            @click="showPrivacyPolicy"
          >
            개인정보 처리방침
          </button>
        </div>

        <!-- Copyright -->
        <div class="mt-8">
          <p class="text-slate-300 text-xs">
            COPYRIGHT © SK SHIELDUS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      <!-- Bottom Contact Info Section -->
      <div class="bg-slate-900 w-full py-5">
        <div class="flex justify-center items-center gap-0">
          <!-- Purchase & Product Inquiry -->
          <div class="text-center px-10">
            <h3 class="text-slate-300 text-sm font-bold mb-3">구매 및 제품문의</h3>
            <div class="flex items-center justify-center gap-2 mb-1">
              <svg class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012 8.5v-.5z" clip-rule="evenodd" />
              </svg>
              <span class="text-slate-300 text-xl font-medium">1800-6400</span>
            </div>
            <p class="text-slate-300 text-xs">평일 09:00~18:00 (토,일,공휴일 휴무)</p>
          </div>

          <!-- Divider -->
          <div class="w-px h-16 bg-slate-700"></div>

          <!-- Technical Support -->
          <div class="text-center px-10">
            <h3 class="text-slate-300 text-sm font-bold mb-3">기술 지원</h3>
            <div class="flex items-center justify-center gap-2 mb-1">
              <svg class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012 8.5v-.5z" clip-rule="evenodd" />
              </svg>
              <span class="text-slate-300 text-xl font-medium">1599-8315</span>
            </div>
            <p class="text-slate-300 text-xs">평일 09:00~18:00 (토,일,공휴일 휴무)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: ['auth']
})

useHead({
  title: 'CyberGuard 관리자 로그인',
  meta: [
    { name: 'description', content: 'CyberGuard 관리자 페이지 로그인' }
  ]
})

const authStore = useAuthStore()

// Form state
const form = ref({
  email: '',
  password: ''
})

// Login handler
const handleLogin = async () => {
  // Clear previous errors
  authStore.clearError()

  // Validate form
  if (!form.value.email || !form.value.password) {
    authStore.error = '아이디와 비밀번호를 입력해주세요.'
    return
  }

  // Attempt login (demo)
  await authStore.demoLogin()
}

// Download agent
const downloadAgent = () => {
  // Simulate file download
  const link = document.createElement('a')
  link.href = '/downloads/cyberguard-agent.exe'
  link.download = 'cyberguard-agent.exe'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Show password reset modal
const showPasswordReset = () => {
  alert('비밀번호 찾기 기능은 준비중입니다.')
}

// Show privacy policy
const showPrivacyPolicy = () => {
  window.open('/privacy-policy', '_blank')
}

// Clear error when component unmounts
onUnmounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
/* Focus states for accessibility */
button:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions for interactive elements */
button, input {
  transition: all 0.2s ease-in-out;
}

/* Loading state for login button */
.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .max-w-\[480px\] {
    max-width: 90%;
  }
  
  .px-10 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>
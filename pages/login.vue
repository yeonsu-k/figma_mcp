<template>
  <div class="relative min-h-screen bg-slate-100">
    <!-- Background with image and blur effect -->
    <div class="fixed inset-0 -top-16">
      <!-- Background image -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800"></div>
      <!-- Overlay -->
      <div class="bg-opacity-90 absolute inset-0 bg-slate-700"></div>
      <!-- Backdrop blur -->
      <div class="absolute inset-0 backdrop-blur-sm"></div>
    </div>

    <!-- Main Content Container -->
    <div class="relative z-10 flex min-h-screen flex-col">
      <!-- Central Content Area -->
      <div class="flex flex-1 flex-col items-center justify-center px-4 pb-20">
        <!-- Logo Section -->
        <div class="mb-10 text-center">
          <div class="mb-3 flex items-end justify-center gap-3">
            <!-- CyberGuard Logo -->
            <div class="text-2xl font-bold tracking-wider text-white">CYBERGUARD</div>
          </div>
          <h1 class="text-xl font-semibold text-slate-300">관리자 페이지</h1>
        </div>

        <!-- Login Box -->
        <div class="w-full max-w-[480px] rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Error Message -->
            <div v-if="authStore.error" class="rounded-md border border-red-200 bg-red-50 p-3">
              <p class="text-sm text-red-600">{{ authStore.error }}</p>
            </div>

            <!-- Email Input -->
            <div class="space-y-1.5">
              <label class="block text-xs font-medium text-slate-600"> 아이디(이메일) </label>
              <div class="relative">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="아이디(이메일)를 입력해 주세요."
                  class="w-full rounded-md border border-slate-400 px-4 py-3 text-base placeholder-slate-400 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-1.5">
              <label class="block text-xs font-medium text-slate-600"> 비밀번호 </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="비밀번호를 입력해 주세요."
                  class="w-full rounded-md border border-slate-400 px-4 py-3 text-base placeholder-slate-400 focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Buttons -->
            <div class="space-y-5 pt-4">
              <button
                type="submit"
                class="w-full rounded-md bg-slate-800 px-4 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-slate-700"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading" class="flex items-center justify-center gap-2">
                  <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  로그인 중...
                </span>
                <span v-else>로그인</span>
              </button>

              <button
                type="button"
                class="w-full rounded-md border border-slate-600 px-4 py-3 text-base font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50"
                @click="downloadAgent"
              >
                에이전트 설치파일 다운로드
              </button>
            </div>
          </form>
        </div>

        <!-- Sub Links -->
        <div class="mt-10 flex items-center justify-center">
          <button class="px-4 py-1 text-sm font-medium text-white transition-colors hover:text-slate-300" @click="showPasswordReset">비밀번호 찾기</button>
          <div class="mx-1 h-4 w-px bg-slate-400"></div>
          <button class="px-4 py-1 text-sm font-medium text-white transition-colors hover:text-slate-300" @click="showPrivacyPolicy">개인정보 처리방침</button>
        </div>

        <!-- Copyright -->
        <div class="mt-8">
          <p class="text-xs text-slate-300">COPYRIGHT © SK SHIELDUS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>

      <!-- Bottom Contact Info Section -->
      <div class="w-full bg-slate-900 py-5">
        <div class="flex items-center justify-center gap-0">
          <!-- Purchase & Product Inquiry -->
          <div class="px-10 text-center">
            <h3 class="mb-3 text-sm font-bold text-slate-300">구매 및 제품문의</h3>
            <div class="mb-1 flex items-center justify-center gap-2">
              <svg class="h-5 w-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012 8.5v-.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-xl font-medium text-slate-300">1800-6400</span>
            </div>
            <p class="text-xs text-slate-300">평일 09:00~18:00 (토,일,공휴일 휴무)</p>
          </div>

          <!-- Divider -->
          <div class="h-16 w-px bg-slate-700"></div>

          <!-- Technical Support -->
          <div class="px-10 text-center">
            <h3 class="mb-3 text-sm font-bold text-slate-300">기술 지원</h3>
            <div class="mb-1 flex items-center justify-center gap-2">
              <svg class="h-5 w-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012 8.5v-.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-xl font-medium text-slate-300">1599-8315</span>
            </div>
            <p class="text-xs text-slate-300">평일 09:00~18:00 (토,일,공휴일 휴무)</p>
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
  meta: [{name: 'description', content: 'CyberGuard 관리자 페이지 로그인'}]
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
button,
input {
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

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="text-cyber-800">
              <svg class="w-32 h-8" viewBox="0 0 186 40" fill="currentColor">
                <rect x="0" y="0" width="186" height="40" rx="4" fill="currentColor" opacity="0.1"/>
                <text x="93" y="25" text-anchor="middle" class="fill-current text-xs font-bold">CYBERGUARD</text>
              </svg>
            </div>
            <span class="text-slate-600 text-sm">관리자 대시보드</span>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <span class="text-slate-600 text-sm">안녕하세요, {{ authStore.userName }}님</span>
            <button
              @click="handleLogout"
              class="btn-outline text-sm px-3 py-1.5"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">대시보드</h1>
        <p class="text-slate-600">CyberGuard 보안 관리 시스템에 오신 것을 환영합니다.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">총 에이전트</p>
                <p class="text-2xl font-bold text-slate-900">1,234</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">활성 에이전트</p>
                <p class="text-2xl font-bold text-green-600">1,180</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">위험 알림</p>
                <p class="text-2xl font-bold text-red-600">12</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon class="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600 text-sm font-medium">오프라인</p>
                <p class="text-2xl font-bold text-slate-600">54</p>
              </div>
              <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <XCircleIcon class="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Activities -->
        <div class="card">
          <div class="card-body">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">최근 활동</h3>
            <div class="space-y-4">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="activity.bgColor">
                  <component :is="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-900">{{ activity.title }}</p>
                  <p class="text-xs text-slate-600">{{ activity.description }}</p>
                </div>
                <span class="text-xs text-slate-500">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="card">
          <div class="card-body">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">시스템 상태</h3>
            <div class="space-y-4">
              <div v-for="system in systemStatus" :key="system.name" class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full" :class="system.status === 'online' ? 'bg-green-500' : 'bg-red-500'"></div>
                  <span class="text-sm font-medium text-slate-900">{{ system.name }}</span>
                </div>
                <span class="text-xs px-2 py-1 rounded-full" :class="system.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ system.status === 'online' ? '정상' : '오프라인' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  BellIcon,
  CogIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'CyberGuard 대시보드',
  meta: [
    { name: 'description', content: 'CyberGuard 보안 관리 대시보드' }
  ]
})

const authStore = useAuthStore()

// Sample data
const recentActivities = ref([
  {
    id: 1,
    title: '새로운 에이전트 등록',
    description: 'WS-001 워크스테이션이 등록되었습니다.',
    time: '5분 전',
    icon: ShieldCheckIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    title: '보안 정책 업데이트',
    description: '방화벽 규칙이 업데이트되었습니다.',
    time: '15분 전',
    icon: CogIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 3,
    title: '위험 알림',
    description: '의심스러운 활동이 감지되었습니다.',
    time: '30분 전',
    icon: BellIcon,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    id: 4,
    title: '사용자 로그인',
    description: 'admin@company.com 로그인',
    time: '1시간 전',
    icon: UserIcon,
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-600'
  }
])

const systemStatus = ref([
  { name: 'Central Management Server', status: 'online' },
  { name: 'Database Server', status: 'online' },
  { name: 'Backup Server', status: 'online' },
  { name: 'Log Analysis Server', status: 'offline' },
  { name: 'API Gateway', status: 'online' }
])

// Logout handler
const handleLogout = async () => {
  if (confirm('정말 로그아웃하시겠습니까?')) {
    await authStore.logout()
  }
}
</script>
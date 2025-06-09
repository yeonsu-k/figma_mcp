import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  lastLogin?: Date
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user,
    isAdmin: (state): boolean => state.user?.role === 'admin',
    userName: (state): string => state.user?.name || '',
    userEmail: (state): string => state.user?.email || ''
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      this.error = null

      try {
        // Simulate API call
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        if (response.success) {
          this.token = response.token
          this.user = response.user
          
          // Store token in cookie for persistence
          const tokenCookie = useCookie('auth-token', {
            default: () => null,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          })
          tokenCookie.value = response.token

          // Redirect to dashboard
          await navigateTo('/dashboard')
        } else {
          throw new Error(response.message || '로그인에 실패했습니다.')
        }
      } catch (error: any) {
        this.error = error.message || '로그인 중 오류가 발생했습니다.'
        console.error('Login error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        // Call logout API if needed
        await $fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear state
        this.user = null
        this.token = null
        this.error = null

        // Clear cookie
        const tokenCookie = useCookie('auth-token')
        tokenCookie.value = null

        // Redirect to login
        await navigateTo('/login')
      }
    },

    async refreshToken() {
      const tokenCookie = useCookie('auth-token')
      
      if (!tokenCookie.value) {
        return false
      }

      try {
        const response = await $fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenCookie.value}`
          }
        })

        if (response.success) {
          this.token = response.token
          this.user = response.user
          tokenCookie.value = response.token
          return true
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        tokenCookie.value = null
      }

      return false
    },

    async initAuth() {
      const tokenCookie = useCookie('auth-token')
      
      if (tokenCookie.value) {
        this.token = tokenCookie.value
        
        // Try to refresh token and get user info
        const refreshed = await this.refreshToken()
        
        if (!refreshed) {
          // Token is invalid, clear everything
          this.token = null
          tokenCookie.value = null
        }
      }
    },

    clearError() {
      this.error = null
    },

    // Demo login for development
    async demoLogin() {
      this.isLoading = true
      this.error = null

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock user data
        this.user = {
          id: 'demo-user-1',
          email: 'admin@cyberguard.com',
          name: '관리자',
          role: 'admin',
          lastLogin: new Date()
        }
        this.token = 'demo-token-' + Date.now()

        // Store token in cookie
        const tokenCookie = useCookie('auth-token', {
          default: () => null,
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        tokenCookie.value = this.token

        // Redirect to dashboard
        await navigateTo('/dashboard')
      } catch (error: any) {
        this.error = error.message || '데모 로그인 중 오류가 발생했습니다.'
        console.error('Demo login error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})
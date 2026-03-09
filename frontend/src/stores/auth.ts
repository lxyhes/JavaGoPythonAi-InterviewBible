import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type User } from '@/services/api'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  captcha?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const captchaCode = ref<string>('')
  const captchaTimestamp = ref<number>(0)

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const currentUser = computed(() => user.value)
  const userDisplayName = computed(() => user.value?.username || user.value?.email?.split('@')[0] || '')
  const userAvatar = computed(() => user.value?.avatar || '')

  // Actions
  const setUser = (userData: User | null) => {
    user.value = userData
  }

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Generate random captcha (frontend only for demo)
  const generateCaptcha = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    captchaCode.value = code
    captchaTimestamp.value = Date.now()
    return code
  }

  // Validate captcha
  const validateCaptcha = (input: string): boolean => {
    const isExpired = Date.now() - captchaTimestamp.value > 5 * 60 * 1000
    if (isExpired) {
      generateCaptcha()
      return false
    }
    return input.toUpperCase() === captchaCode.value
  }

  // Get current captcha
  const getCaptcha = (): string => {
    if (!captchaCode.value || Date.now() - captchaTimestamp.value > 5 * 60 * 1000) {
      generateCaptcha()
    }
    return captchaCode.value
  }

  // Login with backend API
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Validate captcha if provided
      if (credentials.captcha && !validateCaptcha(credentials.captcha)) {
        error.value = '验证码错误或已过期'
        generateCaptcha()
        return false
      }

      const response = await authApi.login({
        email: credentials.email,
        password: credentials.password,
      })

      if (response.success) {
        user.value = response.data.user
        token.value = response.data.token
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        // Handle remember me
        if (credentials.rememberMe) {
          localStorage.setItem('remember_email', credentials.email)
        } else {
          localStorage.removeItem('remember_email')
        }

        return true
      } else {
        error.value = response.error || '登录失败'
        return false
      }
    } catch (err: any) {
      error.value = err.message || '登录失败，请稍后重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Register with backend API
  const register = async (data: RegisterData): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Validate captcha if provided
      if (data.captcha && !validateCaptcha(data.captcha)) {
        error.value = '验证码错误或已过期'
        generateCaptcha()
        return false
      }

      // Validate password match
      if (data.password !== data.confirmPassword) {
        error.value = '两次输入的密码不一致'
        return false
      }

      const response = await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      })

      if (response.success) {
        user.value = response.data.user
        token.value = response.data.token
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        return true
      } else {
        error.value = response.error || '注册失败'
        return false
      }
    } catch (err: any) {
      error.value = err.message || '注册失败，请稍后重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  // Initialize auth state from localStorage
  const initAuth = async () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)

        // Verify token is still valid by fetching current user
        const response = await authApi.getCurrentUser()
        if (response.success) {
          user.value = response.data
          localStorage.setItem('user', JSON.stringify(response.data))
        } else {
          // Token expired or invalid
          logout()
        }
      } catch {
        logout()
      }
    }
  }

  // Update user profile
  const updateProfile = async (updates: { username?: string; avatar?: string }): Promise<boolean> => {
    try {
      const response = await authApi.updateUser(updates)

      if (response.success) {
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // Change password
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await authApi.changePassword({ oldPassword, newPassword })
      return response.success
    } catch (err: any) {
      error.value = err.message || '修改密码失败'
      return false
    }
  }

  // Forgot password (mock)
  const forgotPassword = async (_email: string): Promise<boolean> => {
    // In production, this should call backend API
    return true
  }

  // Get remembered email
  const getRememberedEmail = (): string | null => {
    return localStorage.getItem('remember_email')
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    captchaCode,

    // Getters
    isLoggedIn,
    isAdmin,
    currentUser,
    userDisplayName,
    userAvatar,

    // Actions
    login,
    register,
    logout,
    initAuth,
    clearError,
    updateProfile,
    changePassword,
    forgotPassword,
    setUser,
    setToken,
    generateCaptcha,
    validateCaptcha,
    getCaptcha,
    getRememberedEmail,
  }
})

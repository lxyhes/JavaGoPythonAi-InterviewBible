import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const currentUser = computed(() => user.value)

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

  // Mock login - replace with actual API call
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock validation
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        const mockUser: User = {
          id: '1',
          username: 'TestUser',
          email: credentials.email,
          avatar: undefined,
          role: 'user',
          createdAt: new Date().toISOString(),
        }
        
        user.value = mockUser
        token.value = 'mock_jwt_token_' + Date.now()
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return true
      } else {
        error.value = '邮箱或密码错误'
        return false
      }
    } catch (err) {
      error.value = '登录失败，请稍后重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Mock register - replace with actual API call
  const register = async (data: RegisterData): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock validation
      if (data.password !== data.confirmPassword) {
        error.value = '两次输入的密码不一致'
        return false
      }

      const mockUser: User = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        avatar: undefined,
        role: 'user',
        createdAt: new Date().toISOString(),
      }
      
      user.value = mockUser
      token.value = 'mock_jwt_token_' + Date.now()
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return true
    } catch (err) {
      error.value = '注册失败，请稍后重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  // Initialize auth state from localStorage
  const initAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch {
        logout()
      }
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user.value) return false

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return true
    } catch {
      return false
    }
  }

  // Change password
  const changePassword = async (oldPassword: string, _newPassword: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock validation
      if (oldPassword !== 'password') {
        error.value = '原密码错误'
        return false
      }
      
      return true
    } catch {
      error.value = '修改密码失败'
      return false
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isLoggedIn,
    isAdmin,
    currentUser,
    
    // Actions
    login,
    register,
    logout,
    initAuth,
    clearError,
    updateProfile,
    changePassword,
    setUser,
    setToken,
  }
})

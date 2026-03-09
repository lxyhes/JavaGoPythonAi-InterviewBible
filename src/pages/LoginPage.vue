<template>
  <div class="login-page">
    <a-row justify="center" align="middle" class="login-container">
      <a-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
        <a-card class="login-card" :bordered="false">
          <div class="login-header">
            <a-avatar :size="64" :style="{ background: 'var(--primary-gradient)' }">
              <UserOutlined />
            </a-avatar>
            <h1 class="login-title">{{ t('auth.welcome') }}</h1>
            <p class="login-subtitle">{{ t('auth.subtitle') }}</p>
          </div>

          <a-tabs v-model:activeKey="activeTab" centered class="login-tabs">
            <a-tab-pane key="login" :tab="t('auth.login')">
              <a-form
                :model="loginForm"
                :rules="loginRules"
                layout="vertical"
                @finish="handleLogin"
              >
                <a-form-item name="email" :label="t('auth.email')">
                  <a-input
                    v-model:value="loginForm.email"
                    size="large"
                    :placeholder="t('auth.emailPlaceholder')"
                  >
                    <template #prefix>
                      <MailOutlined />
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item name="password" :label="t('auth.password')">
                  <a-input-password
                    v-model:value="loginForm.password"
                    size="large"
                    :placeholder="t('auth.passwordPlaceholder')"
                  >
                    <template #prefix>
                      <LockOutlined />
                    </template>
                  </a-input-password>
                </a-form-item>

                <a-form-item>
                  <a-flex justify="space-between" align="center">
                    <a-checkbox v-model:checked="rememberMe">
                      {{ t('auth.rememberMe') }}
                    </a-checkbox>
                    <a-button type="link" @click="showForgotPassword = true">
                      {{ t('auth.forgotPassword') }}
                    </a-button>
                  </a-flex>
                </a-form-item>

                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    block
                    :loading="authStore.isLoading"
                  >
                    {{ t('auth.login') }}
                  </a-button>
                </a-form-item>

                <a-alert
                  v-if="authStore.error"
                  :message="authStore.error"
                  type="error"
                  show-icon
                  closable
                  @close="authStore.clearError"
                  style="margin-bottom: 16px"
                />
              </a-form>
            </a-tab-pane>

            <a-tab-pane key="register" :tab="t('auth.register')">
              <a-form
                :model="registerForm"
                :rules="registerRules"
                layout="vertical"
                @finish="handleRegister"
              >
                <a-form-item name="username" :label="t('auth.username')">
                  <a-input
                    v-model:value="registerForm.username"
                    size="large"
                    :placeholder="t('auth.usernamePlaceholder')"
                  >
                    <template #prefix>
                      <UserOutlined />
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item name="email" :label="t('auth.email')">
                  <a-input
                    v-model:value="registerForm.email"
                    size="large"
                    :placeholder="t('auth.emailPlaceholder')"
                  >
                    <template #prefix>
                      <MailOutlined />
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item name="password" :label="t('auth.password')">
                  <a-input-password
                    v-model:value="registerForm.password"
                    size="large"
                    :placeholder="t('auth.passwordPlaceholder')"
                  >
                    <template #prefix>
                      <LockOutlined />
                    </template>
                  </a-input-password>
                </a-form-item>

                <a-form-item name="confirmPassword" :label="t('auth.confirmPassword')">
                  <a-input-password
                    v-model:value="registerForm.confirmPassword"
                    size="large"
                    :placeholder="t('auth.confirmPasswordPlaceholder')"
                  >
                    <template #prefix>
                      <LockOutlined />
                    </template>
                  </a-input-password>
                </a-form-item>

                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    block
                    :loading="authStore.isLoading"
                  >
                    {{ t('auth.register') }}
                  </a-button>
                </a-form-item>

                <a-alert
                  v-if="authStore.error"
                  :message="authStore.error"
                  type="error"
                  show-icon
                  closable
                  @close="authStore.clearError"
                  style="margin-bottom: 16px"
                />
              </a-form>
            </a-tab-pane>
          </a-tabs>

          <a-divider>{{ t('auth.or') }}</a-divider>

          <a-space direction="vertical" style="width: 100%">
            <a-button block size="large" @click="demoLogin">
              <ExperimentOutlined />
              {{ t('auth.demoLogin') }}
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <!-- Forgot Password Modal -->
    <a-modal
      v-model:open="showForgotPassword"
      :title="t('auth.forgotPassword')"
      :ok-text="t('auth.sendResetLink')"
      :cancel-text="t('common.cancel')"
      @ok="handleForgotPassword"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('auth.email')">
          <a-input
            v-model:value="forgotPasswordEmail"
            :placeholder="t('auth.emailPlaceholder')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ExperimentOutlined,
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useI18nStore } from '@/stores/i18n'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const authStore = useAuthStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const activeTab = ref('login')
const rememberMe = ref(false)
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')

const loginForm = reactive({
  email: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loginRules: Record<string, Rule[]> = {
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('auth.passwordMinLength'), trigger: 'blur' },
  ],
}

const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (value !== registerForm.password) {
    return Promise.reject(t('auth.passwordMismatch'))
  }
  return Promise.resolve()
}

const registerRules: Record<string, Rule[]> = {
  username: [
    { required: true, message: t('auth.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: t('auth.usernameLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('auth.passwordMinLength'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: t('auth.confirmPasswordRequired'), trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  const success = await authStore.login({
    email: loginForm.email,
    password: loginForm.password,
  })

  if (success) {
    router.push('/dashboard')
  }
}

const handleRegister = async () => {
  const success = await authStore.register({
    username: registerForm.username,
    email: registerForm.email,
    password: registerForm.password,
    confirmPassword: registerForm.confirmPassword,
  })

  if (success) {
    router.push('/dashboard')
  }
}

const demoLogin = async () => {
  const success = await authStore.login({
    email: 'test@example.com',
    password: 'password',
  })

  if (success) {
    router.push('/dashboard')
  }
}

const handleForgotPassword = () => {
  // Handle forgot password logic
  showForgotPassword.value = false
  forgotPasswordEmail.value = ''
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-container {
  width: 100%;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.login-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 24px;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
}

:deep(.ant-btn-primary) {
  border-radius: 8px;
  height: 44px;
  font-size: 1rem;
}

@media (max-width: 576px) {
  .login-page {
    padding: 16px;
  }

  .login-card {
    border-radius: 12px;
  }
}
</style>

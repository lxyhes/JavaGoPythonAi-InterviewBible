<template>
  <div class="login-page">
    <!-- 左侧装饰区域 -->
    <div class="login-left">
      <div class="login-left-content">
        <div class="brand">
          <div class="brand-logo">
            <CodeOutlined />
          </div>
          <h1 class="brand-name">面试宝典</h1>
        </div>
        <h2 class="slogan">掌握技术，<br>成就未来</h2>
        <p class="description">
          全面的技术面试题库，涵盖 Java、Go、Python、AI 等热门领域
        </p>
        <div class="features">
          <div class="feature-item">
            <CheckCircleFilled class="feature-icon" />
            <span>海量真题，持续更新</span>
          </div>
          <div class="feature-item">
            <CheckCircleFilled class="feature-icon" />
            <span>智能练习，高效备考</span>
          </div>
          <div class="feature-item">
            <CheckCircleFilled class="feature-icon" />
            <span>社区互助，共同进步</span>
          </div>
        </div>
      </div>
      <div class="login-left-bg">
        <div class="bg-circle bg-circle-1"></div>
        <div class="bg-circle bg-circle-2"></div>
        <div class="bg-circle bg-circle-3"></div>
      </div>
    </div>

    <!-- 右侧表单区域 -->
    <div class="login-right">
      <div class="login-form-container">
        <div class="form-header">
          <h2 class="form-title">{{ activeTab === 'login' ? '欢迎回来' : '创建账号' }}</h2>
          <p class="form-subtitle">
            {{ activeTab === 'login' ? '登录您的账户继续学习' : '注册新账户开始您的面试之旅' }}
          </p>
        </div>

        <a-tabs v-model:activeKey="activeTab" centered class="login-tabs">
          <a-tab-pane key="login" :tab="t('auth.login')">
            <a-form
              :model="loginForm"
              :rules="loginRules"
              layout="vertical"
              @finish="handleLogin"
              class="auth-form"
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

              <a-form-item name="captcha" :label="t('auth.captcha')">
                <a-space style="width: 100%">
                  <a-input
                    v-model:value="loginForm.captcha"
                    size="large"
                    :placeholder="t('auth.captchaPlaceholder')"
                    style="flex: 1"
                  >
                    <template #prefix>
                      <SafetyOutlined />
                    </template>
                  </a-input>
                  <div class="captcha-display" @click="refreshCaptcha">
                    <canvas ref="loginCaptchaCanvas" width="100" height="40"></canvas>
                  </div>
                </a-space>
              </a-form-item>

              <a-form-item>
                <a-flex justify="space-between" align="center">
                  <a-checkbox v-model:checked="loginForm.rememberMe">
                    {{ t('auth.rememberMe') }}
                  </a-checkbox>
                  <a-button type="link" @click="showForgotPassword = true" class="forgot-link">
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
                  class="submit-btn"
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
              class="auth-form"
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

              <a-form-item name="captcha" :label="t('auth.captcha')">
                <a-space style="width: 100%">
                  <a-input
                    v-model:value="registerForm.captcha"
                    size="large"
                    :placeholder="t('auth.captchaPlaceholder')"
                    style="flex: 1"
                  >
                    <template #prefix>
                      <SafetyOutlined />
                    </template>
                  </a-input>
                  <div class="captcha-display" @click="refreshCaptcha">
                    <canvas ref="registerCaptchaCanvas" width="100" height="40"></canvas>
                  </div>
                </a-space>
              </a-form-item>

              <a-form-item>
                <a-button
                  type="primary"
                  html-type="submit"
                  size="large"
                  block
                  :loading="authStore.isLoading"
                  class="submit-btn"
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

        <a-divider class="divider">
          <span class="divider-text">{{ t('auth.or') }}</span>
        </a-divider>

        <a-button block size="large" @click="demoLogin" class="demo-btn">
          <ExperimentOutlined />
          {{ t('auth.demoLogin') }}
        </a-button>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <a-modal
      v-model:open="showForgotPassword"
      :title="t('auth.forgotPassword')"
      :ok-text="t('auth.sendResetLink')"
      :cancel-text="t('common.cancel')"
      @ok="handleForgotPassword"
      :confirm-loading="forgotPasswordLoading"
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
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  CodeOutlined,
  CheckCircleFilled,
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useI18nStore } from '@/stores/i18n'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const authStore = useAuthStore()
const i18nStore = useI18nStore()
const t = i18nStore.t

const activeTab = ref('login')
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')
const forgotPasswordLoading = ref(false)
const loginCaptchaCanvas = ref<HTMLCanvasElement | null>(null)
const registerCaptchaCanvas = ref<HTMLCanvasElement | null>(null)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false,
  captcha: '',
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  captcha: '',
})

onMounted(() => {
  const rememberedEmail = authStore.getRememberedEmail()
  if (rememberedEmail) {
    loginForm.email = rememberedEmail
    loginForm.rememberMe = true
  }
  nextTick(() => {
    drawCaptcha(loginCaptchaCanvas.value)
    drawCaptcha(registerCaptchaCanvas.value)
  })
})

watch(activeTab, () => {
  nextTick(() => {
    if (activeTab.value === 'login') {
      drawCaptcha(loginCaptchaCanvas.value)
    } else {
      drawCaptcha(registerCaptchaCanvas.value)
    }
  })
})

const drawCaptcha = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const code = authStore.generateCaptcha()

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    ctx.beginPath()
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.stroke()
  }

  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    ctx.beginPath()
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.font = 'bold 24px Arial'
  ctx.textBaseline = 'middle'
  
  for (let i = 0; i < code.length; i++) {
    ctx.save()
    ctx.translate(20 + i * 22, 20)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.fillStyle = `rgb(${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, ${Math.random() * 100 + 50})`
    ctx.fillText(code[i], 0, 0)
    ctx.restore()
  }
}

const refreshCaptcha = () => {
  if (activeTab.value === 'login') {
    drawCaptcha(loginCaptchaCanvas.value)
    loginForm.captcha = ''
  } else {
    drawCaptcha(registerCaptchaCanvas.value)
    registerForm.captcha = ''
  }
}

const loginRules: Record<string, Rule[]> = {
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('auth.passwordMinLength'), trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: t('auth.captchaRequired'), trigger: 'blur' },
    { len: 4, message: '验证码为4位字符', trigger: 'blur' },
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
  captcha: [
    { required: true, message: t('auth.captchaRequired'), trigger: 'blur' },
    { len: 4, message: '验证码为4位字符', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  const success = await authStore.login({
    email: loginForm.email,
    password: loginForm.password,
    rememberMe: loginForm.rememberMe,
    captcha: loginForm.captcha,
  })

  if (success) {
    message.success(t('auth.loginSuccess'))
    router.push('/dashboard')
  } else {
    refreshCaptcha()
  }
}

const handleRegister = async () => {
  const success = await authStore.register({
    username: registerForm.username,
    email: registerForm.email,
    password: registerForm.password,
    confirmPassword: registerForm.confirmPassword,
    captcha: registerForm.captcha,
  })

  if (success) {
    message.success(t('auth.registerSuccess'))
    router.push('/dashboard')
  } else {
    refreshCaptcha()
  }
}

const demoLogin = async () => {
  const success = await authStore.login({
    email: 'test@example.com',
    password: 'password',
  })

  if (success) {
    message.success(t('auth.loginSuccess'))
    router.push('/dashboard')
  }
}

const handleForgotPassword = async () => {
  if (!forgotPasswordEmail.value) {
    message.error(t('auth.emailRequired'))
    return
  }
  
  forgotPasswordLoading.value = true
  const success = await authStore.forgotPassword(forgotPasswordEmail.value)
  forgotPasswordLoading.value = false
  
  if (success) {
    message.success('重置链接已发送到您的邮箱')
    showForgotPassword.value = false
    forgotPasswordEmail.value = ''
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  background: #fff;
  overflow: hidden;
}

/* 左侧装饰区域 */
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.login-left-content {
  position: relative;
  z-index: 2;
  max-width: 420px;
  color: #fff;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #00d4aa 0%, #00a8e8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #fff;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #a0aec0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slogan {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 24px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #e2e8f0;
}

.feature-icon {
  color: #00d4aa;
  font-size: 16px;
}

/* 背景装饰 */
.login-left-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.bg-circle-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #00d4aa 0%, #00a8e8 100%);
  top: -200px;
  right: -200px;
}

.bg-circle-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #00a8e8 0%, #00d4aa 100%);
  bottom: -100px;
  left: -100px;
}

.bg-circle-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: 50%;
  right: 10%;
}

/* 右侧表单区域 */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 40px;
  background: #f8fafc;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-header {
  text-align: center;
  margin-bottom: 20px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.form-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.login-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 20px;
}

.login-tabs :deep(.ant-tabs-tab) {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  padding: 10px 20px;
}

.login-tabs :deep(.ant-tabs-tab-active) {
  color: #1e293b;
}

.login-tabs :deep(.ant-tabs-ink-bar) {
  background: linear-gradient(135deg, #00d4aa 0%, #00a8e8 100%);
  height: 2px;
  border-radius: 2px;
}

.auth-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.auth-form :deep(.ant-form-item-label) {
  font-weight: 500;
  color: #374151;
  padding-bottom: 4px;
}

.auth-form :deep(.ant-input-affix-wrapper) {
  border-radius: 10px;
  border-color: #e2e8f0;
  padding: 10px 14px;
  transition: all 0.3s;
}

.auth-form :deep(.ant-input-affix-wrapper:hover),
.auth-form :deep(.ant-input-affix-wrapper-focused) {
  border-color: #00d4aa;
  box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
}

.auth-form :deep(.ant-input) {
  font-size: 14px;
}

.auth-form :deep(.ant-input-prefix) {
  color: #94a3b8;
  margin-right: 10px;
}

.captcha-display {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
}

.captcha-display:hover {
  border-color: #00d4aa;
  box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
}

.forgot-link {
  color: #00a8e8;
  font-weight: 500;
  padding: 0;
  font-size: 13px;
}

.forgot-link:hover {
  color: #00d4aa;
}

.submit-btn {
  border-radius: 10px;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #00d4aa 0%, #00a8e8 100%);
  border: none;
  box-shadow: 0 4px 14px rgba(0, 212, 170, 0.4);
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 212, 170, 0.5);
}

.divider {
  margin: 20px 0;
}

.divider :deep(.ant-divider-inner-text) {
  color: #94a3b8;
  font-size: 13px;
}

.divider-text {
  padding: 0 12px;
}

.demo-btn {
  border-radius: 10px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  border-color: #e2e8f0;
  color: #64748b;
  transition: all 0.3s;
}

.demo-btn:hover {
  border-color: #00d4aa;
  color: #00d4aa;
  background: rgba(0, 212, 170, 0.05);
}

/* 响应式 */
@media (max-width: 1024px) {
  .login-left {
    display: none;
  }
  
  .login-right {
    padding: 24px;
  }
  
  .login-form-container {
    padding: 32px 24px;
  }
}

@media (max-width: 576px) {
  .login-right {
    padding: 16px;
    background: #fff;
  }
  
  .login-form-container {
    padding: 24px 16px;
    box-shadow: none;
    border-radius: 0;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .slogan {
    font-size: 36px;
  }
}
</style>

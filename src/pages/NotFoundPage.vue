<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code">404</div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <div class="actions">
        <button class="btn btn-primary" @click="goHome">
          <span class="icon">🏠</span>
          返回首页
        </button>
        <button class="btn btn-secondary" @click="goBack">
          <span class="icon">←</span>
          返回上一页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 2rem;
}

.content {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
}

.icon {
  font-size: 1.25rem;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

<template>
  <div class="home-page">
    <header class="hero">
      <h1>🎯 IT面试宝典</h1>
      <p>全面覆盖前端、后端、数据库、算法等核心技术</p>
    </header>

    <nav class="main-nav">
      <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-card">
        <span class="icon">{{ item.icon }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </router-link>
    </nav>

    <footer class="home-footer">
      <p>💡 提示：使用快捷键 Ctrl+K 快速搜索</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const navItems = [
  { path: '/frontend', icon: '📚', title: '前端开发', desc: 'HTML/CSS/JavaScript、React、Vue、Webpack' },
  { path: '/backend', icon: '☕', title: '后端开发', desc: 'Java、Python、Go、Node.js、微服务' },
  { path: '/database', icon: '🗄️', title: '数据库', desc: 'MySQL、Redis、MongoDB' },
  { path: '/algorithm', icon: '🧮', title: '算法', desc: '数据结构、算法思想、LeetCode' },
  { path: '/system-design', icon: '🏗️', title: '系统设计', desc: '高并发、分布式、微服务架构' },
  { path: '/devops', icon: '🚀', title: 'DevOps', desc: 'Docker、Kubernetes、CI/CD' },
  { path: '/network', icon: '🌐', title: '计算机网络', desc: 'TCP/IP、HTTP/HTTPS、Socket编程' },
  { path: '/os', icon: '💻', title: '操作系统', desc: '进程线程、内存管理、Linux' },
  { path: '/ai', icon: '🤖', title: '人工智能', desc: '机器学习、深度学习、大语言模型' },
]
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 60px 40px;
  background: var(--bg-color);
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  letter-spacing: -0.03em;
}

.hero p {
  font-size: 1.375rem;
  color: var(--text-tertiary);
  max-width: 600px;
  margin: 0 auto;
}

.main-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto 60px;
}

.nav-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 40px;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.nav-card .icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  display: block;
}

.nav-card h3 {
  font-size: 1.625rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.nav-card p {
  color: var(--text-tertiary);
  font-size: 1rem;
  line-height: 1.6;
}

.home-footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

@media (max-width: 768px) {
  .home-page {
    padding: 40px 20px;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero p {
    font-size: 1.125rem;
  }

  .nav-card {
    padding: 28px;
  }
}
</style>

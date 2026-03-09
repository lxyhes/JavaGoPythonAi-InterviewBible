# IT面试宝典

全面覆盖前端、后端、数据库、算法等核心技术的面试题整理。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📁 项目结构

```
interview-guide/
├── src/
│   ├── components/     # 公共组件
│   │   ├── Sidebar.vue         # 侧边栏导航
│   │   ├── BackToTop.vue       # 回到顶部
│   │   ├── MobileMenuBtn.vue   # 移动端菜单按钮
│   │   ├── ReadingProgress.vue # 阅读进度条
│   │   └── ContentSection.vue  # 内容区块
│   ├── composables/    # 组合式函数
│   ├── layouts/        # 布局组件
│   ├── pages/          # 页面组件
│   │   ├── HomePage.vue
│   │   ├── FrontendPage.vue
│   │   └── BackendPage.vue
│   ├── stores/         # Pinia 状态管理
│   │   └── app.ts
│   ├── assets/         # 静态资源
│   │   └── styles/
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript 类型
│   ├── router/         # 路由配置
│   ├── App.vue
│   └── main.ts
├── public/             # 公共资源
├── sections/           # 面试题内容片段
│   ├── frontend/
│   ├── backend/
│   ├── database/
│   └── ...
├── docs/               # 文档
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🛠 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理方案
- **ESLint + Prettier** - 代码规范

## ✨ 功能特性

- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🌙 **暗黑模式** - 支持亮色/暗色主题切换
- 📖 **阅读进度** - 顶部进度条 + 回到顶部按钮
- 🧭 **大纲导航** - 自动高亮当前章节
- ⚡ **懒加载** - 内容按需加载，优化性能
- 🎨 **优雅动画** - 流畅的过渡动画效果
- ⌨️ **快捷键** - 支持键盘快捷键操作

## 📝 内容分类

### 前端开发
- HTML/CSS 基础
- JavaScript 核心
- JS 进阶高频
- React / Vue
- Webpack/Vite
- 性能优化
- 项目实战

### 后端开发
- Java / Python / Go / Node.js
- 微服务架构
- 项目实战

### 其他
- 数据库 (MySQL, Redis, MongoDB)
- 算法与数据结构
- 系统设计
- DevOps

## 🔧 开发规范

### 代码风格
- 使用 ESLint + Prettier 保持代码风格一致
- 提交前运行 `npm run lint` 检查代码
- 使用 `npm run format` 格式化代码

### Git 提交规范
```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具相关
```

## 📄 许可证

[MIT](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

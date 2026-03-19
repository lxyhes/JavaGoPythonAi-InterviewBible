# IT 面试宝典

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4+-green.svg" alt="Vue 3">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-blue.svg" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-17-orange.svg" alt="Java 17">
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
</p>

全面覆盖前端、后端、数据库、算法等核心技术的面试题整理平台，集成 AI 智能解释功能。

## 🚀 快速开始

### 环境要求

- **前端**: Node.js >= 18.0.0
- **后端**: Java 17+, Maven 3.6+
- **数据库**: H2 (开发) / MySQL (生产)

### 1. 克隆项目

```bash
git clone <repository-url>
cd JavaGoPythonAi-InterviewBible
```

### 2. 启动后端服务

```bash
cd backend

# 编译
mvn clean compile

# 启动服务
mvn spring-boot:run
```

后端服务将在 http://localhost:8080 启动

### 3. 启动前端开发服务器

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:5173 启动

## 📁 项目结构

```
JavaGoPythonAi-InterviewBible/
├── backend/                    # Java 后端服务
│   ├── src/main/java/
│   │   └── com/interview/
│   │       ├── controller/     # REST API 控制器
│   │       ├── entity/         # 数据实体
│   │       ├── repository/     # 数据访问层
│   │       ├── service/        # 业务逻辑层
│   │       ├── security/       # JWT 认证
│   │       └── iflow/          # iFlow SDK 集成
│   ├── src/main/resources/
│   │   └── application.yml     # 配置文件
│   └── pom.xml                 # Maven 配置
│
├── frontend/                   # Vue 3 前端应用
│   ├── src/
│   │   ├── components/         # Vue 组件
│   │   ├── pages/              # 页面组件
│   │   ├── stores/             # Pinia 状态管理
│   │   ├── router/             # 路由配置
│   │   ├── services/           # API 服务
│   │   ├── composables/        # 组合式函数
│   │   ├── data/               # 面试题数据
│   │   └── utils/              # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🛠 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4+ | 渐进式 JavaScript 框架 |
| TypeScript | 5.3+ | 类型安全的 JavaScript |
| Vite | 5.0+ | 下一代前端构建工具 |
| Vue Router | 4.2+ | 官方路由管理器 |
| Pinia | 2.1+ | 状态管理方案 |
| Ant Design Vue | 4.2+ | UI 组件库 |
| Phosphor Icons | 2.2+ | 图标库 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 17 | 编程语言 |
| Spring Boot | 3.2+ | 应用框架 |
| Spring Security | 6.2+ | 安全框架 |
| Spring Data JPA | 3.2+ | 数据访问 |
| JWT | 0.12+ | 认证令牌 |
| H2 / MySQL | - | 数据库 |
| WebSocket | 1.5+ | 实时通信 |

## ✨ 功能特性

### 前端功能

- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🌙 **暗黑模式** - 支持亮色/暗色主题切换
- 📖 **阅读进度** - 顶部进度条 + 回到顶部按钮
- 🧭 **大纲导航** - 自动高亮当前章节
- ⚡ **懒加载** - 内容按需加载，优化性能
- 🎨 **优雅动画** - 流畅的过渡动画效果
- 🔍 **智能搜索** - 快速查找面试题

### 后端功能

- 🔐 **JWT 认证** - 安全的用户认证机制
- 🤖 **AI 解释** - 集成 iFlow SDK 智能解释面试题
- 📝 **题目生成** - AI 自动生成面试题
- 💻 **代码分析** - 智能分析代码问题
- 📊 **学习记录** - 追踪学习进度
- 👥 **社区功能** - 帖子评论互动

## 📝 内容分类

### 前端开发
- HTML/CSS 基础
- JavaScript 核心与进阶
- React / Vue 框架
- 前端工程化 (Webpack/Vite)
- 性能优化

### 后端开发
- Java / Python / Go / Node.js
- 微服务架构
- 分布式系统
- 项目实战

### 其他
- 数据库 (MySQL, Redis, MongoDB)
- 算法与数据结构
- 系统设计
- DevOps & 网络
- 操作系统

## 🔧 开发规范

### 前端开发

```bash
# 代码检查
cd frontend && npm run lint

# 代码格式化
cd frontend && npm run format

# 类型检查
cd frontend && npm run type-check
```

### 后端开发

```bash
# 编译项目
cd backend && mvn clean compile

# 运行测试
cd backend && mvn test

# 打包
cd backend && mvn clean package
```

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

## 🔌 API 接口

### 认证接口

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

### 面试题接口

```http
GET    /api/questions              # 获取题目列表
GET    /api/questions/{id}         # 获取题目详情
POST   /api/questions/{id}/submit  # 提交答案
POST   /api/questions/explain      # AI 解释题目
```

### 学习记录接口

```http
GET    /api/learning/records       # 获取学习记录
POST   /api/learning/progress      # 更新学习进度
GET    /api/learning/stats         # 学习统计
```

更多 API 详见后端代码。

## 🐳 Docker 部署 (可选)

```bash
# 构建镜像
docker build -t interview-guide .

# 运行容器
docker run -p 8080:8080 interview-guide
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

[MIT](LICENSE) © IT Interview Guide Team

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Ant Design Vue](https://www.antdv.com/)
- [iFlow](https://iflow.ai/)

---

<p align="center">
  如果这个项目对你有帮助，请给个 ⭐️ Star！
</p>

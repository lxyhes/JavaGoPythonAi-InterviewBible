# Interview Guide Backend

面试宝典后端服务，集成 iFlow SDK，提供 AI 驱动的面试题解释、代码分析和题目生成功能。

## 技术栈

- Java 17
- Spring Boot 3.2.0
- WebSocket (Java-WebSocket)
- Jackson (JSON 处理)
- Lombok
- H2 Database (开发环境)

## iFlow SDK 集成

本项目集成了 iFlow CLI 的 ACP (Agent Client Protocol) 协议，通过 WebSocket 与 iFlow CLI 进行通信。

### 前置要求

1. 安装 Node.js (>= 16)
2. 安装 iFlow CLI:
   ```bash
   npm install -g @iflow-ai/iflow-cli
   ```

### 启动 iFlow ACP Server

```bash
# 本地模式
iflow --experimental-acp

# 指定端口
iflow --experimental-acp --port 8090
```

## 项目结构

```
backend/
├── src/main/java/com/interview/
│   ├── InterviewGuideApplication.java    # 启动类
│   ├── controller/
│   │   └── InterviewController.java      # REST API
│   ├── model/
│   │   ├── ApiResponse.java              # 统一响应
│   │   └── InterviewRequest.java         # 请求 DTO
│   └── iflow/                            # iFlow SDK
│       ├── client/
│       │   └── IFlowWebSocketClient.java # WebSocket 客户端
│       ├── config/
│       │   ├── IFlowAutoConfiguration.java
│       │   └── IFlowProperties.java
│       ├── model/
│       │   ├── IFlowMessage.java
│       │   ├── MessageType.java
│       │   ├── StopReason.java
│       │   └── ToolCallStatus.java
│       └── service/
│           └── IFlowClient.java          # iFlow 客户端服务
├── src/main/resources/
│   └── application.yml                   # 配置文件
└── pom.xml                               # Maven 配置
```

## 快速开始

### 1. 编译项目

```bash
cd backend
mvn clean compile
```

### 2. 启动 iFlow CLI

```bash
iflow --experimental-acp --port 8090
```

### 3. 启动后端服务

```bash
mvn spring-boot:run
```

服务将在 http://localhost:8080 启动

## API 接口

### 1. 解释面试题

```http
POST /api/interview/explain
Content-Type: application/json

{
  "question": "Java 中的 HashMap 原理是什么？",
  "category": "Java"
}
```

### 2. 生成面试题

```http
POST /api/interview/generate
Content-Type: application/json

{
  "topic": "Spring Boot",
  "count": 5
}
```

### 3. 分析代码

```http
POST /api/interview/analyze-code
Content-Type: application/json

{
  "filePath": "src/main/java/UserService.java",
  "codeContent": "public class UserService { ... }"
}
```

### 4. 通用 AI 查询

```http
POST /api/interview/query
Content-Type: application/json

{
  "question": "解释微服务架构的优势"
}
```

### 5. 健康检查

```http
GET /api/interview/health
```

## 配置说明

在 `application.yml` 中配置 iFlow SDK:

```yaml
iflow:
  # WebSocket URL
  url: ws://localhost:8090/acp

  # 连接超时（秒）
  connection-timeout: 30

  # 读取超时（秒）
  read-timeout: 600

  # 自动启动 iFlow CLI
  auto-start-process: false

  # CLI 路径
  cli-path: iflow
```

## 使用示例

```java
@Autowired
private IFlowClient iflowClient;

// 解释面试题
String explanation = iflowClient
    .explainInterviewQuestion("HashMap 原理", "Java")
    .get();

// 生成面试题
String questions = iflowClient
    .generateInterviewQuestions("Spring Boot", 5)
    .get();

// 分析代码
String analysis = iflowClient
    .analyzeCode("UserService.java", codeContent)
    .get();

// 通用查询
String response = iflowClient
    .query("解释 JVM 内存模型")
    .get();
```

## 消息类型

iFlow SDK 支持以下消息类型:

- `ASSISTANT_MESSAGE` - AI 助手文本响应
- `TOOL_CALL` - 工具调用消息
- `PLAN` - 任务计划消息
- `TASK_FINISH` - 任务完成消息
- `USER_MESSAGE` - 用户消息
- `SYSTEM_MESSAGE` - 系统消息
- `ERROR` - 错误消息

## 许可证

MIT

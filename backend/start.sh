#!/bin/bash

# 面试宝典后端启动脚本
# 自动杀掉占用 8080 端口的进程

echo "========================================"
echo "  面试宝典后端服务启动脚本"
echo "========================================"

# 检查并杀掉占用 8080 端口的进程
echo ""
echo "检查端口 8080 占用情况..."
PID=$(lsof -ti:8080 2>/dev/null)

if [ -n "$PID" ]; then
    echo "发现端口 8080 被进程 $PID 占用，正在终止..."
    kill -9 $PID 2>/dev/null
    sleep 2
    echo "进程已终止"
else
    echo "端口 8080 未被占用"
fi

# 杀掉所有 Java 进程（可选，如果需要）
# echo "清理其他 Java 进程..."
# pkill -9 java 2>/dev/null

echo ""
echo "启动后端服务..."
echo "========================================"

# 进入项目目录并启动
cd "$(dirname "$0")"
mvn spring-boot:run

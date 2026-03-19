# Oracle 数据库 Docker 安装教程

## 环境要求

- Docker 已安装并运行
- 至少 4GB 可用内存（Oracle 需要较大内存）
- 至少 10GB 可用磁盘空间

## 步骤 1：检查 Docker 状态

```bash
# 检查 Docker 版本
docker --version

# 检查 Docker 是否运行
docker info

# 查看现有容器
docker ps -a
```

## 步骤 2：选择 Oracle 镜像

Oracle 官方提供了几种 Docker 镜像选择：

### 选项 A：Oracle XE (Express Edition) - 推荐
- 免费使用
- 适合开发和测试
- 资源占用较少

### 选项 B：Oracle 免费版 (23c Free)
- Oracle 最新免费版本
- 功能更完整

### 选项 C：gvenzl/oracle-xe (社区维护)
- 轻量级，启动快
- 适合 CI/CD 和开发

## 步骤 3：安装 Oracle XE (推荐方案)

### 3.1 拉取镜像

```bash
# 使用 gvenzl 的轻量级 Oracle XE 镜像
docker pull gvenzl/oracle-xe:21-slim
```

### 3.2 运行容器

```bash
# 创建并运行 Oracle 容器
docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -e ORACLE_PASSWORD=your_password \
  -v oracle_data:/opt/oracle/oradata \
  gvenzl/oracle-xe:21-slim
```

参数说明：
- `-d`: 后台运行
- `--name oracle-xe`: 容器名称
- `-p 1521:1521`: 映射 Oracle 端口
- `-e ORACLE_PASSWORD`: 设置密码
- `-v oracle_data`: 数据持久化卷

### 3.3 查看容器日志

```bash
# 查看启动日志
docker logs -f oracle-xe

# 等待看到 "DATABASE IS READY TO USE!" 表示启动完成
```

### 3.4 验证安装

```bash
# 进入容器
docker exec -it oracle-xe bash

# 以 sysdba 身份登录 SQL Plus
sqlplus / as sysdba

# 查看数据库状态
SELECT name, open_mode FROM v$database;

# 查看 PDB 状态
SHOW pdbs;

# 退出
exit
```

## 步骤 4：连接 Oracle 数据库

### 4.1 连接信息

```
主机: localhost 或虚拟机 IP
端口: 1521
服务名: XEPDB1
用户名: SYSTEM
密码: your_password (创建时设置的密码)
```

### 4.2 使用 SQL Plus 连接

```bash
# 在容器内连接
docker exec -it oracle-xe sqlplus SYSTEM/your_password@XEPDB1
```

### 4.3 创建新用户

```sql
-- 连接后创建新用户
CREATE USER myuser IDENTIFIED BY mypassword;
GRANT CREATE SESSION TO myuser;
GRANT CREATE TABLE TO myuser;
GRANT CREATE VIEW TO myuser;
GRANT CREATE SEQUENCE TO myuser;
GRANT CREATE TRIGGER TO myuser;
GRANT UNLIMITED TABLESPACE TO myuser;

-- 授予 DBA 权限（可选）
GRANT DBA TO myuser;
```

## 步骤 5：常用管理命令

```bash
# 启动容器
docker start oracle-xe

# 停止容器
docker stop oracle-xe

# 重启容器
docker restart oracle-xe

# 删除容器
docker rm -f oracle-xe

# 查看容器状态
docker ps | grep oracle

# 进入容器终端
docker exec -it oracle-xe bash

# 备份数据卷
docker run --rm -v oracle_data:/source -v $(pwd):/backup alpine tar czf /backup/oracle_backup.tar.gz -C /source .
```

## 步骤 6：使用 Docker Compose（推荐）

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  oracle:
    image: gvenzl/oracle-xe:21-slim
    container_name: oracle-xe
    ports:
      - "1521:1521"
    environment:
      - ORACLE_PASSWORD=your_password
      - ORACLE_DATABASE=XEPDB1
    volumes:
      - oracle_data:/opt/oracle/oradata
    healthcheck:
      test: ["CMD", "healthcheck.sh"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  oracle_data:
```

运行：

```bash
# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 停止并删除数据
docker-compose down -v
```

## 步骤 7：安装 Oracle 23c Free（可选）

如果你想使用最新的 Oracle 23c：

```bash
# 拉取镜像
docker pull gvenzl/oracle-free:23-slim

# 运行容器
docker run -d \
  --name oracle-free \
  -p 1521:1521 \
  -e ORACLE_PASSWORD=your_password \
  -v oracle_free_data:/opt/oracle/oradata \
  gvenzl/oracle-free:23-slim
```

## 连接字符串示例

### JDBC
```
jdbc:oracle:thin:@localhost:1521/XEPDB1
```

### Python (cx_Oracle)
```python
import cx_Oracle
connection = cx_Oracle.connect("SYSTEM", "your_password", "localhost:1521/XEPDB1")
```

### Node.js (oracledb)
```javascript
const oracledb = require('oracledb');
await oracledb.createConnection({
  user: 'SYSTEM',
  password: 'your_password',
  connectString: 'localhost:1521/XEPDB1'
});
```

## 常见问题

### 1. 容器启动慢
Oracle 初始化需要几分钟，请耐心等待。

### 2. 内存不足
确保分配至少 2GB 内存给 Docker。

### 3. 端口冲突
如果 1521 端口被占用，修改映射：`-p 1522:1521`

### 4. 中文乱码
设置环境变量：
```bash
-e NLS_LANG=AMERICAN_AMERICA.AL32UTF8
```

## 卸载

```bash
# 停止并删除容器
docker stop oracle-xe
docker rm oracle-xe

# 删除镜像
docker rmi gvenzl/oracle-xe:21-slim

# 删除数据卷
docker volume rm oracle_data
```

## 参考链接

- [gvenzl/oracle-xe GitHub](https://github.com/gvenzl/oci-oracle-xe)
- [Oracle Docker 官方文档](https://github.com/oracle/docker-images)

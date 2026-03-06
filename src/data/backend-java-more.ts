import type { QAItem } from './backend'

export const javaMoreQA: QAItem[] = [
  {
    question: 'HashMap 的底层原理是什么？JDK 1.7 和 1.8 的区别？',
    tags: [{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }],
    answer: `**JDK 1.7：数组 + 链表**
- 使用头插法插入链表
- 并发环境下可能产生死循环

**JDK 1.8：数组 + 链表 + 红黑树**
- 使用尾插法
- 链表长度 ≥ 8 转为红黑树
- 红黑树节点 ≤ 6 转回链表

**核心参数：**
- 初始容量：16（2的幂次）
- 负载因子：0.75
- 扩容阈值：capacity * loadFactor

**put 流程：**
1. 计算 key 的 hash 值
2. (n-1) & hash 定位桶位置
3. 无冲突直接放入
4. 有冲突：遍历链表/红黑树，key 相同则覆盖，不同则插入
5. 超过阈值则扩容（2倍）

**为什么用 2 的幂次？**
(n-1) & hash 等价于 hash % n，但位运算更快`
  },
  {
    question: 'ConcurrentHashMap 如何保证线程安全？',
    tags: [{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }],
    answer: `**JDK 1.7：Segment 分段锁**
- 将数据分成 16 个 Segment
- 每个 Segment 继承 ReentrantLock
- 最多支持 16 个线程并发

**JDK 1.8：CAS + synchronized**
- 取消 Segment，使用 Node 数组
- 使用 CAS 初始化或替换节点
- 冲突时使用 synchronized 锁定首节点
- 锁粒度更细，并发度更高

**size 计算：**
- 1.7：遍历所有 Segment 累加
- 1.8：CounterCell 数组，分散热点，最后求和`
  },
  {
    question: 'ArrayList 和 LinkedList 的区别？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `| 特性 | ArrayList | LinkedList |
|------|-----------|------------|
| 底层结构 | 动态数组 | 双向链表 |
| 随机访问 | O(1) | O(n) |
| 插入/删除 | O(n) | O(1) |
| 内存占用 | 较少 | 较多（需要存储指针） |
| 扩容 | 需要（1.5倍） | 不需要 |

**ArrayList 扩容：**
- 默认初始容量 10
- 扩容为原来的 1.5 倍
- 使用 Arrays.copyOf 复制数据

**使用场景：**
- ArrayList：频繁查询、随机访问
- LinkedList：频繁插入删除、实现队列/栈`
  },
  {
    question: '什么是反射？使用场景和优缺点？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**反射定义：**
在运行时动态获取类的信息并操作对象

**核心类：**
- Class：类的元数据
- Field：字段
- Method：方法
- Constructor：构造器

**使用场景：**
- 框架开发（Spring IOC、MyBatis）
- 注解处理
- 动态代理
- 序列化/反序列化
- 单元测试

**优点：**
- 灵活性高，运行时动态操作
- 解耦，提高扩展性

**缺点：**
- 性能开销大
- 破坏封装性
- 编译器无法检查类型安全

**性能优化：**
- 缓存 Method/Field 对象
- setAccessible(true) 跳过权限检查`
  },
  {
    question: '什么是动态代理？JDK 动态代理和 CGLIB 的区别？',
    tags: [{ text: '必问', type: 'must' }],
    answer: `**动态代理：**
在运行时动态生成代理类，增强目标对象功能

**JDK 动态代理：**
- 基于接口实现
- 使用 InvocationHandler
- 生成 $Proxy 类
- 只能代理实现了接口的类

**CGLIB 代理：**
- 基于继承实现
- 使用 MethodInterceptor
- 生成目标类的子类
- 可以代理没有接口的类
- 不能代理 final 类和方法

**Spring 中的使用：**
- 目标类实现接口：默认使用 JDK 代理
- 目标类无接口：使用 CGLIB
- 可配置强制使用 CGLIB

**性能对比：**
- JDK 1.8+ 后性能接近
- CGLIB 生成代理类稍慢，但调用速度相近`
  },
  {
    question: '什么是 NIO？与传统 IO 的区别？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**传统 IO（BIO）：**
- 阻塞式 IO
- 一个连接一个线程
- 简单易用，但并发能力有限

**NIO（New IO / Non-blocking IO）：**
- 非阻塞 IO
- 三大核心组件：
  - Channel（通道）：双向数据传输
  - Buffer（缓冲区）：数据容器
  - Selector（选择器）：多路复用

**核心特点：**
- 单线程处理多个连接
- 事件驱动，有数据才处理
- 适合高并发场景

**AIO（NIO 2）：**
- 异步非阻塞
- 基于回调或 Future
- 操作系统完成 IO 后通知

**使用场景：**
- BIO：连接数少、简单场景
- NIO：连接数多、高并发（Netty）
- AIO：长连接、大文件传输`
  },
  {
    question: '什么是类加载器？双亲委派模型？',
    tags: [{ text: '必问', type: 'must' }],
    answer: `**类加载器类型：**

1. **Bootstrap ClassLoader：**
   - 加载 JAVA_HOME/lib 下的核心类
   - C++ 实现，Java 代码中获取为 null

2. **Extension ClassLoader：**
   - 加载 ext 目录下的扩展类

3. **Application ClassLoader：**
   - 加载 classpath 下的用户类
   - 默认类加载器

4. **自定义 ClassLoader：**
   - 继承 ClassLoader
   - 实现 loadClass 或 findClass

**双亲委派模型：**
\`\`\`
加载请求 → 自定义 → 应用 → 扩展 → 引导
          ← 找到返回 ← ← ← ←
\`\`\`

**优点：**
- 避免类重复加载
- 保证核心类安全（防止核心类被篡改）

**打破双亲委派：**
- Tomcat：Web 应用隔离
- SPI 机制：JDBC、JNDI
- OSGi：模块化热部署`
  },
  {
    question: '什么是 OOM？常见的 OOM 类型及解决方案？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**OOM（Out Of Memory）：**
堆内存不足，无法分配对象

**常见类型：**

1. **Java heap space：**
   - 堆内存不足
   - 解决：增大堆内存、检查内存泄漏

2. **GC overhead limit exceeded：**
   - GC 回收效率低（回收不到 2%）
   - 解决：增大内存、优化代码

3. **PermGen space / Metaspace：**
   - 方法区/元空间不足
   - 解决：增大 PermSize/MetaspaceSize

4. **Unable to create new native thread：**
   - 线程数超过系统限制
   - 解决：限制线程数、使用线程池

5. **Direct buffer memory：**
   - 堆外内存不足
   - 解决：增大 MaxDirectMemorySize

**排查工具：**
- jmap -heap
- jmap -histo
- MAT（Memory Analyzer Tool）
- VisualVM`
  },
  {
    question: '什么是死锁？如何排查和避免？',
    tags: [{ text: '必问', type: 'must' }],
    answer: `**死锁条件（缺一不可）：**
1. 互斥条件
2. 请求与保持
3. 不剥夺条件
4. 循环等待

**排查工具：**
- jstack -l pid：查看线程死锁
- jconsole：图形化查看
- VisualVM：线程分析

**避免方法：**

1. **破坏请求与保持：**
   - 一次性申请所有资源

2. **破坏循环等待：**
   - 按固定顺序获取锁

3. **使用超时：**
   - tryLock(timeout)

4. **死锁检测：**
   - 定时检测，主动释放

**最佳实践：**
- 尽量减少锁的持有时间
- 避免嵌套锁
- 使用并发工具类替代手动加锁`
  },
  {
    question: '什么是 happens-before 原则？',
    tags: [{ text: '重要', type: 'important' }],
    answer: `**定义：**
如果操作 A happens-before 操作 B，那么 A 的结果对 B 可见

**八大规则：**

1. **程序次序规则：**
   同一个线程中，前面的操作 happens-before 后面的

2. **锁规则：**
   unlock happens-before 后续的 lock

3. **volatile 规则：**
   volatile 写 happens-before 后续的 volatile 读

4. **传递性：**
   A happens-before B，B happens-before C，则 A happens-before C

5. **线程启动：**
   Thread.start() happens-before 线程内所有操作

6. **线程终止：**
   线程内所有操作 happens-before 检测到线程终止

7. **中断规则：**
   interrupt() happens-before 检测到中断

8. **对象终结：**
   构造函数执行 happens-before finalize()`
  },
]

export const javaFrameworkQA: QAItem[] = [
  {
    question: 'Spring 中的 BeanFactory 和 ApplicationContext 的区别？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**BeanFactory：**
- 基础 IOC 容器
- 懒加载（使用时才创建 Bean）
- 内存占用小
- 手动注册 BeanPostProcessor

**ApplicationContext：**
- BeanFactory 的子接口
- 预加载（容器启动时创建单例 Bean）
- 继承更多功能：
  - AOP 支持
  - 国际化（MessageSource）
  - 事件传播（ApplicationEvent）
  - 资源加载（ResourceLoader）

**使用建议：**
- 一般使用 ApplicationContext
- 资源受限环境可用 BeanFactory`
  },
  {
    question: 'Spring 中的循环依赖如何解决？',
    tags: [{ text: '必问', type: 'must' }],
    answer: `**循环依赖类型：**
- 构造器循环依赖：无法解决，会报错
- Setter/Field 循环依赖：可以解决

**解决原理（三级缓存）：**

\`\`\`
一级缓存：singletonObjects（完整 Bean）
二级缓存：earlySingletonObjects（提前暴露的 Bean）
三级缓存：singletonFactories（Bean 工厂）
\`\`\`

**解决过程：**
1. A 创建，放入三级缓存
2. A 依赖 B，开始创建 B
3. B 依赖 A，从三级缓存获取 A 的工厂
4. B 创建完成，A 继续创建

**限制：**
- 只支持单例 Bean
- 构造器注入无法解决
- @Async 等代理可能失效`
  },
  {
    question: 'MyBatis 的工作原理？#{} 和 ${} 的区别？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**工作原理：**
1. 读取配置文件，创建 SqlSessionFactory
2. 通过 SqlSessionFactory 创建 SqlSession
3. SqlSession 执行 SQL，通过 Executor
4. MappedStatement 封装 SQL 信息
5. 结果通过 TypeHandler 映射为 Java 对象

**#{} 和 \${} 区别：**

| 特性 | #{} | \${} |
|------|-----|-----|
| 处理方式 | 预编译，占位符 | 字符串替换 |
| SQL 注入 | 安全 | 不安全 |
| 使用场景 | 参数值 | 表名、列名、排序字段 |

**示例：**
\`\`\`java
// #{} 预编译
SELECT * FROM user WHERE id = ?

// \${} 直接替换
SELECT * FROM user ORDER BY \${column}
\`\`\``
  },
  {
    question: 'Spring Cloud 核心组件有哪些？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**服务注册与发现：**
- Eureka、Nacos、Consul

**配置中心：**
- Spring Cloud Config、Nacos、Apollo

**负载均衡：**
- Ribbon（客户端）、Spring Cloud LoadBalancer

**服务调用：**
- Feign（声明式 HTTP 客户端）
- OpenFeign

**服务网关：**
- Zuul、Spring Cloud Gateway

**熔断降级：**
- Hystrix、Resilience4j、Sentinel

**链路追踪：**
- Sleuth + Zipkin、SkyWalking

**消息总线：**
- Spring Cloud Bus`
  },
]


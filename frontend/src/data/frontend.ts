export const htmlCssQA = [
  {
    question: 'CSS 盒模型（Box Model）是什么？标准模型和 IE 模型的区别？',
    answer: `CSS 盒模型将每个 HTML 元素看作一个矩形盒子，从内到外依次是：content（内容）→ padding（内边距）→ border（边框）→ margin（外边距）。

**标准盒模型（content-box）：**
- width/height 只包含 content 区域
- 实际占用宽度 = width + padding-left + padding-right + border-left + border-right

**IE 盒模型（border-box）：**
- width/height 包含 content + padding + border
- 实际占用宽度 = width（已包含 padding 和 border）

可通过 box-sizing 属性切换：
- box-sizing: content-box（默认）
- box-sizing: border-box（推荐，更直观）

实践建议：在项目中全局设置 * { box-sizing: border-box; } 避免计算问题。`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'BFC（块级格式化上下文）是什么？如何触发？有什么应用场景？',
    answer: `BFC（Block Formatting Context）是页面中一个独立的渲染区域，内部元素的布局不会影响外部元素。

**触发条件（任一即可）：**
1. float 不为 none
2. position 为 absolute 或 fixed
3. display 为 inline-block、flex、grid、table-cell
4. overflow 不为 visible（常用 overflow: hidden）

**应用场景：**
1. 清除浮动：父元素设 overflow: hidden 触发 BFC，自动包含浮动子元素
2. 防止 margin 合并：相邻元素 margin 重叠，让其中一个触发 BFC
3. 自适应两栏布局：左侧浮动 + 右侧触发 BFC 实现不重叠

**面试常见追问：** IFC（内联格式化上下文）与 BFC 的区别。`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'CSS 选择器的优先级是怎样的？如何计算？',
    answer: `CSS 选择器优先级从高到低：
1. !important > 内联样式（style=""）> ID选择器 > 类/伪类/属性选择器 > 元素/伪元素选择器 > 通配符

**权重计算规则（四位数表示法）：**
- 内联样式：1,0,0,0
- ID 选择器（#id）：0,1,0,0
- 类/伪类/属性选择器（.class, :hover, [type]）：0,0,1,0
- 元素/伪元素（div, ::before）：0,0,0,1

**示例：**
#nav .item a → 0,1,1,1
div#sidebar .widget h3 → 0,1,1,2

**注意事项：**
- 相同权重时后写的覆盖先写的
- !important 慎用，会破坏正常优先级链
- 继承的样式没有特异性，优先级最低`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'Flex 布局常用属性有哪些？如何实现水平垂直居中？',
    answer: `**容器（父元素）属性：**
- display: flex
- flex-direction: row | column（主轴方向）
- justify-content: center | space-between | flex-start ...（主轴对齐）
- align-items: center | stretch | flex-start ...（交叉轴对齐）
- flex-wrap: nowrap | wrap（换行方式）
- gap: 间距值（子元素之间的间距）

**子元素属性：**
- flex: 缩写属性 = flex-grow, flex-shrink, flex-basis
- flex: 1 → 等比分配剩余空间
- flex: 0 0 200px → 固定宽度不缩放
- align-self: 子元素单独的交叉轴对齐
- order: 调整排序

**水平垂直居中方案：**
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

这是最简洁优雅的居中方案，也是面试高频考点。`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'CSS position 的各个值有什么区别？',
    answer: `**static（默认）：**
- 按正常文档流排列
- top/left 等属性无效

**relative：**
- 相对自身原来位置偏移
- 不脱离文档流，原来位置仍被保留
- 常用作 absolute 定位的参考容器

**absolute：**
- 脱离文档流
- 相对最近的非 static 祖先元素定位
- 如果没有，相对于 html 根元素

**fixed：**
- 脱离文档流
- 相对于浏览器视口定位
- 滚动时位置不变（常用于固定导航栏）

**sticky（粘性定位）：**
- 在 relative 和 fixed 之间切换
- 滚动到阈值前是 relative，到达阈值后变为 fixed
- 常用于表头固定、侧边栏吸附`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'HTML5 语义化标签有哪些？为什么要使用语义化？',
    answer: `**常用语义化标签：**
- <header>: 页头或区块头
- <nav>: 导航
- <main>: 页面主要内容（唯一）
- <article>: 独立内容（可被单独引用）
- <section>: 相关内容的分组
- <aside>: 侧边栏/附加内容
- <footer>: 页脚或区块脚
- <figure> / <figcaption>: 图表及其标题
- <time>: 时间

**为什么使用语义化：**
1. 增强可读性：代码更清晰，便于团队协作维护
2. SEO 优化：搜索引擎能更好理解页面结构
3. 无障碍性：辅助设备（屏幕阅读器）可以正确识别内容
4. 样式与结构分离：不依赖 class 名就能表达含义

**面试加分点：** 知道 <article> 和 <section> 的区别；理解 ARIA 属性在无障碍中的作用。`,
    tags: [{ text: '高频', type: 'frequent' }],
  },
  {
    question: 'CSS 中如何实现响应式设计？',
    answer: `**核心方法：**

1. **媒体查询（Media Queries）：**
\`\`\`css
@media (max-width: 768px) {
  .container { flex-direction: column; }
}
\`\`\`

2. **弹性布局（Flexbox/Grid）：**
- flex-wrap 自动换行
- grid + auto-fit/minmax 自适应列数

3. **相对单位：**
- rem/em 替代 px
- vw/vh 视口单位
- % 百分比
- clamp() 进行范围限制

4. **响应式图片：**
- max-width: 100%
- srcset + sizes 属性
- <picture> 元素

5. **视口设置：**
<meta name="viewport" content="width=device-width, initial-scale=1">

**断点设计原则（Mobile First）：**
- 320px: 小手机
- 768px: 平板
- 1024px: 小桌面
- 1280px: 大桌面`,
    tags: [{ text: '高频', type: 'frequent' }],
  },
  {
    question: '什么是 CSS 预处理器？Sass/Less 有什么区别？',
    answer: `CSS 预处理器是一种脚本语言，扩展了 CSS 的功能，最终编译为标准 CSS。

**核心功能：**
1. 变量：$color: #333（Sass）/ @color: #333（Less）
2. 嵌套：选择器嵌套书写
3. Mixin（混入）：复用代码块
4. 函数与运算
5. 继承/扩展
6. 模块化（@import / @use）

**Sass vs Less 区别：**
| 特性 | Sass/SCSS | Less |
|------|-----------|------|
| 语法 | .scss（推荐，兼容CSS） | .less |
| 变量符号 | $ | @ |
| 编译环境 | Dart Sass（推荐） | 浏览器端/Node.js |
| 功能丰富度 | 更多（@if/@for/Map等） | 相对少 |
| 社区 | 更大 | 较大 |

**现代趋势：**
- CSS 原生变量（Custom Properties）+ PostCSS 逐渐替代预处理器
- Tailwind CSS 等 utility-first 方案兴起
- CSS Modules 解决作用域问题`,
    tags: [{ text: '重要', type: 'important' }],
  },
]

export const jsBasicsQA = [
  {
    question: 'JavaScript 有哪些数据类型？如何判断？',
    answer: `**基本类型（7种）：**
1. number（数字）
2. string（字符串）
3. boolean（布尔值）
4. undefined（未定义）
5. null（空值）
6. symbol（ES6 唯一标识符）
7. bigint（ES2020 任意精度整数）

**引用类型：**
- Object（对象）：包括普通对象、数组、函数、Date、RegExp 等

**类型判断方法：**
1. typeof：判断基本类型（注意 typeof null → "object" 是历史 bug）
2. instanceof：判断引用类型的原型链
3. Object.prototype.toString.call()：最准确的方法
   - [object Array]、[object Date]、[object Null] 等
4. Array.isArray()：专门判断数组

**面试常见坑：**
- typeof NaN → "number"
- typeof null → "object"
- NaN !== NaN → true（NaN 不等于自身）`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: '什么是闭包（Closure）？有什么用途和注意事项？',
    answer: `**定义：**
闭包是一个函数以及其捆绑的周围环境（词法作用域）的引用的组合。简单说就是：能够访问其他函数内部变量的函数。

**形成条件：**
1. 函数嵌套
2. 内部函数引用了外部函数的变量
3. 内部函数被暴露（返回或传递）到外部

**常见用途：**
1. 数据封装/私有变量
2. 模块模式
3. 回调函数/事件处理
4. 柯里化/偏函数
5. 防抖/节流

**示例：**
function counter() {
  let count = 0
  return {
    increment: () => ++count,
    getCount: () => count,
  }
}

**注意事项：**
- 闭包会让变量一直存在于内存中，可能导致内存泄漏
- 循环中使用闭包要注意变量引用问题（let 替代 var 或 IIFE）
- 过度使用闭包会增加内存消耗，影响性能`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: '原型链是什么？如何实现继承？',
    answer: `**原型链机制：**
- 每个对象都有一个 __proto__ 属性指向其构造函数的 prototype
- 访问对象属性时，如果对象本身没有，会沿 __proto__ 向上查找
- 直到找到属性或到达 null 为止，这条链路就是原型链

**核心关系：**
instance.__proto__ === Constructor.prototype
Constructor.prototype.constructor === Constructor
Constructor.__proto__ === Function.prototype

**继承实现方式（从差到好）：**

1. 原型链继承：Child.prototype = new Parent()
   - 缺点：引用类型共享

2. 构造函数继承：Parent.call(this)
   - 缺点：无法继承原型方法

3. 组合继承：原型链 + 构造函数
   - 缺点：Parent 构造函数被调用两次

4. 寄生组合继承（最优）：
   Child.prototype = Object.create(Parent.prototype)

5. ES6 class 继承（推荐）：
   class Child extends Parent { constructor() { super() } }

**面试高频：** 画出完整原型链图，说明 new 操作符的执行过程。`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'var、let、const 有什么区别？',
    answer: `| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 是（值为undefined） | 是（但有暂时性死区TDZ） | 是（但有暂时性死区TDZ） |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 可以 | 可以 | 不可以 |
| 全局声明 | 挂载到window | 不挂载 | 不挂载 |

**暂时性死区（TDZ）：**
let/const 声明的变量在声明之前不可访问，会抛出 ReferenceError。

**const 注意事项：**
- const 保证的是变量绑定不可变，不是值不可变
- 对于引用类型（对象/数组），可以修改内部属性
- 若需不可变对象，用 Object.freeze()

**最佳实践：**
- 默认使用 const
- 需要重新赋值时用 let
- 永远不要使用 var`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'Promise 是什么？async/await 和 Promise 的关系？',
    answer: `**Promise 是异步操作的最终结果的表示，有三种状态：**
- pending（进行中）
- fulfilled（成功）
- rejected（失败）

**核心 API：**
- new Promise((resolve, reject) => { ... })
- .then(onFulfilled, onRejected)
- .catch(onRejected)
- .finally(callback)
- Promise.all([])：全部成功才成功
- Promise.race([])：第一个完成（成功或失败）
- Promise.allSettled([])：等待全部完成
- Promise.any([])：第一个成功

**async/await：**
- async 函数返回一个 Promise
- await 会暂停函数执行，等待 Promise 结果
- 本质是 Promise.then 的语法糖
- 错误处理用 try/catch

**对比：**
// Promise 链式调用
fetchUser().then(user => fetchProfile(user.id)).then(...)

// async/await 更直观
const user = await fetchUser()
const profile = await fetchProfile(user.id)

**面试深入：**
- 微任务（microtask）与宏任务（macrotask）的执行顺序
- Promise.resolve() 与 new Promise 的区别
- async 函数的错误传播机制`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: '事件循环（Event Loop）是什么？微任务和宏任务的区别？',
    answer: `**Event Loop 机制：**
JavaScript 是单线程语言，通过事件循环实现异步。

**执行顺序：**
1. 执行同步代码（调用栈）
2. 执行所有微任务队列
3. 执行一个宏任务
4. 重复 2-3

**微任务（Microtask）：**
- Promise.then/catch/finally
- MutationObserver
- queueMicrotask()
- process.nextTick（Node.js）

**宏任务（Macrotask）：**
- setTimeout/setInterval
- setImmediate（Node.js）
- I/O、UI 渲染
- requestAnimationFrame

**经典面试题：**
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')

输出顺序：1 → 4 → 3 → 2

**解释：**
1, 4 是同步代码先执行；
3 是微任务，在当前宏任务结束后立即执行；
2 是宏任务，在下一个事件循环中执行。`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: '深拷贝和浅拷贝的区别？如何实现深拷贝？',
    answer: `**浅拷贝：** 只复制第一层属性，引用类型属性仍然共享内存地址。
**深拷贝：** 递归复制所有层级，完全独立的副本。

**浅拷贝方法：**
- Object.assign({}, obj)
- 展开运算符 { ...obj }
- Array.prototype.slice()
- Array.from()

**深拷贝方法：**

1. JSON 方法（最简单但有局限）：
   JSON.parse(JSON.stringify(obj))
   局限：不支持 function、undefined、Symbol、循环引用、Date、RegExp

2. structuredClone（推荐，原生 API）：
   const clone = structuredClone(obj)
   支持循环引用、Date、Map、Set 等

3. 递归实现：
   function deepClone(obj, cache = new WeakMap()) {
     if (obj === null || typeof obj !== 'object') return obj
     if (cache.has(obj)) return cache.get(obj)
     const clone = Array.isArray(obj) ? [] : {}
     cache.set(obj, clone)
     for (const key of Object.keys(obj)) {
       clone[key] = deepClone(obj[key], cache)
     }
     return clone
   }

4. 第三方库：lodash.cloneDeep()`,
    tags: [{ text: '高频', type: 'frequent' }],
  },
  {
    question: '什么是防抖（debounce）和节流（throttle）？各自的应用场景？',
    answer: `**防抖（Debounce）：**
在事件触发后等待一段时间才执行，如果在等待期间再次触发，则重新计时。

场景：搜索框输入、窗口 resize、表单验证

实现：
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

**节流（Throttle）：**
在一定时间间隔内只执行一次，无论事件触发频率多高。

场景：滚动事件、鼠标移动、按钮快速点击

实现：
function throttle(fn, interval) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

**核心区别：**
- 防抖：只执行最后一次（适合"最终结果"场景）
- 节流：每隔一段时间执行一次（适合"持续响应"场景）`,
    tags: [{ text: '高频', type: 'frequent' }],
  },
]

export const vueReactQA = [
  {
    question: 'Vue 的响应式原理是什么？Vue2 和 Vue3 有什么区别？',
    answer: `**Vue2 响应式原理：**
使用 Object.defineProperty() 对 data 中每个属性进行 getter/setter 劫持。

缺点：
1. 无法检测对象属性的新增/删除（需用 Vue.set / this.$set）
2. 无法检测数组索引赋值和长度修改（需用 push/splice 等变异方法）
3. 初始化时递归遍历所有属性，性能消耗大

**Vue3 响应式原理：**
使用 Proxy 代理整个对象，拦截所有操作。

优势：
1. 可以检测属性增删
2. 可以监听数组变化
3. 惰性求值（按需追踪，性能更好）
4. 更好的 TypeScript 支持

**核心 API（Vue3 Composition API）：**
- ref(value)：基本类型的响应式引用
- reactive(obj)：对象的响应式代理
- computed()：计算属性
- watch() / watchEffect()：侦听器

**面试追问：**
- ref 和 reactive 的区别？
- 为什么 ref 需要 .value？
- shallowRef / shallowReactive 的使用场景？`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'Vue 的生命周期有哪些？各阶段做什么？',
    answer: `**Vue3 Composition API 生命周期：**

| 阶段 | 选项式 API | Composition API |
|------|-----------|-----------------|
| 创建 | beforeCreate | setup() |
| 创建 | created | setup() |
| 挂载前 | beforeMount | onBeforeMount |
| 挂载后 | mounted | onMounted |
| 更新前 | beforeUpdate | onBeforeUpdate |
| 更新后 | updated | onUpdated |
| 卸载前 | beforeUnmount | onBeforeUnmount |
| 卸载后 | unmounted | onUnmounted |

**各阶段常见操作：**
- setup()：初始化数据、计算属性、方法
- onMounted：DOM 操作、API 请求、第三方库初始化
- onUpdated：DOM 更新后的操作（小心避免无限循环）
- onBeforeUnmount：清理定时器、取消订阅、销毁事件监听

**常见面试问题：**
- 父子组件生命周期顺序？
  父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted
- 异步请求放在哪个生命周期？推荐 onMounted
- keep-alive 的 activated/deactivated`,
    tags: [{ text: '必会', type: 'must' }],
  },
  {
    question: 'Vue 组件通信有哪些方式？',
    answer: `**1. 父 → 子：props**
- 父组件通过属性传递数据
- 子组件通过 defineProps 接收

**2. 子 → 父：emits**
- 子组件通过 emit 触发事件
- 父组件通过 @事件名 监听

**3. 兄弟/跨层级：provide/inject**
- 祖先组件 provide 提供数据
- 后代组件 inject 注入

**4. 全局状态：Pinia**
- 替代 Vuex 的新一代状态管理
- 支持 Composition API 风格

**5. 其他方式：**
- v-model 双向绑定
- refs（父调子方法）
- 事件总线（Vue3 推荐 mitt 库）
- attrs 透传属性
- 路由参数

**最佳实践：**
- 简单父子通信：props + emits
- 深层嵌套：provide/inject
- 全局共享：Pinia
- 减少 event bus 使用（难以维护和调试）`,
    tags: [{ text: '高频', type: 'frequent' }],
  },
  {
    question: 'React Hooks 有哪些？useState 和 useReducer 的区别？',
    answer: `**常用 Hooks：**
1. useState：状态管理
2. useEffect：副作用（类似生命周期）
3. useContext：跨组件传值
4. useReducer：复杂状态管理
5. useMemo：缓存计算值
6. useCallback：缓存函数引用
7. useRef：获取 DOM / 持久化变量
8. useLayoutEffect：同步 DOM 操作

**useState vs useReducer：**

useState 适合：
- 简单独立的状态
- 状态更新逻辑简单
- 组件内部少量状态

useReducer 适合：
- 多个相关联的状态
- 复杂更新逻辑
- 状态转换有明确的 action
- 需要共享 dispatch 函数

**Hooks 规则：**
1. 只在函数组件顶层调用（不能在循环/条件/嵌套函数中）
2. 只在 React 函数组件或自定义 Hook 中调用

**自定义 Hook：**
以 use 开头的函数，可以复用状态逻辑。`,
    tags: [{ text: '高频', type: 'frequent' }],
  },
  {
    question: 'Virtual DOM 是什么？Diff 算法的原理？',
    answer: `**Virtual DOM：**
虚拟 DOM 是真实 DOM 的 JavaScript 对象表示。

工作流程：
1. 用 JS 对象描述 DOM 树（虚拟节点 VNode）
2. 状态变化时生成新的虚拟 DOM 树
3. 对比新旧虚拟 DOM（Diff 算法）
4. 计算最小变更（Patch）
5. 将变更应用到真实 DOM

**为什么快：**
- 批量更新，减少直接 DOM 操作次数
- 跨平台（可以渲染到不同目标）

**Diff 算法策略：**
1. 同层比较：只对比同一层级的节点
2. 类型不同直接替换：节点类型不同直接销毁重建
3. Key 优化：通过 key 标识复用节点

**Vue 的 Diff（双端比较）：**
头头、尾尾、头尾、尾头四个指针交叉比较

**React 的 Diff（单向遍历）：**
从左往右遍历，通过 key 建立 Map 查找

**面试追问：**
- 为什么不建议用 index 作为 key？
- Vue3 的 Block Tree + PatchFlag 编译优化`,
    tags: [{ text: '必会', type: 'must' }],
  },
]

export const engineeringQA = [
  {
    question: 'Webpack 和 Vite 的区别？各自的优劣势？',
    answer: `**Webpack：**
- 基于 Bundle 的构建工具
- 所有模块打包成一个或多个 bundle
- 热更新需要重新构建整个模块图
- 生态成熟，插件丰富

**Vite：**
- 开发环境：基于原生 ES Modules，按需编译
- 生产环境：使用 Rollup 打包
- 启动速度极快（毫秒级）
- 热更新更快（只更新变更模块）

**核心区别：**
| 维度 | Webpack | Vite |
|------|---------|------|
| 启动速度 | 慢（先打包再预览） | 极快（即时启动） |
| 热更新 | 较慢 | 极快 |
| 生态 | 最丰富 | 快速增长 |
| 配置 | 复杂 | 简洁 |
| 生产构建 | Webpack | Rollup |
| 浏览器兼容 | 更好 | 需要现代浏览器 |

**选择建议：**
- 新项目优先 Vite
- 老项目/复杂需求用 Webpack
- 库开发可考虑 Rollup`,
    tags: [{ text: '高频', type: 'frequent' }],
  },
  {
    question: '前端性能优化有哪些常见手段？',
    answer: `**加载优化：**
1. 代码分割（Code Splitting）：动态 import + 路由懒加载
2. Tree Shaking：消除无用代码
3. 压缩：JS/CSS/HTML 压缩 + Gzip/Brotli
4. 图片优化：WebP 格式、懒加载、CDN
5. 预加载：prefetch / preload / dns-prefetch
6. CDN 加速

**渲染优化：**
1. 减少重排重绘（批量 DOM 操作、使用 transform）
2. CSS 放头部、JS 放底部或使用 defer/async
3. 虚拟列表（大量数据渲染）
4. 骨架屏提升感知速度
5. 使用 CSS contain 隔离重绘

**代码优化：**
1. 防抖节流
2. Web Worker 处理计算密集任务
3. 请求合并/缓存策略
4. 使用 requestAnimationFrame
5. 避免内存泄漏

**监控指标（Core Web Vitals）：**
- LCP（最大内容绘制）< 2.5s
- FID（首次输入延迟）< 100ms
- CLS（累计布局偏移）< 0.1

**打包优化：**
- 分析包体积（Bundle Analyzer）
- 按需引入组件库
- 外部化大型依赖`,
    tags: [{ text: '必会', type: 'must' }],
  },
]

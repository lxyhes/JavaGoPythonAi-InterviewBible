<template>
  <div class="content-section">
    <h2>🔥 JavaScript 进阶面试题</h2>

    <QAItem question="事件循环（Event Loop）机制是什么？宏任务和微任务的区别？"
      :tags="[{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }]">
      <p><strong>JavaScript 是单线程的，通过事件循环实现异步：</strong></p>
      <pre>// 执行顺序示例
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 输出：1 → 4 → 3 → 2</pre>
      <p><strong>宏任务（Macrotask）：</strong></p>
      <ul>
        <li>setTimeout、setInterval</li>
        <li>setImmediate（Node.js）</li>
        <li>I/O 操作</li>
        <li>UI 渲染</li>
      </ul>
      <p><strong>微任务（Microtask）：</strong></p>
      <ul>
        <li>Promise.then/catch/finally</li>
        <li>MutationObserver</li>
        <li>queueMicrotask</li>
      </ul>
      <p><strong>执行顺序：</strong>同步代码 → 微任务队列 → 宏任务队列</p>
    </QAItem>

    <QAItem question="深拷贝和浅拷贝的区别？如何实现深拷贝？"
      :tags="[{ text: '高频', type: 'frequent' }]">
      <p><strong>浅拷贝：</strong>只复制一层，对象引用仍然共享</p>
      <pre>// 浅拷贝方法
const shallow1 = { ...obj };
const shallow2 = Object.assign({}, obj);
const shallow3 = obj.slice(); // 数组</pre>
      <p><strong>深拷贝：</strong>完全复制，不共享引用</p>
      <pre>// 方法1：JSON（有局限）
const deep1 = JSON.parse(JSON.stringify(obj));
// 缺点：不能处理函数、undefined、循环引用、Date、RegExp

// 方法2：递归实现
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (map.has(obj)) return map.get(obj);
  
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }
  return clone;
}

// 方法3：使用库
// lodash.cloneDeep(obj)</pre>
    </QAItem>

    <QAItem question="防抖（debounce）和节流（throttle）的区别和实现？"
      :tags="[{ text: '高频', type: 'frequent' }]">
      <p><strong>防抖：</strong>事件触发后等待一段时间才执行，如果期间再次触发则重新计时</p>
      <pre>function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用：搜索框输入、窗口 resize
input.addEventListener('input', debounce(handleInput, 300));</pre>
      <p><strong>节流：</strong>一段时间内只执行一次</p>
      <pre>function throttle(fn, delay) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

// 使用时间戳 + 定时器实现更精确的节流
function throttle(fn, delay) {
  let timer = null;
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);
    if (remaining &lt;= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = now;
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, remaining);
    }
  };
}

// 使用：滚动加载、按钮点击</pre>
    </QAItem>

    <QAItem question="什么是函数柯里化（Currying）？如何实现？"
      :tags="[{ text: '重要', type: 'important' }]">
      <p><strong>柯里化：</strong>将多参数函数转换为单参数函数链</p>
      <pre>// 普通函数
function add(a, b, c) {
  return a + b + c;
}

// 柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6</pre>
      <p><strong>应用场景：</strong></p>
      <ul>
        <li>参数复用</li>
        <li>延迟执行</li>
        <li>函数组合</li>
      </ul>
    </QAItem>

    <QAItem question="如何实现一个 Promise？"
      :tags="[{ text: '重要', type: 'important' }]">
      <pre>class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }
}</pre>
    </QAItem>

    <QAItem question="垃圾回收机制是什么？内存泄漏的常见原因？"
      :tags="[{ text: '高频', type: 'frequent' }]">
      <p><strong>垃圾回收算法：</strong></p>
      <ul>
        <li><strong>标记清除（Mark-Sweep）：</strong>最常用，标记可达对象，清除未标记对象</li>
        <li><strong>引用计数：</strong>记录引用次数，为零时回收（有循环引用问题）</li>
        <li><strong>分代回收：</strong>新生代（Scavenge）和老年代（Mark-Sweep）</li>
      </ul>
      <p><strong>内存泄漏原因：</strong></p>
      <ul>
        <li>意外的全局变量</li>
        <li>闭包引用（未释放）</li>
        <li>DOM 引用未清除</li>
        <li>定时器未清除</li>
        <li>事件监听未移除</li>
        <li>Map/Set 中的对象引用</li>
      </ul>
      <pre>// 检测内存泄漏
// 1. Chrome DevTools Memory 面板
// 2. Performance 面板查看内存趋势
// 3. 使用 WeakMap/WeakSet 避免强引用</pre>
    </QAItem>
  </div>
</template>

<script setup lang="ts">
import QAItem from '../QAItem.vue'
</script>

<style scoped>
.content-section {
  padding: 20px;
}

h2 {
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}
</style>

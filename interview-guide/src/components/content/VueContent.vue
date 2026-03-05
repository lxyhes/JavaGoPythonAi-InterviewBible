<template>
  <div class="qa-list">
    <div class="qa-item">
      <div class="question">Vue2和Vue3的区别？Composition API的优势？</div>
      <div class="answer">
        <span class="tag must">必问</span>
        <span class="tag frequent">高频</span>
        <table class="comparison-table">
          <tr>
            <th>特性</th>
            <th>Vue 2</th>
            <th>Vue 3</th>
          </tr>
          <tr>
            <td>响应式原理</td>
            <td>Object.defineProperty</td>
            <td>Proxy</td>
          </tr>
          <tr>
            <td>API风格</td>
            <td>Options API</td>
            <td>Options + Composition</td>
          </tr>
          <tr>
            <td>性能</td>
            <td>一般</td>
            <td>提升30%-50%</td>
          </tr>
          <tr>
            <td>TypeScript</td>
            <td>支持一般</td>
            <td>原生支持</td>
          </tr>
          <tr>
            <td>新特性</td>
            <td>-</td>
            <td>Teleport、Suspense、Fragments</td>
          </tr>
        </table>
        <p><strong>Composition API优势：</strong></p>
        <ul>
          <li><strong>逻辑复用</strong>：通过组合函数复用逻辑，替代mixin</li>
          <li><strong>代码组织</strong>：按功能组织代码，而非选项类型</li>
          <li><strong>TypeScript支持</strong>：更好的类型推断</li>
          <li><strong>树摇优化</strong>：按需引入API</li>
        </ul>
      </div>
    </div>

    <div class="qa-item">
      <div class="question">Vue的响应式原理是什么？Vue2和Vue3的实现差异？</div>
      <div class="answer">
        <span class="tag must">必问</span>
        <span class="tag frequent">高频</span>
        <p><strong>Vue 2 - Object.defineProperty：</strong></p>
        <pre><code>// 递归遍历对象，为每个属性添加getter/setter
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      // 收集依赖
      return val;
    },
    set(newVal) {
      if (val !== newVal) {
        val = newVal;
        // 触发更新
      }
    }
  });
}</code></pre>
        <p><strong>Vue 2的局限：</strong></p>
        <ul>
          <li>无法检测对象属性的添加/删除（需用Vue.set/Vue.delete）</li>
          <li>无法检测数组索引和长度的变化</li>
          <li>递归遍历性能开销大</li>
        </ul>
        <p><strong>Vue 3 - Proxy：</strong></p>
        <pre><code>const proxy = new Proxy(target, {
  get(target, key, receiver) {
    // 收集依赖
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    // 触发更新
    return Reflect.set(target, key, value, receiver);
  }
});</code></pre>
        <p><strong>Proxy的优势：</strong></p>
        <ul>
          <li>可检测属性的添加和删除</li>
          <li>可检测数组索引和长度变化</li>
          <li>性能更好，懒代理</li>
          <li>支持Map、Set等数据结构</li>
        </ul>
      </div>
    </div>

    <div class="qa-item">
      <div class="question">Vue的生命周期有哪些？父子组件生命周期执行顺序？</div>
      <div class="answer">
        <span class="tag must">必问</span>
        <span class="tag frequent">高频</span>
        <p><strong>Vue 2 生命周期：</strong></p>
        <pre><code>beforeCreate  // 实例初始化，数据观测前
created       // 实例创建完成，可访问数据
beforeMount   // 挂载开始，模板编译
mounted       // 挂载完成，DOM可操作
beforeUpdate  // 数据更新，DOM重新渲染前
updated       // DOM更新完成
beforeDestroy // 实例销毁前
destroyed     // 实例销毁完成</code></pre>
        <p><strong>Vue 3 生命周期（Composition API）：</strong></p>
        <pre><code>setup()       // 替代beforeCreate和created
onBeforeMount
onMounted
onBeforeUpdate
onUpdated
onBeforeUnmount  // 替代beforeDestroy
onUnmounted      // 替代destroyed</code></pre>
        <p><strong>父子组件执行顺序：</strong></p>
        <pre><code>// 挂载阶段
父beforeCreate → 父created → 父beforeMount
  → 子beforeCreate → 子created → 子beforeMount → 子mounted
→ 父mounted

// 更新阶段
父beforeUpdate → 子beforeUpdate → 子updated → 父updated

// 销毁阶段
父beforeDestroy → 子beforeDestroy → 子destroyed → 父destroyed</code></pre>
      </div>
    </div>

    <div class="qa-item">
      <div class="question">Vue的computed和watch的区别？使用场景？</div>
      <div class="answer">
        <span class="tag must">必问</span>
        <span class="tag frequent">高频</span>
        <table class="comparison-table">
          <tr>
            <th>特性</th>
            <th>computed</th>
            <th>watch</th>
          </tr>
          <tr>
            <td>作用</td>
            <td>计算属性，基于依赖缓存</td>
            <td>监听变化，执行副作用</td>
          </tr>
          <tr>
            <td>返回值</td>
            <td>有</td>
            <td>无</td>
          </tr>
          <tr>
            <td>缓存</td>
            <td>有（依赖不变不重新计算）</td>
            <td>无</td>
          </tr>
          <tr>
            <td>适用场景</td>
            <td>模板中的复杂计算</td>
            <td>异步操作、数据监听</td>
          </tr>
        </table>
        <pre><code>// computed - 模板中使用
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value;
});

// watch - 监听执行副作用
watch(searchText, (newVal, oldVal) => {
  fetchSearchResults(newVal);
});

// watchEffect - 立即执行，自动追踪依赖
watchEffect(() => {
  console.log(count.value); // 自动追踪count
});</code></pre>
      </div>
    </div>

    <div class="qa-item">
      <div class="question">Vue的v-if和v-show的区别？v-for和v-if的优先级？</div>
      <div class="answer">
        <span class="tag frequent">高频</span>
        <table class="comparison-table">
          <tr>
            <th>特性</th>
            <th>v-if</th>
            <th>v-show</th>
          </tr>
          <tr>
            <td>渲染方式</td>
            <td>条件为false时不渲染</td>
            <td>始终渲染，display切换</td>
          </tr>
          <tr>
            <td>切换开销</td>
            <td>高（组件创建/销毁）</td>
            <td>低（CSS切换）</td>
          </tr>
          <tr>
            <td>适用场景</td>
            <td>条件很少改变</td>
            <td>频繁切换显示</td>
          </tr>
        </table>
        <p><strong>v-for和v-if优先级（Vue 2 vs Vue 3）：</strong></p>
        <ul>
          <li><strong>Vue 2</strong>：v-for优先级高于v-if，每次渲染都遍历整个列表</li>
          <li><strong>Vue 3</strong>：v-if优先级高于v-for</li>
        </ul>
        <p><strong>最佳实践：</strong>不要同时使用，先用computed过滤数据</p>
        <pre><code>// ❌ 不推荐
&lt;div v-for="item in list" v-if="item.active"&gt;

// ✅ 推荐
&lt;div v-for="item in activeList" :key="item.id"&gt;

const activeList = computed(() => list.filter(item => item.active));</code></pre>
      </div>
    </div>

    <div class="qa-item">
      <div class="question">Vue的nextTick原理？什么时候需要使用？</div>
      <div class="answer">
        <span class="tag frequent">高频</span>
        <p><strong>作用：</strong>在下次DOM更新循环结束后执行回调，获取更新后的DOM</p>
        <pre><code>// 使用场景
function update() {
  message.value = 'Hello';
  // DOM还未更新
  nextTick(() => {
    // DOM已更新
    console.log(domRef.value.textContent); // 'Hello'
  });
}</code></pre>
        <p><strong>实现原理：</strong></p>
        <ul>
          <li>Vue异步更新DOM，将更新操作放入队列</li>
          <li>nextTick将回调放入微任务队列（Promise.then/MutationObserver）</li>
          <li>降级方案：setTimeout(fn, 0)</li>
        </ul>
        <p><strong>使用场景：</strong></p>
        <ul>
          <li>修改数据后立即操作DOM</li>
          <li>获取更新后的元素尺寸/位置</li>
        </ul>
      </div>
    </div>

    <div class="qa-item">
      <div class="question">Vue的keep-alive是什么？使用场景和原理？</div>
      <div class="answer">
        <span class="tag frequent">高频</span>
        <p><strong>作用：</strong>缓存组件实例，避免重复渲染，保留组件状态</p>
        <pre><code>&lt;keep-alive :include="['TabA', 'TabB']" :exclude="['TabC']" :max="10"&gt;
  &lt;component :is="currentTab" /&gt;
&lt;/keep-alive&gt;</code></pre>
        <p><strong>生命周期钩子：</strong></p>
        <ul>
          <li><strong>activated</strong>：组件被激活时调用</li>
          <li><strong>deactivated</strong>：组件被缓存时调用</li>
        </ul>
        <p><strong>原理：</strong></p>
        <ul>
          <li>使用LRU（最近最少使用）算法管理缓存</li>
          <li>组件切换时，将VNode缓存到内存中</li>
          <li>再次激活时，从缓存中恢复，不重新创建实例</li>
        </ul>
      </div>
    </div>

    <div class="qa-item">
      <div class="question">Vue的slot是什么？作用域插槽如何使用？</div>
      <div class="answer">
        <span class="tag frequent">高频</span>
        <p><strong>插槽类型：</strong></p>
        <ul>
          <li><strong>默认插槽</strong>：没有name的slot</li>
          <li><strong>具名插槽</strong>：有name的slot</li>
          <li><strong>作用域插槽</strong>：子组件向父组件传递数据</li>
        </ul>
        <pre><code>// 子组件
&lt;template&gt;
  &lt;div&gt;
    &lt;slot&gt;默认内容&lt;/slot&gt;
    &lt;slot name="header"&gt;&lt;/slot&gt;
    &lt;slot name="item" :data="itemData"&gt;&lt;/slot&gt;
  &lt;/div&gt;
&lt;/template&gt;

// 父组件（Vue 3）
&lt;Child&gt;
  &lt;template #default&gt;默认插槽内容&lt;/template&gt;
  &lt;template #header&gt;头部内容&lt;/template&gt;
  &lt;template #item="{ data }"&gt;
    {{ data.name }}
  &lt;/template&gt;
&lt;/Child&gt;</code></pre>
      </div>
    </div>

    <div class="qa-item">
      <div class="question">Vuex和Pinia的区别？状态管理最佳实践？</div>
      <div class="answer">
        <span class="tag frequent">高频</span>
        <table class="comparison-table">
          <tr>
            <th>特性</th>
            <th>Vuex 4</th>
            <th>Pinia</th>
          </tr>
          <tr>
            <td>API风格</td>
            <td>Options API</td>
            <td>类似Composition API</td>
          </tr>
          <tr>
            <td>TypeScript</td>
            <td>需要额外配置</td>
            <td>原生支持</td>
          </tr>
          <tr>
            <td>模块</td>
            <td>嵌套模块，命名空间</td>
            <td>扁平化，每个store独立</td>
          </tr>
          <tr>
            <td>体积</td>
            <td>较大</td>
            <td>轻量（1KB）</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qa-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.qa-item {
  background: var(--bg-color);
  border-radius: var(--radius-md);
  padding: 24px;
  border-left: 4px solid var(--primary-color);
  transition: var(--transition-base);
}

.qa-item:hover {
  transform: translateX(6px);
  box-shadow: var(--shadow-md);
  background: var(--card-bg);
}

.question {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-size: 1.125rem;
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
}

.question::before {
  content: 'Q';
  background: var(--primary-gradient);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 800;
  margin-right: 12px;
  flex-shrink: 0;
}

.answer {
  color: var(--text-secondary);
  padding-left: 40px;
  font-size: 1rem;
  line-height: 1.8;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 8px;
  margin-bottom: 12px;
}

.tag.must {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.tag.frequent {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.tag.important {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.comparison-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 16px 0;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.comparison-table th {
  background: var(--bg-secondary);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
}

.comparison-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

pre {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 12px 0;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
}

code {
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  font-size: 0.875em;
  color: var(--primary-dark);
}

pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: inherit;
}

ul, ol {
  margin: 12px 0;
  padding-left: 24px;
}

li {
  margin: 8px 0;
}

p {
  margin: 12px 0;
}

strong {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .qa-item {
    padding: 16px;
  }

  .answer {
    padding-left: 0;
  }

  .comparison-table {
    font-size: 0.875rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 8px 12px;
  }
}
</style>

<template>
  <div class="content-section">
    <h2>💚 Vue 面试题</h2>

    <QAItem question="Vue2 和 Vue3 的区别？Composition API 的优势？"
      :tags="[{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }]">
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
          <td>API 风格</td>
          <td>Options API</td>
          <td>Options + Composition</td>
        </tr>
        <tr>
          <td>性能</td>
          <td>一般</td>
          <td>提升 30%-50%</td>
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
      <p><strong>Composition API 优势：</strong></p>
      <ul>
        <li><strong>逻辑复用</strong>：通过组合函数复用逻辑，替代 mixin</li>
        <li><strong>代码组织</strong>：按功能组织代码，而非选项类型</li>
        <li><strong>TypeScript 支持</strong>：更好的类型推断</li>
        <li><strong>树摇优化</strong>：按需引入 API</li>
      </ul>
    </QAItem>

    <QAItem question="Vue 的响应式原理是什么？Vue2 和 Vue3 的实现差异？"
      :tags="[{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }]">
      <p><strong>Vue 2 - Object.defineProperty：</strong></p>
      <pre>function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() { return val; },
    set(newVal) {
      if (val !== newVal) {
        val = newVal;
        // 触发更新
      }
    }
  });
}</pre>
      <p><strong>Vue 2 的局限：</strong></p>
      <ul>
        <li>无法检测对象属性的添加/删除</li>
        <li>无法检测数组索引和长度的变化</li>
        <li>递归遍历性能开销大</li>
      </ul>
      <p><strong>Vue 3 - Proxy：</strong></p>
      <pre>const proxy = new Proxy(target, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  }
});</pre>
    </QAItem>

    <QAItem question="Vue 的生命周期有哪些？父子组件生命周期执行顺序？"
      :tags="[{ text: '必问', type: 'must' }]">
      <p><strong>Vue 2 生命周期：</strong></p>
      <pre>beforeCreate → created → beforeMount → mounted
→ beforeUpdate → updated → beforeDestroy → destroyed</pre>
      <p><strong>Vue 3 生命周期（Composition API）：</strong></p>
      <pre>setup() → onBeforeMount → onMounted
→ onBeforeUpdate → onUpdated
→ onBeforeUnmount → onUnmounted</pre>
      <p><strong>父子组件执行顺序：</strong></p>
      <pre>父 beforeCreate → 父 created → 父 beforeMount
  → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted
→ 父 mounted</pre>
    </QAItem>

    <QAItem question="computed 和 watch 的区别？使用场景？" :tags="[{ text: '必问', type: 'must' }]">
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
          <td>有</td>
          <td>无</td>
        </tr>
        <tr>
          <td>适用场景</td>
          <td>模板中的复杂计算</td>
          <td>异步操作、数据监听</td>
        </tr>
      </table>
    </QAItem>

    <QAItem question="v-if 和 v-show 的区别？" :tags="[{ text: '高频', type: 'frequent' }]">
      <table class="comparison-table">
        <tr>
          <th>特性</th>
          <th>v-if</th>
          <th>v-show</th>
        </tr>
        <tr>
          <td>渲染方式</td>
          <td>条件为 false 时不渲染</td>
          <td>始终渲染，display 切换</td>
        </tr>
        <tr>
          <td>切换开销</td>
          <td>高（组件创建/销毁）</td>
          <td>低（CSS 切换）</td>
        </tr>
        <tr>
          <td>适用场景</td>
          <td>条件很少改变</td>
          <td>频繁切换显示</td>
        </tr>
      </table>
    </QAItem>

    <QAItem question="Vuex 和 Pinia 的区别？" :tags="[{ text: '高频', type: 'frequent' }]">
      <table class="comparison-table">
        <tr>
          <th>特性</th>
          <th>Vuex 4</th>
          <th>Pinia</th>
        </tr>
        <tr>
          <td>API 风格</td>
          <td>Options API</td>
          <td>类似 Composition API</td>
        </tr>
        <tr>
          <td>TypeScript</td>
          <td>需要额外配置</td>
          <td>原生支持</td>
        </tr>
        <tr>
          <td>模块</td>
          <td>嵌套模块，命名空间</td>
          <td>扁平化，每个 store 独立</td>
        </tr>
        <tr>
          <td>体积</td>
          <td>较大</td>
          <td>轻量（1KB）</td>
        </tr>
      </table>
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
</style>

<template>
  <div class="content-section">
    <h2>⚛️ React 面试题</h2>

    <QAItem question="React 生命周期有哪些？"
      :tags="[{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }]">
      <p><strong>类组件生命周期（16.4+）：</strong></p>
      <pre>// 挂载阶段
constructor → static getDerivedStateFromProps
→ render → componentDidMount

// 更新阶段
static getDerivedStateFromProps → shouldComponentUpdate
→ render → getSnapshotBeforeUpdate → componentDidUpdate

// 卸载阶段
componentWillUnmount</pre>
      <p><strong>函数组件 Hooks：</strong></p>
      <pre>useEffect(() => {
  // componentDidMount + componentDidUpdate
  return () => {
    // componentWillUnmount
  };
}, [deps]);</pre>
    </QAItem>

    <QAItem question="useEffect 和 useLayoutEffect 的区别？"
      :tags="[{ text: '高频', type: 'frequent' }]">
      <table class="comparison-table">
        <tr>
          <th>特性</th>
          <th>useEffect</th>
          <th>useLayoutEffect</th>
        </tr>
        <tr>
          <td>执行时机</td>
          <td>渲染完成后异步执行</td>
          <td>渲染完成后同步执行（阻塞绘制）</td>
        </tr>
        <tr>
          <td>使用场景</td>
          <td>数据获取、订阅、事件处理</td>
          <td>DOM 测量、同步重渲染</td>
        </tr>
        <tr>
          <td>性能影响</td>
          <td>不会阻塞渲染</td>
          <td>可能阻塞渲染（慎用）</td>
        </tr>
      </table>
    </QAItem>

    <QAItem question="React 的 diff 算法原理？" :tags="[{ text: '必问', type: 'must' }]">
      <p><strong>三大策略：</strong></p>
      <ul>
        <li><strong>tree diff：</strong>同级比较，跨层级移动节点少</li>
        <li><strong>component diff：</strong>类型不同直接替换，类型相同继续 diff</li>
        <li><strong>element diff：</strong>通过 key 优化列表比较</li>
      </ul>
      <p><strong>key 的作用：</strong></p>
      <ul>
        <li>帮助 React 识别哪些元素改变了</li>
        <li>减少不必要的 DOM 操作</li>
        <li>不要用 index 作为 key（除非列表不会变）</li>
      </ul>
    </QAItem>

    <QAItem question="React Hooks 使用规则？"
      :tags="[{ text: '高频', type: 'frequent' }]">
      <p><strong>两条规则：</strong></p>
      <ul>
        <li><strong>只在最顶层使用 Hooks：</strong>不要在循环、条件或嵌套函数中调用</li>
        <li><strong>只在 React 函数中调用：</strong>函数组件或自定义 Hooks</li>
      </ul>
      <pre>// ✅ 正确
function MyComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => {});
  return ...;
}

// ❌ 错误
function MyComponent() {
  if (condition) {
    const [count, setCount] = useState(0); // 条件中调用
  }
}</pre>
    </QAItem>

    <QAItem question="React 性能优化有哪些方法？"
      :tags="[{ text: '高频', type: 'frequent' }]">
      <ul>
        <li><strong>React.memo：</strong>函数组件浅比较</li>
        <li><strong>useMemo：</strong>缓存计算结果</li>
        <li><strong>useCallback：</strong>缓存函数引用</li>
        <li><strong>虚拟列表：</strong>react-window、react-virtualized</li>
        <li><strong>代码分割：</strong>React.lazy + Suspense</li>
        <li><strong>避免不必要的渲染：</strong>shouldComponentUpdate、PureComponent</li>
      </ul>
    </QAItem>

    <QAItem question="Redux 的工作流程？" :tags="[{ text: '高频', type: 'frequent' }]">
      <p><strong>核心概念：</strong></p>
      <ul>
        <li><strong>Store：</strong>存储应用状态</li>
        <li><strong>Action：</strong>描述发生了什么的普通对象</li>
        <li><strong>Reducer：</strong>根据 action 更新 state 的纯函数</li>
      </ul>
      <pre>// 工作流程
View → dispatch(Action) → Reducer → Store → View

// Action
const increment = () => ({ type: 'INCREMENT' });

// Reducer
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    default: return state;
  }
};</pre>
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

<template>
  <div class="content-section">
    <h2>🌐 HTML/CSS 面试题</h2>
    
    <QAItem question="HTML5 有哪些新特性？" :tags="[{text: '必问', type: 'must'}, {text: '高频', type: 'frequent'}]">
      <p><strong>语义化标签：</strong></p>
      <ul>
        <li>&lt;header&gt;、&lt;nav&gt;、&lt;main&gt;、&lt;article&gt;、&lt;section&gt;、&lt;aside&gt;、&lt;footer&gt;</li>
      </ul>
      <p><strong>表单增强：</strong></p>
      <ul>
        <li>新的 input 类型：email、url、date、number、range、color</li>
        <li>表单验证：required、pattern、min/max</li>
        <li>&lt;datalist&gt; 提供自动完成选项</li>
      </ul>
      <p><strong>多媒体：</strong></p>
      <ul>
        <li>&lt;video&gt;、&lt;audio&gt; 原生支持，无需 Flash</li>
        <li>&lt;canvas&gt; 2D/3D 绘图</li>
        <li>&lt;svg&gt; 矢量图形</li>
      </ul>
      <p><strong>存储：</strong></p>
      <ul>
        <li>localStorage - 持久化本地存储</li>
        <li>sessionStorage - 会话级存储</li>
        <li>IndexedDB - 客户端数据库</li>
      </ul>
      <p><strong>其他：</strong>Web Workers、Geolocation、WebSocket、Drag and Drop</p>
    </QAItem>

    <QAItem question="CSS 盒模型是什么？标准盒模型和怪异盒模型的区别？" :tags="[{text: '必问', type: 'must'}]">
      <p><strong>标准盒模型（content-box）：</strong></p>
      <pre>width/height = content 宽度/高度
total = content + padding + border + margin</pre>
      <p><strong>怪异盒模型（border-box）：</strong></p>
      <pre>width/height = content + padding + border
total = width/height + margin</pre>
      <p><strong>设置方式：</strong></p>
      <pre>box-sizing: content-box;  /* 标准 */
box-sizing: border-box;   /* 怪异 - 推荐 */</pre>
      <p><strong>推荐使用 border-box：</strong>更容易控制元素实际占用空间，布局更直观</p>
    </QAItem>

    <QAItem question="CSS 选择器优先级如何计算？" :tags="[{text: '高频', type: 'frequent'}]">
      <p><strong>优先级权重（从低到高）：</strong></p>
      <ul>
        <li>通用选择器 *：0</li>
        <li>元素选择器：1</li>
        <li>类选择器、属性选择器、伪类：10</li>
        <li>ID 选择器：100</li>
        <li>行内样式：1000</li>
        <li>!important：最高（慎用）</li>
      </ul>
      <p><strong>计算规则：</strong></p>
      <pre>/* 0-1-2 = 12 */
.nav ul li { }

/* 0-2-1 = 21 */
.nav .item a { }

/* 1-0-0 = 100 */
#header { }</pre>
    </QAItem>

    <QAItem question="Flex 布局有哪些常用属性？" :tags="[{text: '必问', type: 'must'}, {text: '高频', type: 'frequent'}]">
      <p><strong>容器属性（flex-container）：</strong></p>
      <pre>display: flex;
flex-direction: row | row-reverse | column | column-reverse;
justify-content: flex-start | center | flex-end | space-between | space-around | space-evenly;
align-items: stretch | flex-start | center | flex-end | baseline;
flex-wrap: nowrap | wrap | wrap-reverse;
align-content: flex-start | center | flex-end | space-between | space-around;</pre>
      <p><strong>项目属性（flex-item）：</strong></p>
      <pre>flex: 1;              /* flex-grow flex-shrink flex-basis 简写 */
flex-grow: 0;         /* 放大比例 */
flex-shrink: 1;       /* 缩小比例 */
flex-basis: auto;     /* 基础大小 */
align-self: auto | flex-start | center | flex-end;</pre>
    </QAItem>

    <QAItem question="CSS 实现水平垂直居中的方法有哪些？" :tags="[{text: '高频', type: 'frequent'}]">
      <p><strong>方法1：Flex 布局（推荐）</strong></p>
      <pre>.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}</pre>
      <p><strong>方法2：Grid 布局</strong></p>
      <pre>.parent {
  display: grid;
  place-items: center;
}</pre>
      <p><strong>方法3：绝对定位 + transform</strong></p>
      <pre>.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}</pre>
      <p><strong>方法4：绝对定位 + margin: auto</strong></p>
      <pre>.child {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: auto;
}</pre>
    </QAItem>

    <QAItem question="BFC 是什么？如何触发？有什么作用？" :tags="[{text: '重要', type: 'important'}]">
      <p><strong>BFC（Block Formatting Context）块级格式化上下文</strong></p>
      <p><strong>触发条件：</strong></p>
      <ul>
        <li>根元素（&lt;html&gt;）</li>
        <li>float 不为 none</li>
        <li>position 为 absolute 或 fixed</li>
        <li>display 为 inline-block、table-cell、flex、grid</li>
        <li>overflow 不为 visible</li>
      </ul>
      <p><strong>作用：</strong></p>
      <ul>
        <li>清除浮动（包含浮动元素）</li>
        <li>阻止 margin 重叠</li>
        <li>阻止元素被浮动元素覆盖</li>
      </ul>
    </QAItem>

    <QAItem question="响应式布局如何实现？" :tags="[{text: '高频', type: 'frequent'}]">
      <p><strong>1. 媒体查询（Media Queries）</strong></p>
      <pre>@media screen and (max-width: 768px) {
  /* 移动端样式 */
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
  /* 平板样式 */
}</pre>
      <p><strong>2. 弹性布局（Flexbox）</strong></p>
      <p><strong>3. 网格布局（Grid）</strong></p>
      <p><strong>4. 相对单位：</strong></p>
      <ul>
        <li>% - 相对于父元素</li>
        <li>vw/vh - 相对于视口</li>
        <li>rem - 相对于根元素字体</li>
        <li>em - 相对于父元素字体</li>
      </ul>
      <p><strong>5. 移动端适配方案：</strong></p>
      <ul>
        <li>viewport 设置</li>
        <li>flexible.js / rem 适配</li>
        <li>vw 适配方案</li>
      </ul>
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

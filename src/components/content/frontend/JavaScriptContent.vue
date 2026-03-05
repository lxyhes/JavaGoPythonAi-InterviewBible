<template>
  <div class="content-section">
    <h2>📜 JavaScript 面试题</h2>

    <QAItem question="JavaScript 的数据类型有哪些？typeof 和 instanceof 的区别？"
      :tags="[{ text: '必问', type: 'must' }]">
      <p><strong>基本数据类型（7种）：</strong></p>
      <ul>
        <li>string、number、boolean、null、undefined、symbol、bigint</li>
      </ul>
      <p><strong>引用数据类型：</strong></p>
      <ul>
        <li>Object（包括 Array、Function、Date、RegExp 等）</li>
      </ul>
      <p><strong>typeof 返回值：</strong></p>
      <pre>typeof 'str'      // 'string'
typeof 123        // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof Symbol()   // 'symbol'
typeof 123n       // 'bigint'
typeof null       // 'object' (历史bug)
typeof {}         // 'object'
typeof []         // 'object'
typeof function(){} // 'function'</pre>
      <p><strong>instanceof：</strong>判断原型链，只能判断引用类型</p>
      <pre>[] instanceof Array      // true
{} instanceof Object     // true
function(){} instanceof Function  // true</pre>
    </QAItem>

    <QAItem question="== 和 === 的区别？" :tags="[{ text: '高频', type: 'frequent' }]">
      <p><strong>=== 严格相等：</strong>值和类型都相同</p>
      <p><strong>== 宽松相等：</strong>会进行类型转换</p>
      <pre>// === 严格相等
0 === '0'     // false
null === undefined  // false

// == 类型转换
0 == '0'      // true (字符串转数字)
0 == false    // true (布尔转数字)
null == undefined   // true

// 特殊案例
[] == ''      // true
[] == 0       // true
[] == false   // true
{} == '[object Object]'  // true</pre>
      <p><strong>建议：</strong>始终使用 === 进行比较</p>
    </QAItem>

    <QAItem question="var、let、const 的区别？" :tags="[{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }]">
      <table class="comparison-table">
        <tr>
          <th>特性</th>
          <th>var</th>
          <th>let</th>
          <th>const</th>
        </tr>
        <tr>
          <td>作用域</td>
          <td>函数作用域</td>
          <td>块级作用域</td>
          <td>块级作用域</td>
        </tr>
        <tr>
          <td>变量提升</td>
          <td>是（初始化为undefined）</td>
          <td>是（暂时性死区）</td>
          <td>是（暂时性死区）</td>
        </tr>
        <tr>
          <td>重复声明</td>
          <td>允许</td>
          <td>不允许</td>
          <td>不允许</td>
        </tr>
        <tr>
          <td>重新赋值</td>
          <td>可以</td>
          <td>可以</td>
          <td>不可以</td>
        </tr>
      </table>
      <pre>// var 函数作用域
function test() {
  if (true) {
    var a = 1;
  }
  console.log(a); // 1
}

// let 块级作用域
if (true) {
  let b = 2;
}
// console.log(b); // ReferenceError

// const 必须初始化
const c = 3;
// c = 4; // TypeError

// const 对象可以修改属性
const obj = { name: 'Tom' };
obj.name = 'Jerry'; // OK
// obj = {}; // TypeError</pre>
    </QAItem>

    <QAItem question="闭包是什么？有什么作用？" :tags="[{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }]">
      <p><strong>定义：</strong>函数能够记住并访问它的词法作用域，即使这个函数在当前词法作用域之外执行</p>
      <pre>function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2</pre>
      <p><strong>作用：</strong></p>
      <ul>
        <li>数据封装和私有变量</li>
        <li>模块化模式</li>
        <li>函数柯里化</li>
        <li>防抖节流实现</li>
      </ul>
      <p><strong>缺点：</strong>可能导致内存泄漏（闭包引用的变量不会被垃圾回收）</p>
    </QAItem>

    <QAItem question="原型和原型链是什么？" :tags="[{ text: '必问', type: 'must' }]">
      <p><strong>原型（prototype）：</strong>每个函数都有一个 prototype 属性，指向原型对象</p>
      <p><strong>__proto__：</strong>每个对象都有 __proto__ 属性，指向其构造函数的原型</p>
      <p><strong>原型链：</strong>对象查找属性时，沿着 __proto__ 向上查找，直到 null</p>
      <pre>function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = function() {
  console.log('Hi, ' + this.name);
};

const tom = new Person('Tom');
tom.sayHi(); // 'Hi, Tom'

// 原型链
tom.__proto__ === Person.prototype
tom.__proto__.__proto__ === Object.prototype
tom.__proto__.__proto__.__proto__ === null</pre>
    </QAItem>

    <QAItem question="this 的指向有哪些情况？" :tags="[{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }]">
      <p><strong>this 的指向规则：</strong></p>
      <pre>// 1. 默认绑定（严格模式为 undefined，非严格为 window）
function fn() {
  console.log(this);
}
fn(); // window 或 undefined

// 2. 隐式绑定（对象方法调用）
const obj = {
  name: 'Tom',
  sayHi() {
    console.log(this.name);
  }
};
obj.sayHi(); // 'Tom'

// 3. 显式绑定（call、apply、bind）
function greet() {
  console.log(this.name);
}
greet.call({ name: 'Jerry' }); // 'Jerry'

// 4. new 绑定
function Person(name) {
  this.name = name;
}
const p = new Person('Tom');

// 5. 箭头函数（继承外层 this）
const obj2 = {
  name: 'Tom',
  sayHi: () => {
    console.log(this.name); // undefined，this 指向 window
  }
};</pre>
    </QAItem>

    <QAItem question="Promise 是什么？async/await 如何使用？" :tags="[{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }]">
      <p><strong>Promise 三种状态：</strong>pending（等待）、fulfilled（成功）、rejected（失败）</p>
      <pre>const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('done'));</pre>
      <p><strong>async/await：</strong></p>
      <pre>async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}</pre>
      <p><strong>Promise 静态方法：</strong></p>
      <ul>
        <li>Promise.all() - 全部成功才成功</li>
        <li>Promise.race() - 返回最快完成的</li>
        <li>Promise.allSettled() - 等待所有完成</li>
        <li>Promise.any() - 返回第一个成功的</li>
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

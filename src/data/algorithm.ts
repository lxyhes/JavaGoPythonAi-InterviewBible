import type { QAItem } from './backend'

export const sortQA: QAItem[] = [
  {
    question: '常见排序算法的时间复杂度和空间复杂度？',
    tags: [{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }],
    answer: `| 排序算法 | 平均时间 | 最坏时间 | 空间复杂度 | 稳定性 |
|---------|---------|---------|-----------|--------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 希尔排序 | O(n^1.3) | O(n²) | O(1) | 不稳定 |
| 归并排序 | O(nlogn) | O(nlogn) | O(n) | 稳定 |
| 快速排序 | O(nlogn) | O(n²) | O(logn) | 不稳定 |
| 堆排序 | O(nlogn) | O(nlogn) | O(1) | 不稳定 |
| 计数排序 | O(n+k) | O(n+k) | O(k) | 稳定 |
| 桶排序 | O(n+k) | O(n²) | O(n+k) | 稳定 |
| 基数排序 | O(d(n+k)) | O(d(n+k)) | O(n+k) | 稳定 |

**重点掌握：** 快排、归并、堆排`,
  },
  {
    question: '快速排序的原理和实现？',
    tags: [{ text: '必问', type: 'must' }],
    answer: `**原理：**
1. 选择基准值（pivot）
2. 将数组分为两部分：小于 pivot 和大于 pivot
3. 递归排序两部分

**实现：**
\`\`\`javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 原地快排（优化空间）
function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSortInPlace(arr, left, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;
  
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}
\`\`\``,
  },
]

export const dataStructureQA: QAItem[] = [
  {
    question: '数组和链表的区别？使用场景？',
    tags: [{ text: '必问', type: 'must' }],
    answer: `**数组：**
- 连续内存存储
- 随机访问 O(1)
- 插入删除 O(n)
- 需要预先分配空间

**链表：**
- 非连续内存，通过指针连接
- 随机访问 O(n)
- 插入删除 O(1)
- 动态分配空间

**使用场景：**
- 数组：频繁查询、数据量固定
- 链表：频繁增删、数据量不确定`,
  },
  {
    question: '栈和队列的区别？如何实现？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**栈（Stack）：** 后进先出 LIFO
- push：入栈
- pop：出栈
- peek：查看栈顶

**队列（Queue）：** 先进先出 FIFO
- enqueue：入队
- dequeue：出队
- front：查看队首

**实现：**
\`\`\`javascript
// 栈
class Stack {
  constructor() {
    this.items = [];
  }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

// 队列（使用数组效率低，可用链表优化）
class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }
  enqueue(item) { this.items.push(item); }
  dequeue() {
    if (this.isEmpty()) return undefined;
    return this.items[this.head++];
  }
  front() { return this.items[this.head]; }
  isEmpty() { return this.head >= this.items.length; }
}
\`\`\``,
  },
  {
    question: '二叉树的遍历方式有哪些？',
    tags: [{ text: '必问', type: 'must' }],
    answer: `**深度优先遍历（DFS）：**

1. **前序遍历：** 根 → 左 → 右
2. **中序遍历：** 左 → 根 → 右
3. **后序遍历：** 左 → 右 → 根

**广度优先遍历（BFS）：**
- **层序遍历：** 按层次从上到下、从左到右

**实现：**
\`\`\`javascript
// 前序遍历（递归）
function preorder(root) {
  if (!root) return [];
  return [root.val, ...preorder(root.left), ...preorder(root.right)];
}

// 中序遍历（迭代）
function inorder(root) {
  const result = [];
  const stack = [];
  let current = root;
  
  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }
  
  return result;
}

// 层序遍历（BFS）
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const level = [];
    const size = queue.length;
    
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}
\`\`\``,
  },
]

export const leetcodeQA: QAItem[] = [
  {
    question: '两数之和（Two Sum）',
    tags: [{ text: '简单', type: 'frequent' }],
    answer: `**题目：** 给定数组和目标值，找出和为目标值的两个数

**思路：** 使用哈希表存储已遍历的数

\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(com
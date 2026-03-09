<template>
  <div class="components-demo">
    <a-page-header
      title="Ant Design Vue 组件展示"
      sub-title="面试指南系统 UI 组件库"
      @back="$router.push('/dashboard')"
    />

    <div class="demo-content">
      <!-- 按钮展示 -->
      <a-card title="按钮 (Button)" class="demo-card">
        <a-space>
          <a-button type="primary">主要按钮</a-button>
          <a-button>默认按钮</a-button>
          <a-button type="dashed">虚线按钮</a-button>
          <a-button type="text">文本按钮</a-button>
          <a-button type="link">链接按钮</a-button>
        </a-space>
        <a-divider />
        <a-space>
          <a-button type="primary" shape="circle">
            <template #icon><SearchOutlined /></template>
          </a-button>
          <a-button type="primary" danger>危险按钮</a-button>
          <a-button type="primary" loading>加载中</a-button>
          <a-button type="primary" disabled>禁用</a-button>
        </a-space>
      </a-card>

      <!-- 输入框展示 -->
      <a-card title="输入框 (Input)" class="demo-card">
        <a-space direction="vertical" style="width: 100%">
          <a-input placeholder="基本输入框" />
          <a-input-search placeholder="搜索输入框" enter-button />
          <a-input-password placeholder="密码输入框" />
          <a-textarea placeholder="文本域" :rows="3" />
        </a-space>
      </a-card>

      <!-- 选择器展示 -->
      <a-card title="选择器 (Select)" class="demo-card">
        <a-space>
          <a-select
            v-model:value="selectedValue"
            style="width: 200px"
            placeholder="请选择"
          >
            <a-select-option value="frontend">前端开发</a-select-option>
            <a-select-option value="backend">后端开发</a-select-option>
            <a-select-option value="database">数据库</a-select-option>
            <a-select-option value="algorithm">算法</a-select-option>
          </a-select>
          <a-select
            v-model:value="multiSelected"
            mode="multiple"
            style="width: 300px"
            placeholder="多选"
          >
            <a-select-option value="vue">Vue</a-select-option>
            <a-select-option value="react">React</a-select-option>
            <a-select-option value="angular">Angular</a-select-option>
          </a-select>
        </a-space>
      </a-card>

      <!-- 标签页展示 -->
      <a-card title="标签页 (Tabs)" class="demo-card">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="面试题目">
            <p>这里是面试题目内容</p>
          </a-tab-pane>
          <a-tab-pane key="2" tab="学习进度">
            <p>这里是学习进度内容</p>
          </a-tab-pane>
          <a-tab-pane key="3" tab="统计数据">
            <p>这里是统计数据内容</p>
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <!-- 数据展示 -->
      <a-card title="数据展示 (Statistic)" class="demo-card">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-statistic title="已掌握题目" :value="128" suffix="道">
              <template #prefix><CheckCircleOutlined /></template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="连续学习" :value="15" suffix="天">
              <template #prefix><FireOutlined /></template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="总复习次数" :value="856" suffix="次">
              <template #prefix><ReloadOutlined /></template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="今日目标" :value="10" suffix="/ 20">
              <template #prefix><AimOutlined /></template>
            </a-statistic>
          </a-col>
        </a-row>
      </a-card>

      <!-- 进度条展示 -->
      <a-card title="进度条 (Progress)" class="demo-card">
        <a-space direction="vertical" style="width: 100%">
          <a-progress :percent="75" status="active" />
          <a-progress :percent="50" status="exception" />
          <a-progress :percent="100" />
          <a-progress :percent="60" type="circle" />
        </a-space>
      </a-card>

      <!-- 徽章展示 -->
      <a-card title="徽章 (Badge)" class="demo-card">
        <a-space :size="24">
          <a-badge count="5">
            <a-button>消息</a-button>
          </a-badge>
          <a-badge count="0" show-zero>
            <a-button>通知</a-button>
          </a-badge>
          <a-badge dot>
            <a-button>更新</a-button>
          </a-badge>
          <a-badge status="success" text="在线" />
          <a-badge status="warning" text="忙碌" />
          <a-badge status="error" text="离线" />
        </a-space>
      </a-card>

      <!-- 警告提示 -->
      <a-card title="警告提示 (Alert)" class="demo-card">
        <a-space direction="vertical" style="width: 100%">
          <a-alert message="成功提示" type="success" show-icon />
          <a-alert message="信息提示" type="info" show-icon />
          <a-alert message="警告提示" type="warning" show-icon closable />
          <a-alert
            message="错误提示"
            description="这里是对错误的详细描述信息"
            type="error"
            show-icon
          />
        </a-space>
      </a-card>

      <!-- 卡片展示 -->
      <a-card title="卡片 (Card)" class="demo-card">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-card hoverable>
              <template #cover>
                <div style="height: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;">
                  <CodeOutlined style="font-size: 48px; color: white;" />
                </div>
              </template>
              <a-card-meta title="前端面试题" description="Vue、React、HTML/CSS 等前端技术面试题" />
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card hoverable>
              <template #cover>
                <div style="height: 150px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center;">
                  <DatabaseOutlined style="font-size: 48px; color: white;" />
                </div>
              </template>
              <a-card-meta title="数据库面试题" description="MySQL、Redis、MongoDB 等数据库面试题" />
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card hoverable>
              <template #cover>
                <div style="height: 150px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center;">
                  <FunctionOutlined style="font-size: 48px; color: white;" />
                </div>
              </template>
              <a-card-meta title="算法面试题" description="数据结构、算法、LeetCode 等算法面试题" />
            </a-card>
          </a-col>
        </a-row>
      </a-card>

      <!-- 时间轴展示 -->
      <a-card title="时间轴 (Timeline)" class="demo-card">
        <a-timeline>
          <a-timeline-item color="green">
            <template #dot><CheckCircleOutlined style="font-size: 16px;" /></template>
            <p>完成 Vue 基础面试题 50 道</p>
            <p style="color: #999;">2024-01-15</p>
          </a-timeline-item>
          <a-timeline-item color="green">
            <template #dot><CheckCircleOutlined style="font-size: 16px;" /></template>
            <p>完成 JavaScript 进阶面试题 30 道</p>
            <p style="color: #999;">2024-01-14</p>
          </a-timeline-item>
          <a-timeline-item color="blue">
            <template #dot><SyncOutlined style="font-size: 16px;" /></template>
            <p>正在学习 React 面试题</p>
            <p style="color: #999;">进行中</p>
          </a-timeline-item>
          <a-timeline-item color="gray">
            <p>计划学习 Node.js 面试题</p>
            <p style="color: #999;">待开始</p>
          </a-timeline-item>
        </a-timeline>
      </a-card>

      <!-- 模态框展示 -->
      <a-card title="模态框 (Modal)" class="demo-card">
        <a-space>
          <a-button type="primary" @click="showModal = true">打开模态框</a-button>
          <a-button @click="showConfirm">确认对话框</a-button>
          <a-button @click="showInfo">信息提示</a-button>
        </a-space>
      </a-card>
    </div>

    <!-- 模态框 -->
    <a-modal
      v-model:open="showModal"
      title="面试题详情"
      @ok="showModal = false"
    >
      <p>这里是面试题的详细内容...</p>
      <p>你可以在这里展示题目、答案、解析等信息</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from 'ant-design-vue'
import {
  SearchOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ReloadOutlined,
  AimOutlined,
  CodeOutlined,
  DatabaseOutlined,
  FunctionOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue'

const selectedValue = ref<string | undefined>(undefined)
const multiSelected = ref<string[]>([])
const activeTab = ref('1')
const showModal = ref(false)

const showConfirm = () => {
  Modal.confirm({
    title: '确认提交?',
    content: '提交后将无法修改答案',
    onOk() {
      console.log('OK')
    },
  })
}

const showInfo = () => {
  Modal.info({
    title: '提示信息',
    content: '这是一段信息提示内容',
  })
}
</script>

<style scoped>
.components-demo {
  min-height: 100vh;
  background: #f0f2f5;
}

.demo-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 24px;
}

.demo-card :deep(.ant-card-head) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
}

.demo-card :deep(.ant-card-head-title) {
  color: white;
}
</style>

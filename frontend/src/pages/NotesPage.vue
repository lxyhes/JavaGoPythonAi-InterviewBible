<template>
  <div class="notes-page">
    <div class="page-header">
      <div class="header-left">
        <h1>
          <PhosphorIcon name="notebook" :size="28" weight="fill" />
          我的笔记
        </h1>
        <p class="header-desc">记录学习心得，形成自己的知识体系</p>
      </div>
      <div class="header-stats">
        <span class="note-count">{{ allNotes.length }} 条笔记</span>
      </div>
    </div>

    <!-- 搜索 -->
    <div class="search-bar">
      <PhosphorIcon name="magnifying-glass" :size="18" />
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="搜索笔记内容..."
        class="search-input"
      />
      <button v-if="searchKeyword" type="button" class="clear-btn" @click="searchKeyword = ''">
        <PhosphorIcon name="x" :size="16" />
      </button>
    </div>

    <!-- 笔记列表 -->
    <div v-if="filteredNotes.length > 0" class="notes-list">
      <router-link
        v-for="note in filteredNotes"
        :key="note.questionId"
        :to="getNoteLink(note.questionId)"
        class="note-card"
      >
        <div class="note-card-header">
          <span class="note-question">{{ getQuestionText(note.questionId) }}</span>
          <span class="note-category">{{ getCategoryLabel(note.questionId) }}</span>
        </div>
        <p class="note-content-preview">{{ truncate(note.content, 200) }}</p>
        <div class="note-card-footer">
          <span class="note-time">
            <PhosphorIcon name="clock" :size="14" />
            {{ formatDate(note.updatedAt) }}
          </span>
        </div>
      </router-link>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <PhosphorIcon name="notebook" :size="64" weight="thin" />
      <h3 v-if="searchKeyword">没有找到相关笔记</h3>
      <h3 v-else>还没有写过笔记</h3>
      <p v-if="!searchKeyword">在练习题目时，点击"我的笔记"来记录你的理解和心得</p>
      <router-link v-if="!searchKeyword" to="/practice" class="go-practice-btn">
        <PhosphorIcon name="book-open" :size="18" />
        去练习
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PhosphorIcon from '@/components/PhosphorIcon.vue'
import { useNotesStore, type NoteItem } from '@/stores/notes'
import { searchItems } from '@/data/search-index'
import type { SearchCategory } from '@/types/search'

const notesStore = useNotesStore()
const searchKeyword = ref('')

const itemMap = new Map(searchItems.map((item) => [item.id, item]))

const allNotes = computed(() => notesStore.getAllNotes())

const filteredNotes = computed(() => {
  if (!searchKeyword.value.trim()) return allNotes.value
  return notesStore.searchNotes(searchKeyword.value)
})

function getQuestionText(questionId: string): string {
  return itemMap.get(questionId)?.question ?? '已删除的题目'
}

function getCategoryLabel(questionId: string): string {
  const item = itemMap.get(questionId)
  if (!item) return ''
  const zhMap: Record<SearchCategory, string> = {
    frontend: '前端',
    backend: '后端',
    database: '数据库',
    algorithm: '算法',
    'system-design': '系统设计',
    devops: 'DevOps',
    network: '网络',
    os: '操作系统',
    ai: 'AI',
  }
  return zhMap[item.category] ?? item.category
}

function getNoteLink(questionId: string) {
  const item = itemMap.get(questionId)
  if (!item) return '/practice'
  return { path: item.path, hash: `#${item.anchor}` }
}

function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

function formatDate(value: string) {
  const d = new Date(value)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.notes-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-header h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
}

.page-header h1 :deep(svg) {
  color: var(--primary-500);
}

.header-desc {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin: 4px 0 0;
}

.note-count {
  font-size: 0.88rem;
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--bg-secondary);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: 14px;
  background: var(--card-bg);
  margin-bottom: 24px;
  transition: border-color 0.2s;
}

.search-bar:focus-within {
  border-color: var(--primary-400);
}

.search-bar :deep(svg) {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-muted);
  cursor: pointer;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--card-bg);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.note-card:hover {
  border-color: var(--primary-300);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.note-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.note-question {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.note-category {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-600);
  font-weight: 500;
  white-space: nowrap;
}

.note-content-preview {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-card-footer {
  display: flex;
  align-items: center;
}

.note-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.empty-state :deep(svg) {
  color: var(--text-muted);
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-secondary);
}

.empty-state p {
  font-size: 0.92rem;
  margin: 0 0 24px;
}

.go-practice-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  background: var(--gradient-primary);
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92rem;
  transition: all 0.2s;
}

.go-practice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: 8px;
  }

  .note-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>

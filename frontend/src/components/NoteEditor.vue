<template>
  <div class="note-editor">
    <div class="note-header" @click="toggleExpand">
      <div class="note-title">
        <PhosphorIcon name="note-pencil" :size="16" weight="fill" />
        <span>我的笔记</span>
        <span v-if="hasNote" class="note-badge">已记录</span>
      </div>
      <PhosphorIcon :name="isExpanded ? 'caret-up' : 'caret-down'" :size="16" />
    </div>

    <Transition name="slide">
      <div v-if="isExpanded" class="note-body">
        <textarea
          ref="textareaRef"
          v-model="noteContent"
          class="note-textarea"
          placeholder="记录你对这道题的理解、关键知识点、易错点..."
          rows="4"
          @input="handleInput"
        ></textarea>
        <div class="note-footer">
          <span v-if="lastSavedAt" class="save-status">
            <PhosphorIcon name="check-circle" :size="14" weight="fill" />
            {{ saveStatusText }}
          </span>
          <div class="note-actions">
            <button v-if="hasNote" type="button" class="delete-btn" @click="handleDelete">
              <PhosphorIcon name="trash" :size="14" />
              删除
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import PhosphorIcon from '@/components/PhosphorIcon.vue'
import { useNotesStore } from '@/stores/notes'

const props = defineProps<{
  questionId: string
}>()

const notesStore = useNotesStore()
const isExpanded = ref(false)
const noteContent = ref('')
const lastSavedAt = ref<string | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

let saveTimer: ReturnType<typeof setTimeout> | null = null

const hasNote = computed(() => {
  const note = notesStore.getNote(props.questionId)
  return note !== null && note.content.trim().length > 0
})

const saveStatusText = computed(() => {
  if (!lastSavedAt.value) return ''
  const d = new Date(lastSavedAt.value)
  return `已保存 ${d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
})

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function handleInput() {
  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(() => {
    if (noteContent.value.trim()) {
      notesStore.saveNote(props.questionId, noteContent.value)
      lastSavedAt.value = new Date().toISOString()
    } else {
      // If content is empty, delete the note
      notesStore.deleteNote(props.questionId)
      lastSavedAt.value = null
    }
  }, 800)
}

function handleDelete() {
  if (confirm('确定删除这条笔记吗？')) {
    notesStore.deleteNote(props.questionId)
    noteContent.value = ''
    lastSavedAt.value = null
  }
}

// Load existing note when question changes
watch(
  () => props.questionId,
  (id) => {
    const note = notesStore.getNote(id)
    noteContent.value = note?.content ?? ''
    lastSavedAt.value = note?.updatedAt ?? null
  },
  { immediate: true }
)

onMounted(() => {
  const note = notesStore.getNote(props.questionId)
  if (note) {
    noteContent.value = note.content
    lastSavedAt.value = note.updatedAt
    isExpanded.value = true
  }
})
</script>

<style scoped>
.note-editor {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.note-editor:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.note-header:hover {
  background: rgba(99, 102, 241, 0.03);
}

.note-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.note-title :deep(svg) {
  color: var(--primary-500);
}

.note-badge {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  font-weight: 600;
}

.note-body {
  padding: 0 16px 16px;
}

.note-textarea {
  width: 100%;
  padding: 12px;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.88rem;
  line-height: 1.7;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.note-textarea:focus {
  outline: none;
  border-color: var(--primary-400);
}

.note-textarea::placeholder {
  color: var(--text-muted);
}

.note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: #10b981;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  max-height: 300px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>

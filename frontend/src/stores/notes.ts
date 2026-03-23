import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface NoteItem {
  questionId: string
  content: string
  createdAt: string
  updatedAt: string
}

const NOTES_KEY = 'mianshi-notes-v1'

const loadJSON = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return (JSON.parse(raw) as T) ?? fallback
  } catch {
    return fallback
  }
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Record<string, NoteItem>>(loadJSON<Record<string, NoteItem>>(NOTES_KEY, {}))

  const persist = () => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes.value))
  }

  const getNote = (questionId: string): NoteItem | null => {
    return notes.value[questionId] ?? null
  }

  const saveNote = (questionId: string, content: string) => {
    const now = new Date().toISOString()
    const existing = notes.value[questionId]

    notes.value[questionId] = {
      questionId,
      content,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }

    persist()
  }

  const deleteNote = (questionId: string) => {
    delete notes.value[questionId]
    persist()
  }

  const getAllNotes = (): NoteItem[] => {
    return Object.values(notes.value).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  const noteCount = () => Object.keys(notes.value).length

  const searchNotes = (keyword: string): NoteItem[] => {
    if (!keyword.trim()) return getAllNotes()
    const q = keyword.toLowerCase()
    return getAllNotes().filter((note) => note.content.toLowerCase().includes(q))
  }

  return {
    notes,
    getNote,
    saveNote,
    deleteNote,
    getAllNotes,
    noteCount,
    searchNotes,
  }
})

<template>
  <div class="community-page">
    <header class="header">
      <router-link to="/" class="back-link">{{ t('common.backHome') }}</router-link>
      <h1>{{ t('community.title') }}</h1>
      <p>{{ t('community.subtitle') }}</p>
    </header>

    <div class="community-layout">
      <aside class="sidebar">
        <div class="category-filter">
          <h3>{{ t('community.categories') }}</h3>
          <nav class="filter-list">
            <button
              v-for="cat in categoryOptions"
              :key="cat.value"
              :class="['filter-btn', { active: filter.category === cat.value }]"
              @click="setCategory(cat.value)"
            >
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-label">{{ cat.label }}</span>
              <span class="cat-count">{{ categoryStats[cat.value as keyof typeof categoryStats] || 0 }}</span>
            </button>
          </nav>
        </div>

        <div class="hot-tags">
          <h3>{{ t('community.hotTags') }}</h3>
          <div class="tag-cloud">
            <button
              v-for="tag in hotTags"
              :key="tag"
              :class="['tag-btn', { active: filter.tag === tag }]"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <div class="toolbar">
          <div class="sort-tabs">
            <button
              v-for="tab in sortTabs"
              :key="tab.value"
              :class="['tab-btn', { active: filter.sortBy === tab.value }]"
              @click="setSortBy(tab.value)"
            >
              {{ tab.label }}
            </button>
          </div>
          <button class="new-post-btn" @click="showNewPostModal = true">
            {{ t('community.newPost') }}
          </button>
        </div>

        <div class="posts-list">
          <article
            v-for="post in filteredPosts"
            :key="post.id"
            :class="['post-card', { pinned: post.isPinned }]"
            @click="goToPost(post.id)"
          >
            <div v-if="post.isPinned" class="pin-badge">📌 {{ t('community.pinned') }}</div>
            <div class="post-header">
              <div class="author-info">
                <div class="avatar">{{ post.authorName[0] }}</div>
                <div class="meta">
                  <span class="author-name">{{ post.authorName }}</span>
                  <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                </div>
              </div>
              <span class="category-badge" :class="post.category">{{ categoryLabel(post.category) }}</span>
            </div>

            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ excerpt(post.content) }}</p>

            <div class="post-tags">
              <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
            </div>

            <div class="post-stats">
              <span class="stat">
                <span class="stat-icon">👁</span>
                {{ post.views }}
              </span>
              <span class="stat">
                <span class="stat-icon">💬</span>
                {{ post.commentCount }}
              </span>
              <span class="stat" :class="{ liked: post.isLiked }" @click.stop="toggleLike(post.id)">
                <span class="stat-icon">{{ post.isLiked ? '❤️' : '🤍' }}</span>
                {{ post.likes }}
              </span>
            </div>
          </article>

          <div v-if="filteredPosts.length === 0" class="empty-state">
            <p>{{ t('community.noPosts') }}</p>
          </div>
        </div>
      </main>
    </div>

    <!-- New Post Modal -->
    <Teleport to="body">
      <div v-if="showNewPostModal" class="modal-overlay" @click.self="showNewPostModal = false">
        <div class="modal-content">
          <header class="modal-header">
            <h2>{{ t('community.createPost') }}</h2>
            <button class="close-btn" @click="showNewPostModal = false">×</button>
          </header>

          <form class="post-form" @submit.prevent="submitPost">
            <div class="form-group">
              <label>{{ t('community.postTitle') }}</label>
              <input
                v-model="newPost.title"
                type="text"
                :placeholder="t('community.titlePlaceholder')"
                required
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label>{{ t('community.postCategory') }}</label>
              <div class="category-options">
                <label
                  v-for="cat in categoryOptions.filter(c => c.value !== 'all')"
                  :key="cat.value"
                  :class="['category-option', { selected: newPost.category === cat.value }]"
                >
                  <input
                    v-model="newPost.category"
                    type="radio"
                    :value="cat.value"
                    required
                  />
                  <span class="option-icon">{{ cat.icon }}</span>
                  <span>{{ cat.label }}</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('community.postContent') }}</label>
              <textarea
                v-model="newPost.content"
                :placeholder="t('community.contentPlaceholder')"
                required
                rows="8"
                maxlength="5000"
              />
            </div>

            <div class="form-group">
              <label>{{ t('community.postTags') }}</label>
              <input
                v-model="tagInput"
                type="text"
                :placeholder="t('community.tagsPlaceholder')"
                @keydown.enter.prevent="addTag"
              />
              <div v-if="newPost.tags.length" class="selected-tags">
                <span v-for="tag in newPost.tags" :key="tag" class="selected-tag">
                  {{ tag }}
                  <button type="button" @click="removeTag(tag)">×</button>
                </span>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showNewPostModal = false">
                {{ t('common.cancel') }}
              </button>
              <button type="submit" class="submit-btn" :disabled="!isValidPost">
                {{ t('community.publish') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useCommunityStore, type CommunityFilter } from '@/stores/community'

const router = useRouter()
const i18nStore = useI18nStore()
const communityStore = useCommunityStore()
const t = i18nStore.t

const filter = reactive<CommunityFilter>({
  category: 'all',
  sortBy: 'latest',
  tag: undefined,
})

const showNewPostModal = ref(false)
const tagInput = ref('')

const newPost = reactive({
  title: '',
  content: '',
  category: 'discussion' as const,
  tags: [] as string[],
})

const categoryOptions = computed(() => [
  { value: 'all', label: t('community.catAll'), icon: '📋' },
  { value: 'discussion', label: t('community.catDiscussion'), icon: '💬' },
  { value: 'question', label: t('community.catQuestion'), icon: '❓' },
  { value: 'share', label: t('community.catShare'), icon: '📤' },
  { value: 'experience', label: t('community.catExperience'), icon: '📝' },
])

const sortTabs = computed(() => [
  { value: 'latest' as const, label: t('community.sortLatest') },
  { value: 'hot' as const, label: t('community.sortHot') },
  { value: 'mostLiked' as const, label: t('community.sortLiked') },
])

const filteredPosts = computed(() => communityStore.filteredPosts(filter))
const hotTags = computed(() => communityStore.hotTags)
const categoryStats = computed(() => communityStore.categoryStats)

const isValidPost = computed(() => {
  return newPost.title.trim() && newPost.content.trim() && newPost.category
})

const setCategory = (category: string) => {
  filter.category = category
}

const setSortBy = (sortBy: CommunityFilter['sortBy']) => {
  filter.sortBy = sortBy
}

const toggleTag = (tag: string) => {
  filter.tag = filter.tag === tag ? undefined : tag
}

const categoryLabel = (category: string) => {
  const option = categoryOptions.value.find(c => c.value === category)
  return option?.label ?? category
}

const formatTime = (value: string) => {
  const date = new Date(value)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return t('community.justNow')
  if (minutes < 60) return t('community.minutesAgo', { n: minutes })
  if (hours < 24) return t('community.hoursAgo', { n: hours })
  if (days < 30) return t('community.daysAgo', { n: days })
  return date.toLocaleDateString(i18nStore.locale === 'zh' ? 'zh-CN' : 'en-US')
}

const excerpt = (content: string) => {
  return content.slice(0, 200) + (content.length > 200 ? '...' : '')
}

const goToPost = (id: string) => {
  router.push(`/community/post/${id}`)
}

const toggleLike = (postId: string) => {
  communityStore.togglePostLike(postId)
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !newPost.tags.includes(tag) && newPost.tags.length < 5) {
    newPost.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  newPost.tags = newPost.tags.filter(t => t !== tag)
}

const submitPost = () => {
  if (!isValidPost.value) return

  communityStore.createPost({
    title: newPost.title.trim(),
    content: newPost.content.trim(),
    category: newPost.category,
    tags: [...newPost.tags],
  })

  // Reset form
  newPost.title = ''
  newPost.content = ''
  newPost.category = 'discussion'
  newPost.tags = []
  tagInput.value = ''
  showNewPostModal.value = false
}
</script>

<style scoped>
.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 20px 56px;
}

.header {
  margin-bottom: 24px;
}

.back-link {
  color: var(--text-tertiary);
  text-decoration: none;
  font-size: 0.9rem;
}

.header h1 {
  margin-top: 10px;
  font-size: 2.1rem;
}

.header p {
  color: var(--text-tertiary);
  margin-top: 6px;
}

.community-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

.sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.sidebar h3 {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-filter,
.hot-tags {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: var(--bg-secondary);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
}

.cat-icon {
  font-size: 1rem;
}

.cat-label {
  flex: 1;
  text-align: left;
}

.cat-count {
  font-size: 0.75rem;
  opacity: 0.7;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 4px 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 999px;
  font-size: 0.8rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.tag-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tag-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.main-content {
  min-width: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
  flex-wrap: wrap;
}

.sort-tabs {
  display: flex;
  gap: 4px;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85rem;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: var(--primary-color);
}

.tab-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.new-post-btn {
  padding: 10px 20px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.new-post-btn:hover {
  opacity: 0.9;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.post-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.post-card.pinned {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.pin-badge {
  display: inline-block;
  font-size: 0.75rem;
  color: #f59e0b;
  margin-bottom: 8px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.post-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.category-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.category-badge.discussion {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.category-badge.question {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.category-badge.share {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.category-badge.experience {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.post-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
}

.post-excerpt {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.post-tag {
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.post-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.stat-icon {
  font-size: 0.9rem;
}

.stat.liked {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
}

.post-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.category-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.category-option:hover {
  border-color: var(--primary-color);
}

.category-option.selected {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
}

.category-option input {
  display: none;
}

.option-icon {
  font-size: 1.2rem;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--primary-color);
  color: white;
  border-radius: 999px;
  font-size: 0.8rem;
}

.selected-tag button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
}

.submit-btn {
  padding: 10px 24px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .community-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .category-filter,
  .hot-tags {
    margin-bottom: 0;
  }
}

@media (max-width: 640px) {
  .sidebar {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-tabs {
    justify-content: center;
  }

  .category-options {
    grid-template-columns: 1fr;
  }
}
</style>

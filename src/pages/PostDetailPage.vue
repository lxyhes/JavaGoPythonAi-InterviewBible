<template>
  <div v-if="post" class="post-detail-page">
    <header class="header">
      <router-link to="/community" class="back-link">← {{ t('community.backToList') }}</router-link>
    </header>

    <article class="post-content">
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

      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-body">{{ post.content }}</div>

      <div class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
      </div>

      <div class="post-actions">
        <button
          :class="['action-btn', { active: post.isLiked }]"
          @click="toggleLike"
        >
          <PhosphorIcon :name="post.isLiked ? 'Heart' : 'HeartStraight'" class="action-icon" :weight="post.isLiked ? 'fill' : 'regular'" />
          <span>{{ post.likes }} {{ t('community.likes') }}</span>
        </button>
        <span class="views-count">
          <PhosphorIcon name="Eye" class="action-icon" />
          {{ post.views }} {{ t('community.views') }}
        </span>
      </div>
    </article>

    <section class="comments-section">
      <h2>{{ t('community.comments') }} ({{ comments.length }})</h2>

      <div class="comment-form">
        <div class="avatar">{{ communityStore.currentUser.name[0] }}</div>
        <div class="input-wrapper">
          <textarea
            v-model="newComment"
            :placeholder="t('community.writeComment')"
            rows="3"
            @keydown.ctrl.enter="submitComment"
          />
          <div class="form-hint">
            <span>Ctrl + Enter {{ t('community.toSubmit') }}</span>
            <button
              class="submit-comment-btn"
              :disabled="!newComment.trim()"
              @click="submitComment"
            >
              {{ t('community.submitComment') }}
            </button>
          </div>
        </div>
      </div>

      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="avatar">{{ comment.authorName[0] }}</div>
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-author">{{ comment.authorName }}</span>
              <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
            <div class="comment-actions">
              <button
                :class="['like-btn', { liked: comment.isLiked }]"
                @click="toggleCommentLike(comment.id)"
              >
                <PhosphorIcon :name="comment.isLiked ? 'Heart' : 'HeartStraight'" :weight="comment.isLiked ? 'fill' : 'regular'" /> {{ comment.likes }}
              </button>
              <button class="reply-btn" @click="replyTo(comment.id)">
                {{ t('community.reply') }}
              </button>
            </div>

            <!-- Replies -->
            <div v-if="comment.replies?.length" class="replies">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <div class="avatar small">{{ reply.authorName[0] }}</div>
                <div class="reply-body">
                  <div class="reply-header">
                    <span class="reply-author">{{ reply.authorName }}</span>
                    <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                  </div>
                  <p class="reply-content">{{ reply.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="comments.length === 0" class="empty-comments">
          <p>{{ t('community.noComments') }}</p>
          <p class="empty-hint">{{ t('community.beFirstComment') }}</p>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <p>{{ t('community.postNotFound') }}</p>
    <router-link to="/community">{{ t('community.backToList') }}</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useCommunityStore } from '@/stores/community'
import PhosphorIcon from '@/components/PhosphorIcon.vue'

const route = useRoute()
const i18nStore = useI18nStore()
const communityStore = useCommunityStore()
const t = i18nStore.t

const postId = computed(() => route.params.id as string)
const post = computed(() => communityStore.getPostById(postId.value))
const comments = computed(() => communityStore.getCommentsByPostId(postId.value))

const newComment = ref('')
const replyingTo = ref<string | null>(null)

const categoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    discussion: t('community.catDiscussion'),
    question: t('community.catQuestion'),
    share: t('community.catShare'),
    experience: t('community.catExperience'),
  }
  return labels[category] ?? category
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

const toggleLike = () => {
  if (post.value) {
    communityStore.togglePostLike(post.value.id)
  }
}

const toggleCommentLike = (commentId: string) => {
  communityStore.toggleCommentLike(commentId)
}

const replyTo = (commentId: string) => {
  replyingTo.value = commentId
  newComment.value = ''
  // Focus the textarea
  const textarea = document.querySelector('.comment-form textarea') as HTMLTextAreaElement
  textarea?.focus()
}

const submitComment = () => {
  if (!newComment.value.trim() || !post.value) return

  communityStore.addComment(
    post.value.id,
    newComment.value.trim(),
    replyingTo.value ?? undefined
  )

  newComment.value = ''
  replyingTo.value = null
}

onMounted(() => {
  if (post.value) {
    communityStore.incrementViews(post.value.id)
  }
})
</script>

<style scoped>
.post-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 36px 20px 56px;
}

.header {
  margin-bottom: 20px;
}

.back-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.post-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 28px;
  margin-bottom: 24px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  flex-shrink: 0;
}

.avatar.small {
  width: 32px;
  height: 32px;
  font-size: 0.8rem;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 1rem;
  font-weight: 600;
}

.post-time {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.category-badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
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
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 20px;
}

.post-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  white-space: pre-wrap;
  margin-bottom: 24px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.post-tag {
  padding: 4px 12px;
  background: var(--bg-secondary);
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: var(--primary-color);
}

.action-btn.active {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}

.action-icon {
  font-size: 1.1rem;
}

.views-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.comments-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
}

.comments-section h2 {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.comment-form {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.input-wrapper {
  flex: 1;
}

.input-wrapper textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.95rem;
  resize: vertical;
  min-height: 80px;
}

.input-wrapper textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-hint {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.form-hint span {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.submit-comment-btn {
  padding: 8px 16px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
}

.submit-comment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-author {
  font-weight: 600;
  font-size: 0.9rem;
}

.comment-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.comment-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.like-btn,
.reply-btn {
  padding: 4px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.like-btn:hover,
.reply-btn:hover {
  background: var(--bg-secondary);
}

.like-btn.liked {
  color: #ef4444;
}

.replies {
  margin-top: 16px;
  padding-left: 16px;
  border-left: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reply-item {
  display: flex;
  gap: 10px;
}

.reply-body {
  flex: 1;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.reply-author {
  font-weight: 500;
  font-size: 0.85rem;
}

.reply-time {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.reply-content {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.empty-comments {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-tertiary);
}

.empty-hint {
  font-size: 0.85rem;
  margin-top: 8px;
}

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.not-found a {
  color: var(--primary-color);
  text-decoration: none;
}

@media (max-width: 640px) {
  .post-content {
    padding: 20px;
  }

  .post-title {
    font-size: 1.3rem;
  }

  .comment-form {
    flex-direction: column;
  }

  .comment-form .avatar {
    display: none;
  }
}
</style>

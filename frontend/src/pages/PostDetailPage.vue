<template>
  <div v-if="post" class="post-detail-page">
    <a-page-header @back="() => $router.push('/community')">
      <template #title>
        <a-space>
          <a-avatar :style="{ background: 'var(--primary-gradient)' }">
            {{ post.authorName[0] }}
          </a-avatar>
          <a-space direction="vertical" size="small">
            <a-typography-text strong>{{ post.authorName }}</a-typography-text>
            <a-typography-text type="secondary" style="font-size: 0.75rem">
              {{ formatTime(post.createdAt) }}
            </a-typography-text>
          </a-space>
        </a-space>
      </template>
      <template #extra>
        <a-tag :color="categoryColorMap[post.category]">
          {{ categoryLabel(post.category) }}
        </a-tag>
      </template>
    </a-page-header>

    <a-card class="post-content">
      <a-typography-title :level="2">{{ post.title }}</a-typography-title>
      <a-typography-paragraph style="white-space: pre-wrap">
        {{ post.content }}
      </a-typography-paragraph>

      <a-space wrap style="margin: 16px 0">
        <a-tag v-for="tag in post.tags" :key="tag" color="default">
          {{ tag }}
        </a-tag>
      </a-space>

      <a-divider />

      <a-space>
        <a-button
          :type="post.isLiked ? 'primary' : 'default'"
          :danger="post.isLiked"
          @click="toggleLike"
        >
          <HeartFilled v-if="post.isLiked" />
          <HeartOutlined v-else />
          {{ post.likes }} {{ t('community.likes') }}
        </a-button>
        <a-typography-text type="secondary">
          <EyeOutlined /> {{ post.views }} {{ t('community.views') }}
        </a-typography-text>
      </a-space>
    </a-card>

    <a-card :title="`${t('community.comments')} (${comments.length})`" class="comments-section">
      <a-comment>
        <template #avatar>
          <a-avatar :style="{ background: 'var(--primary-gradient)' }">
            {{ communityStore.currentUser.name[0] }}
          </a-avatar>
        </template>
        <template #content>
          <a-form @finish="submitComment">
            <a-form-item>
              <a-textarea
                v-model:value="newComment"
                :rows="3"
                :placeholder="t('community.writeComment')"
                @pressEnter.ctrl="submitComment"
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-typography-text type="secondary" style="font-size: 0.75rem">
                  Ctrl + Enter {{ t('community.toSubmit') }}
                </a-typography-text>
                <a-button
                  type="primary"
                  html-type="submit"
                  :disabled="!newComment.trim()"
                >
                  {{ t('community.submitComment') }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </template>
      </a-comment>

      <a-list
        :data-source="comments"
        item-layout="horizontal"
        class="comments-list"
      >
        <template #renderItem="{ item: comment }">
          <a-comment>
            <template #avatar>
              <a-avatar :style="{ background: 'var(--primary-gradient)' }">
                {{ comment.authorName[0] }}
              </a-avatar>
            </template>
            <template #author>
              <a-typography-text strong>{{ comment.authorName }}</a-typography-text>
            </template>
            <template #datetime>
              <a-tooltip :title="comment.createdAt">
                <span>{{ formatTime(comment.createdAt) }}</span>
              </a-tooltip>
            </template>
            <template #content>
              <p>{{ comment.content }}</p>
            </template>
            <template #actions>
              <span @click="toggleCommentLike(comment.id)">
                <HeartFilled v-if="comment.isLiked" style="color: #ff4d4f" />
                <HeartOutlined v-else />
                {{ comment.likes }}
              </span>
              <span @click="replyTo(comment.id)">
                {{ t('community.reply') }}
              </span>
            </template>

            <!-- Replies -->
            <template v-if="comment.replies?.length" #children>
              <a-comment
                v-for="reply in comment.replies"
                :key="reply.id"
              >
                <template #avatar>
                  <a-avatar :size="32" :style="{ background: 'var(--primary-gradient)' }">
                    {{ reply.authorName[0] }}
                  </a-avatar>
                </template>
                <template #author>
                  <a-typography-text strong>{{ reply.authorName }}</a-typography-text>
                </template>
                <template #datetime>
                  <a-tooltip :title="reply.createdAt">
                    <span>{{ formatTime(reply.createdAt) }}</span>
                  </a-tooltip>
                </template>
                <template #content>
                  <p>{{ reply.content }}</p>
                </template>
              </a-comment>
            </template>
          </a-comment>
        </template>
      </a-list>

      <a-empty
        v-if="comments.length === 0"
        :description="t('community.noComments')"
      >
        <template #image>
          <MessageOutlined style="font-size: 48px; color: #bfbfbf" />
        </template>
        <a-typography-text type="secondary">
          {{ t('community.beFirstComment') }}
        </a-typography-text>
      </a-empty>
    </a-card>
  </div>

  <div v-else class="not-found">
    <a-result
      status="404"
      :title="t('community.postNotFound')"
    >
      <template #extra>
        <a-button type="primary" @click="$router.push('/community')">
          {{ t('community.backToList') }}
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import {
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useCommunityStore } from '@/stores/community'

const route = useRoute()
const i18nStore = useI18nStore()
const communityStore = useCommunityStore()
const t = i18nStore.t

const postId = computed(() => route.params.id as string)
const post = computed(() => communityStore.getPostById(postId.value))
const comments = computed(() => communityStore.getCommentsByPostId(postId.value))

const newComment = ref('')
const replyingTo = ref<string | null>(null)

const categoryColorMap: Record<string, string> = {
  discussion: 'blue',
  question: 'orange',
  share: 'green',
  experience: 'purple',
}

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
  const textarea = document.querySelector('.comments-section textarea') as HTMLTextAreaElement
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
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px 56px;
}

.post-content {
  margin-top: 16px;
}

.comments-section {
  margin-top: 24px;
}

.comments-list {
  margin-top: 24px;
}

.not-found {
  padding: 80px 20px;
}

:deep(.ant-comment) {
  margin-bottom: 16px;
}

:deep(.ant-comment-actions) {
  margin-top: 8px;
}

:deep(.ant-comment-actions > span) {
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.3s;
}

:deep(.ant-comment-actions > span:hover) {
  color: var(--primary-color);
}
</style>

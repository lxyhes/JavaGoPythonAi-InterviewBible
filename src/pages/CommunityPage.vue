<template>
  <div class="community-page">
    <a-page-header
      :title="t('community.title')"
      :sub-title="t('community.subtitle')"
      @back="() => $router.push('/dashboard')"
    />

    <a-row :gutter="[24, 24]" class="community-layout">
      <a-col :xs="24" :lg="6">
        <a-space direction="vertical" style="width: 100%">
          <a-card :title="t('community.categories')" class="category-filter">
            <a-menu
              v-model:selectedKeys="selectedCategoryKeys"
              mode="vertical"
              @click="handleCategoryClick"
            >
              <a-menu-item v-for="cat in categoryOptions" :key="cat.value">
                <template #icon>
                  <component :is="cat.icon" />
                </template>
                <span>{{ cat.label }}</span>
                <a-badge
                  :count="categoryStats[cat.value as keyof typeof categoryStats] || 0"
                  :number-style="{ backgroundColor: '#1890ff' }"
                  style="margin-left: auto"
                />
              </a-menu-item>
            </a-menu>
          </a-card>

          <a-card :title="t('community.hotTags')" class="hot-tags">
            <a-space wrap>
              <a-checkable-tag
                v-for="tag in hotTags"
                :key="tag"
                :checked="filter.tag === tag"
                @change="() => toggleTag(tag)"
              >
                {{ tag }}
              </a-checkable-tag>
            </a-space>
          </a-card>
        </a-space>
      </a-col>

      <a-col :xs="24" :lg="18">
        <a-card :bordered="false" class="main-content">
          <template #title>
            <a-radio-group v-model:value="filter.sortBy" button-style="solid">
              <a-radio-button v-for="tab in sortTabs" :key="tab.value" :value="tab.value">
                {{ tab.label }}
              </a-radio-button>
            </a-radio-group>
          </template>
          <template #extra>
            <a-button type="primary" @click="showNewPostModal = true">
              <EditOutlined />
              {{ t('community.newPost') }}
            </a-button>
          </template>

          <a-list
            :data-source="filteredPosts"
            :pagination="{ pageSize: 10 }"
            class="posts-list"
          >
            <template #renderItem="{ item: post }">
              <a-list-item>
                <a-card
                  :class="['post-card', { pinned: post.isPinned }]"
                  hoverable
                  @click="goToPost(post.id)"
                >
                  <template v-if="post.isPinned" #title>
                    <a-space>
                      <PushpinFilled style="color: #f59e0b" />
                      <span>{{ t('community.pinned') }}</span>
                    </a-space>
                  </template>

                  <a-space direction="vertical" style="width: 100%" size="middle">
                    <a-space align="center">
                      <a-avatar :style="{ background: 'var(--primary-gradient)' }">
                        {{ post.authorName[0] }}
                      </a-avatar>
                      <a-space direction="vertical" size="small">
                        <a-typography-text strong>{{ post.authorName }}</a-typography-text>
                        <a-typography-text type="secondary" style="font-size: 0.75rem">
                          {{ formatTime(post.createdAt) }}
                        </a-typography-text>
                      </a-space>
                      <a-tag :color="categoryColorMap[post.category]">
                        {{ categoryLabel(post.category) }}
                      </a-tag>
                    </a-space>

                    <a-typography-title :level="4" style="margin: 0">
                      {{ post.title }}
                    </a-typography-title>

                    <a-typography-paragraph
                      type="secondary"
                      :ellipsis="{ rows: 2 }"
                      style="margin-bottom: 0"
                    >
                      {{ excerpt(post.content) }}
                    </a-typography-paragraph>

                    <a-space wrap>
                      <a-tag v-for="tag in post.tags" :key="tag" color="default">
                        {{ tag }}
                      </a-tag>
                    </a-space>

                    <a-divider style="margin: 8px 0" />

                    <a-space>
                      <a-typography-text type="secondary">
                        <EyeOutlined /> {{ post.views }}
                      </a-typography-text>
                      <a-typography-text type="secondary">
                        <MessageOutlined /> {{ post.commentCount }}
                      </a-typography-text>
                      <a-typography-text
                        :type="post.isLiked ? 'danger' : 'secondary'"
                        style="cursor: pointer"
                        @click.stop="toggleLike(post.id)"
                      >
                        <HeartFilled v-if="post.isLiked" />
                        <HeartOutlined v-else />
                        {{ post.likes }}
                      </a-typography-text>
                    </a-space>
                  </a-space>
                </a-card>
              </a-list-item>
            </template>

            <template v-if="filteredPosts.length === 0" #empty>
              <a-empty :description="t('community.noPosts')" />
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <!-- New Post Modal -->
    <a-modal
      v-model:open="showNewPostModal"
      :title="t('community.createPost')"
      width="600px"
      @ok="submitPost"
      @cancel="showNewPostModal = false"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('community.postTitle')" required>
          <a-input
            v-model:value="newPost.title"
            :placeholder="t('community.titlePlaceholder')"
            :maxlength="100"
            show-count
          />
        </a-form-item>

        <a-form-item :label="t('community.postCategory')" required>
          <a-radio-group v-model:value="newPost.category">
            <a-radio-button
              v-for="cat in categoryOptions.filter(c => c.value !== 'all')"
              :key="cat.value"
              :value="cat.value"
            >
              {{ cat.label }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item :label="t('community.postContent')" required>
          <a-textarea
            v-model:value="newPost.content"
            :placeholder="t('community.contentPlaceholder')"
            :rows="6"
            :maxlength="5000"
            show-count
          />
        </a-form-item>

        <a-form-item :label="t('community.postTags')">
          <a-input
            v-model:value="tagInput"
            :placeholder="t('community.tagsPlaceholder')"
            @pressEnter.prevent="addTag"
          />
          <a-space v-if="newPost.tags.length" wrap style="margin-top: 8px">
            <a-tag
              v-for="tag in newPost.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
            >
              {{ tag }}
            </a-tag>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  HeartOutlined,
  HeartFilled,
  PushpinFilled,
  AppstoreOutlined,
  MessageFilled,
  QuestionCircleFilled,
  ShareAltOutlined,
  FileTextFilled,
} from '@ant-design/icons-vue'
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

const selectedCategoryKeys = ref(['all'])

const showNewPostModal = ref(false)
const tagInput = ref('')

const newPost = reactive({
  title: '',
  content: '',
  category: 'discussion' as const,
  tags: [] as string[],
})

const categoryOptions = computed(() => [
  { value: 'all', label: t('community.catAll'), icon: AppstoreOutlined },
  { value: 'discussion', label: t('community.catDiscussion'), icon: MessageFilled },
  { value: 'question', label: t('community.catQuestion'), icon: QuestionCircleFilled },
  { value: 'share', label: t('community.catShare'), icon: ShareAltOutlined },
  { value: 'experience', label: t('community.catExperience'), icon: FileTextFilled },
])

const categoryColorMap: Record<string, string> = {
  discussion: 'blue',
  question: 'orange',
  share: 'green',
  experience: 'purple',
}

const sortTabs = computed(() => [
  { value: 'latest' as const, label: t('community.sortLatest') },
  { value: 'hot' as const, label: t('community.sortHot') },
  { value: 'mostLiked' as const, label: t('community.sortLiked') },
])

const filteredPosts = computed(() => communityStore.filteredPosts(filter))
const hotTags = computed(() => communityStore.hotTags)
const categoryStats = computed(() => communityStore.categoryStats)

const handleCategoryClick = ({ key }: { key: string }) => {
  filter.category = key
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
  if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) return

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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 56px;
}

.community-layout {
  margin-top: 16px;
}

.category-filter,
.hot-tags {
  position: sticky;
  top: 20px;
}

.main-content {
  min-height: 600px;
}

.post-card {
  width: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-card.pinned {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.02);
}

:deep(.ant-list-item) {
  padding: 8px 0;
}

:deep(.ant-menu-item) {
  display: flex;
  align-items: center;
}

@media (max-width: 992px) {
  .category-filter,
  .hot-tags {
    position: static;
  }
}
</style>

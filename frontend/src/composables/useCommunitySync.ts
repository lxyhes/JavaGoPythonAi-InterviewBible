import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Community types
export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  category: string
  tags?: string[]
  isPinned: boolean
  likeCount: number
  viewCount: number
  commentCount: number
  createdAt: string
}

export interface Comment {
  id: string
  postId: string
  parentId?: string
  content: string
  authorId: string
  authorName: string
  likeCount: number
  createdAt: string
}

/**
 * Community 后端同步工具
 * 注意：后端 API 需要实现对应的 CommunityController
 */
export function useCommunitySync() {
  const authStore = useAuthStore()
  const posts = ref<Post[]>([])
  const comments = ref<Comment[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取帖子列表
   */
  const fetchPosts = async (_category?: string, _page = 0, _size = 20) => {
    if (!authStore.isLoggedIn) return []
    isLoading.value = true
    error.value = null

    try {
      // TODO: 调用后端 API
      // const response = await communityApi.getPosts({ category, page, size })
      // return response.data || []
      return []
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取帖子详情
   */
  const fetchPostById = async (_postId: string) => {
    if (!authStore.isLoggedIn) return null
    try {
      // TODO: 调用后端 API
      // const response = await communityApi.getPostById(postId)
      // return response.data
      return null
    } catch (error) {
      console.error('Failed to fetch post:', error)
      return null
    }
  }

  /**
   * 创建帖子
   */
  const createPost = async (_title: string, _content: string, _category: string, _tags?: string[]) => {
    if (!authStore.isLoggedIn) return null
    try {
      // TODO: 调用后端 API
      // const response = await communityApi.createPost({ title, content, category, tags })
      // return response.data
      return null
    } catch (error) {
      console.error('Failed to create post:', error)
      return null
    }
  }

  /**
   * 获取评论
   */
  const fetchComments = async (_postId: string) => {
    if (!authStore.isLoggedIn) return []
    try {
      // TODO: 调用后端 API
      // const response = await communityApi.getComments(postId)
      // return response.data || []
      return []
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      return []
    }
  }

  /**
   * 创建评论
   */
  const createComment = async (_postId: string, _content: string, _parentId?: string) => {
    if (!authStore.isLoggedIn) return null
    try {
      // TODO: 调用后端 API
      // const response = await communityApi.createComment({ postId, content, parentId })
      // return response.data
      return null
    } catch (error) {
      console.error('Failed to create comment:', error)
      return null
    }
  }

  return {
    posts,
    comments,
    isLoading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    fetchComments,
    createComment,
  }
}

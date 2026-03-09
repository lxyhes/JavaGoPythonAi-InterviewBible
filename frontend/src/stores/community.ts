import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  title: string
  content: string
  category: 'discussion' | 'question' | 'share' | 'experience'
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  views: number
  commentCount: number
  isLiked?: boolean
  isPinned?: boolean
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  likes: number
  isLiked?: boolean
  parentId?: string
  replies?: Comment[]
}

export interface CommunityFilter {
  category?: string
  sortBy: 'latest' | 'hot' | 'mostLiked'
  tag?: string
}

const POSTS_STORAGE_KEY = 'mianshi-community-posts-v1'
const COMMENTS_STORAGE_KEY = 'mianshi-community-comments-v1'
const USER_POSTS_LIKED_KEY = 'mianshi-community-liked-posts-v1'
const USER_COMMENTS_LIKED_KEY = 'mianshi-community-liked-comments-v1'

// Generate mock data for demonstration
const generateMockPosts = (): CommunityPost[] => {
  const now = new Date()
  const mockPosts: CommunityPost[] = [
    {
      id: 'post-1',
      authorId: 'user-1',
      authorName: '前端小王',
      title: '面试字节跳动前端岗的经验分享',
      content: '最近刚面完字节跳动的前端岗位，想和大家分享一下面试经验。整体流程分为4轮技术面+1轮HR面...',
      category: 'experience',
      tags: ['字节跳动', '前端', '面试经验'],
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 128,
      views: 2340,
      commentCount: 45,
      isPinned: true,
    },
    {
      id: 'post-2',
      authorId: 'user-2',
      authorName: 'Java开发者',
      title: 'Spring Boot 面试高频题整理',
      content: '整理了一些Spring Boot面试中经常被问到的问题，包括自动装配原理、Starter机制、Actuator等...',
      category: 'share',
      tags: ['Java', 'Spring Boot', '面试题'],
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 256,
      views: 5120,
      commentCount: 32,
      isPinned: true,
    },
    {
      id: 'post-3',
      authorId: 'user-3',
      authorName: '算法爱好者',
      title: '动态规划到底该怎么学？',
      content: '刷了200道DP题后的一些心得体会，希望能帮助正在 struggling 的同学...',
      category: 'discussion',
      tags: ['算法', '动态规划', '学习心得'],
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      views: 1205,
      commentCount: 28,
    },
    {
      id: 'post-4',
      authorId: 'user-4',
      authorName: '数据库专家',
      title: 'MySQL索引优化实战案例',
      content: '分享一个实际项目中遇到的慢查询优化案例，从10秒优化到10毫秒...',
      category: 'share',
      tags: ['MySQL', '数据库优化', '索引'],
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 167,
      views: 3420,
      commentCount: 19,
    },
    {
      id: 'post-5',
      authorId: 'user-5',
      authorName: '应届生小白',
      title: '请问大家是怎么准备项目介绍的？',
      content: '马上就要面试了，但是对于项目介绍这块总是感觉说不好，求各位大佬指点...',
      category: 'question',
      tags: ['面试准备', '项目介绍', '应届生'],
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      likes: 23,
      views: 456,
      commentCount: 15,
    },
  ]
  return mockPosts
}

const generateMockComments = (): Comment[] => {
  const now = new Date()
  return [
    {
      id: 'comment-1',
      postId: 'post-1',
      authorId: 'user-6',
      authorName: '面试老司机',
      content: '感谢分享！请问算法题难度如何？',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 12,
    },
    {
      id: 'comment-2',
      postId: 'post-1',
      authorId: 'user-1',
      authorName: '前端小王',
      content: '算法题中等偏上，主要是LeetCode medium难度',
      createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      parentId: 'comment-1',
    },
    {
      id: 'comment-3',
      postId: 'post-2',
      authorId: 'user-7',
      authorName: 'Spring粉丝',
      content: '收藏了！正好在准备Spring相关面试',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 25,
    },
  ]
}

const loadJSON = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return (JSON.parse(raw) as T) ?? fallback
  } catch {
    return fallback
  }
}

export const useCommunityStore = defineStore('community', () => {
  // State
  const posts = ref<CommunityPost[]>(loadJSON<CommunityPost[]>(POSTS_STORAGE_KEY, generateMockPosts()))
  const comments = ref<Comment[]>(loadJSON<Comment[]>(COMMENTS_STORAGE_KEY, generateMockComments()))
  const likedPosts = ref<Set<string>>(new Set(loadJSON<string[]>(USER_POSTS_LIKED_KEY, [])))
  const likedComments = ref<Set<string>>(new Set(loadJSON<string[]>(USER_COMMENTS_LIKED_KEY, [])))
  const currentUser = ref({
    id: 'current-user',
    name: '我',
    avatar: undefined as string | undefined,
  })

  // Persist to localStorage
  const persist = () => {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts.value))
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments.value))
    localStorage.setItem(USER_POSTS_LIKED_KEY, JSON.stringify(Array.from(likedPosts.value)))
    localStorage.setItem(USER_COMMENTS_LIKED_KEY, JSON.stringify(Array.from(likedComments.value)))
  }

  // Getters
  const filteredPosts = computed(() => {
    return (filter: CommunityFilter) => {
      let result = [...posts.value]

      // Filter by category
      if (filter.category && filter.category !== 'all') {
        result = result.filter(p => p.category === filter.category)
      }

      // Filter by tag
      if (filter.tag) {
        result = result.filter(p => p.tags.includes(filter.tag!))
      }

      // Sort
      switch (filter.sortBy) {
        case 'hot':
          result.sort((a, b) => b.views - a.views)
          break
        case 'mostLiked':
          result.sort((a, b) => b.likes - a.likes)
          break
        case 'latest':
        default:
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      // Pinned posts first
      result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))

      return result
    }
  })

  const getPostById = computed(() => {
    return (id: string) => {
      const post = posts.value.find(p => p.id === id)
      if (post) {
        post.isLiked = likedPosts.value.has(id)
      }
      return post
    }
  })

  const getCommentsByPostId = computed(() => {
    return (postId: string) => {
      const postComments = comments.value
        .filter(c => c.postId === postId && !c.parentId)
        .map(c => ({
          ...c,
          isLiked: likedComments.value.has(c.id),
          replies: comments.value
            .filter(r => r.parentId === c.id)
            .map(r => ({ ...r, isLiked: likedComments.value.has(r.id) })),
        }))
      return postComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  })

  const hotTags = computed(() => {
    const tagCount = new Map<string, number>()
    posts.value.forEach(post => {
      post.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1)
      })
    })
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag)
  })

  const categoryStats = computed(() => {
    const stats = {
      all: posts.value.length,
      discussion: 0,
      question: 0,
      share: 0,
      experience: 0,
    }
    posts.value.forEach(p => {
      if (p.category in stats) {
        stats[p.category as keyof typeof stats]++
      }
    })
    return stats
  })

  // Actions
  const createPost = (data: Omit<CommunityPost, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'commentCount'>) => {
    const now = new Date().toISOString()
    const newPost: CommunityPost = {
      ...data,
      id: `post-${Date.now()}`,
      authorId: currentUser.value.id,
      authorName: currentUser.value.name,
      authorAvatar: currentUser.value.avatar,
      createdAt: now,
      updatedAt: now,
      likes: 0,
      views: 0,
      commentCount: 0,
    }
    posts.value.unshift(newPost)
    persist()
    return newPost
  }

  const addComment = (postId: string, content: string, parentId?: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: currentUser.value.id,
      authorName: currentUser.value.name,
      authorAvatar: currentUser.value.avatar,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId,
    }
    comments.value.push(newComment)

    // Update comment count
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.commentCount++
    }

    persist()
    return newComment
  }

  const togglePostLike = (postId: string) => {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    if (likedPosts.value.has(postId)) {
      likedPosts.value.delete(postId)
      post.likes--
      post.isLiked = false
    } else {
      likedPosts.value.add(postId)
      post.likes++
      post.isLiked = true
    }
    persist()
  }

  const toggleCommentLike = (commentId: string) => {
    const comment = comments.value.find(c => c.id === commentId)
    if (!comment) return

    if (likedComments.value.has(commentId)) {
      likedComments.value.delete(commentId)
      comment.likes--
    } else {
      likedComments.value.add(commentId)
      comment.likes++
    }
    persist()
  }

  const incrementViews = (postId: string) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.views++
      persist()
    }
  }

  const deletePost = (postId: string) => {
    posts.value = posts.value.filter(p => p.id !== postId)
    comments.value = comments.value.filter(c => c.postId !== postId)
    persist()
  }

  const updateCurrentUser = (name: string, avatar?: string) => {
    currentUser.value.name = name
    currentUser.value.avatar = avatar
  }

  return {
    posts,
    comments,
    currentUser,
    filteredPosts,
    getPostById,
    getCommentsByPostId,
    hotTags,
    categoryStats,
    createPost,
    addComment,
    togglePostLike,
    toggleCommentLike,
    incrementViews,
    deletePost,
    updateCurrentUser,
  }
})

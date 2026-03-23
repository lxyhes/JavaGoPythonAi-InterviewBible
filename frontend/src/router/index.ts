import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { public: true, hideForAuth: true },
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/pages/SearchPage.vue'),
  },
  {
    path: '/practice',
    name: 'Practice',
    component: () => import('@/pages/PracticePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/review',
    name: 'Review',
    component: () => import('@/pages/ReviewPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/frontend',
    name: 'Frontend',
    component: () => import('@/pages/FrontendPage.vue'),
  },
  {
    path: '/backend',
    name: 'Backend',
    component: () => import('@/pages/BackendPage.vue'),
  },
  {
    path: '/database',
    name: 'Database',
    component: () => import('@/pages/DatabasePage.vue'),
  },
  {
    path: '/algorithm',
    name: 'Algorithm',
    component: () => import('@/pages/AlgorithmPage.vue'),
  },
  {
    path: '/system-design',
    name: 'SystemDesign',
    component: () => import('@/pages/SystemDesignPage.vue'),
  },
  {
    path: '/devops',
    name: 'DevOps',
    component: () => import('@/pages/DevOpsPage.vue'),
  },
  {
    path: '/network',
    name: 'Network',
    component: () => import('@/pages/NetworkPage.vue'),
  },
  {
    path: '/os',
    name: 'OS',
    component: () => import('@/pages/OSPage.vue'),
  },
  {
    path: '/ai',
    name: 'AI',
    component: () => import('@/pages/AIPage.vue'),
  },
  {
    path: '/submit',
    name: 'SubmitQuestion',
    component: () => import('@/pages/SubmitQuestionPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/import',
    name: 'BulkImport',
    component: () => import('@/pages/BulkImportPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/sync',
    name: 'DataSync',
    component: () => import('@/pages/DataSyncPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/pages/CommunityPage.vue'),
  },
  {
    path: '/community/post/:id',
    name: 'PostDetail',
    component: () => import('@/pages/PostDetailPage.vue'),
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('@/pages/LeaderboardPage.vue'),
  },
  {
    path: '/mock-interview',
    name: 'MockInterview',
    component: () => import('@/pages/MockInterviewPage.vue'),
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('@/pages/NotesPage.vue'),
  },
  {
    path: '/components-demo',
    name: 'ComponentsDemo',
    component: () => import('@/pages/ComponentsDemoPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Initialize auth state if not already done
  if (!authStore.user && localStorage.getItem('auth_token')) {
    await authStore.initAuth()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // Hide login page for authenticated users
  if (to.meta.hideForAuth && authStore.isLoggedIn) {
    next({ path: '/dashboard' })
    return
  }

  next()
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
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
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
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

export default router

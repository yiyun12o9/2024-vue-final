import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/SignupPage',
      name: 'SignupPage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignupPage.vue')
    },
    {
      path: '/TodolistPage',
      name: 'TodolistPage',
      component: () => import('../views/TodolistPage.vue')
    }
  ]
})

export default router

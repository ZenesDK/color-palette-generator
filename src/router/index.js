// src/router/index.js
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Для GitHub Pages используйте Hash History
const router = createRouter({
  // history: createWebHistory(), // Используйте это для обычного хостинга
  history: createWebHashHistory(), // Используйте это для GitHub Pages
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Главная' }
    },
    {
      path: '/generator',
      name: 'generator',
      component: () => import('../views/GeneratorView.vue'),
      meta: { title: 'Генератор палитр' }
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue'),
      meta: { title: 'Библиотека палитр' }
    },
    {
      path: '/analyze',
      name: 'analyze',
      component: () => import('../views/AnalyzeView.vue'),
      meta: { title: 'Анализ доступности' }
    },
    {
      path: '/export',
      name: 'export',
      component: () => import('../views/ExportView.vue'),
      meta: { title: 'Экспорт' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Генератор палитр`
  next()
})

export default router
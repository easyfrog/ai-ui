import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../components/Layout/AdminLayout.vue'

const routes = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'basic',
        name: 'Basic',
        component: () => import('../views/BasicView.vue'),
        meta: { title: 'Basic Components' }
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('../views/FormView.vue'),
        meta: { title: 'Form Components' }
      },
      {
        path: 'data',
        name: 'Data',
        component: () => import('../views/DataView.vue'),
        meta: { title: 'Data Display' }
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('../views/FeedbackView.vue'),
        meta: { title: 'Feedback Components' }
      },
      {
        path: 'navigation',
        name: 'Navigation',
        component: () => import('../views/NavigationView.vue'),
        meta: { title: 'Navigation Components' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

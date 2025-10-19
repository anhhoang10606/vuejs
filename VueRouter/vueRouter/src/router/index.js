import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Admin from '../pages/Admin.vue'
import User from '../pages/User.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/admin', 
    component: Admin,
    meta: { requiresAuth: true, role: 'admin' } 
  },
  { 
    path: '/user', 
    component: User,
    meta: { requiresAuth: true, role: 'user' } 
  },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  if (to.meta.requiresAuth && !currentUser) {
    return next('/login')
  }

  if (to.meta.role && currentUser?.role !== to.meta.role) {
    return next('/login')
  }

  next()
})

export default router

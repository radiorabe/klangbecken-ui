import Vue from 'vue'
import VueRouter from 'vue-router'
import Music from '../views/Music.vue'
import Jingles from '../views/Jingles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/music'
  },
  {
    path: '/music',
    name: 'music',
    component: Music,
  },
  {
    path: '/jingles',
    name: 'jingles',
    component: Jingles
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/ui/',
  routes
})

export default router

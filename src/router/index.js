import Vue from 'vue'
import VueRouter from 'vue-router'
import Music from '../views/Music.vue'
import Jingles from '../views/Jingles.vue'
import Stats from '../views/Stats.vue'
import NotFound from '../views/NotFound.vue'


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
    component: Jingles,
  },
  {
    path: '/stats',
    redirect: () => {
      let now = new Date()
      let month = `${now.getFullYear()}-${now.getMonth() + 1}`
      return { name: 'stats', params: { month } }
    },
  },
  {
    path: '/stats/:month(\\d{4}-\\d{1,2})',
    name: 'stats',
    component: Stats,
  },
  {
    path: '*',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/ui/',
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Music from '../views/Music.vue'
import Jingles from '../views/Jingles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'music',
    component: Music
  },
  {
    path: '/jingles',
    name: 'jingles',
    component: Jingles
  }
]

const router = new VueRouter({
  routes
})

export default router

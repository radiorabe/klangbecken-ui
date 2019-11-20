import Vue from 'vue'
import VueRouter from 'vue-router'
import Music from '../views/Music.vue'
import Jingles from '../views/Jingles.vue'
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
    props: {loggedIn: false},
  },
  {
    path: '/jingles',
    name: 'jingles',
    component: Jingles,
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/ui/',
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Playlist from '../views/Playlist.vue'
import Stats from '../views/Stats.vue'
import NotFound from '../views/NotFound.vue'

import playlists from '@/playlists'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: `${Object.keys(playlists)[0]}`,
  },
  {
    name: 'playlist',
    path: `/:playlist(${Object.keys(playlists).join('|')})`,
    component: Playlist,
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
  routes
})

export default router

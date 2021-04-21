import Vue from 'vue'
import VueRouter from 'vue-router'

import Playlist from '@/views/Playlist.vue'
import Info from '@/views/Info.vue'
import Stats from '@/views/Stats.vue'
import NotFound from '@/views/NotFound.vue'

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
    props: true,
  },
  {
    name: 'info',
    path: '/info',
    component: Info,
    props: true,
  },
  {
    path: '/stats',
    redirect: () => {
      let now = new Date()
      let month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
      return { name: 'stats', params: { month } }
    },
  },
  {
    path: '/stats/:month(\\d{4}-\\d{1,2})',
    name: 'stats',
    component: Stats,
    props: true,
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

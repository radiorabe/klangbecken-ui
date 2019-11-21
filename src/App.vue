<template>
  <div id="app">
    <h1>Klangbecken</h1>
    <h3>Login</h3>
    <Login/>

    <h3>Status Klangbecken</h3>
    <Status/>

    <h3>Navigation</h3>
    <div id="nav">
      <template v-for="(entry, playlist) in playlists" >
        <router-link :to="`/${playlist}`" :key="playlist">{{entry.name}}</router-link> |
      </template>
      <router-link to="/stats">Stats</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Login from '@/components/Login.vue'
import Status from '@/components/Status.vue'

import playlists from '@/playlists'

import axios from 'axios'
import {mapActions} from 'vuex'

const TOKEN_RENEW_TIMEOUT = 10 * 60 * 1000   // ten minutes

export default {
  name: 'app',
  data() {
    let pls = {}
    for (let playlist in playlists) {
      pls[playlist] = { name: playlists[playlist].name }
    }

    return {
      data: {},
      tokenInterval: null,
      playlists: pls,
    }
  },
  async created() {
    this.loadData()
    this.renewToken()
    this.tokenInterval = setInterval(this.renewToken, TOKEN_RENEW_TIMEOUT)
    axios.interceptors.response.use((resp) => resp, async (err) => {
      if (err.response.status === 401) {
        this.logout()
        // FIXME: notification
      }
      throw err
    })
  },
  beforeDestroy () {
    clearInterval(this.tokenInterval)
  },
  methods: {
    ...mapActions(['loadData', 'renewToken', 'logout']),
  },
  components: {
    Login,
    Status,
  },
}
</script>

<style>
html {
  font-family: 'sans-serif'
}
</style>

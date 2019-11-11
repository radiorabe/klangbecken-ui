<template>
  <div id="app">
    <h1>Klangbecken</h1>
    <h3>Login</h3>
    <Login/>

    <h3>Status Klangbecken</h3>
    <Status/>

    <h3>Navigation</h3>
    <div id="nav">
      <router-link to="Music" :loggedIn="loggedIn">Music</router-link> |
      <router-link to="Jingles">Jingles</router-link>
    </div>

    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
import Login from '@/components/Login.vue'
import Status from '@/components/Status.vue'

export default {
  name: 'app',
  async created() {
    try {
      let response = await axios.get('/data/index.json')
      this.data = response.data
    } catch (err) {
      // Nothing yet
    }
  },
  methods: {
  },
  data() {
    return {
      loggedIn: false,
      username: '',
      data: {},
    }
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

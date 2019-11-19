<template>
  <div id="app">
    <h1>Klangbecken</h1>
    <h3>Login</h3>
    <Login/>

    <h3>Status Klangbecken</h3>
    <Status/>

    <h3>Navigation</h3>
    <div id="nav">
      <router-link to="Music">Music</router-link> |
      <router-link to="Jingles">Jingles</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Login from '@/components/Login.vue'
import Status from '@/components/Status.vue'


const TOKEN_RENEW_TIMEOUT = 10 * 60 * 1000   // ten minutes

export default {
  name: 'app',
  data() {
    return {
      data: {},
      tokenInterval: null,
    }
  },
  async created() {


    this.$store.dispatch('renewToken')
    this.tokenInterval = setInterval(() => {
      this.$store.dispatch('renewToken')
    }, TOKEN_RENEW_TIMEOUT)
  },
  beforeDestroy () {
    clearInterval(this.tokenInterval)
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

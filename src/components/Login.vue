<template>
  <div>
    <span v-if="isLoggedIn">{{username}} <button @click="logout">Logout</button></span>
    <span v-else>
      username: <input type="text" placeholder="Username" v-model="loginform.username"><br/>
      password: <input type="password" placeholder="Password" v-model="loginform.password">
      <button @click="login">Login</button>
    </span>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import axios from 'axios'


export default {
  name: 'Login',
  data() {
    return {
      loginform: {
      },
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'username'])
  },
  methods: {
    async login() {
      try {
        let body = new URLSearchParams()
        body.append('login', this.loginform.username)
        body.append('password', this.loginform.password)

        let response = await axios.post('/api/login/', body)
        this.loginform = {}
        let new_token = response.data.token
        this.$store.commit('setToken', new_token)
      } catch (error) {
        this.loginform.password = ''
      }
    },
    logout() {
      this.$store.commit('removeToken')
    }
  },
}
</script>

<style scoped>
</style>

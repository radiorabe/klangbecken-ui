<template>
  <div>
    <span v-if="loggedIn">{{username}} <button @click="logout">Logout</button></span>
    <span v-else>
      username: <input type="text" placeholder="Username" v-model="loginform.username"><br/>
      password: <input type="password" placeholder="Password" v-model="loginform.password">
      <button @click="login">Login</button>
    </span>
  </div>
</template>

<script>
import axios from 'axios'

let RENEW_TIMEOUT = 10 * 60 * 1000   // ten minutes

export default {
  name: 'Login',
  data() {
    return {
      loggedIn: false,
      username: '',
      polling: null,
      loginform: {},
    }
  },
  async created() {
    await this.renew()
    this.polling = setInterval(this.renew, RENEW_TIMEOUT)
  },
  beforeDestroy () {
    clearInterval(this.polling)
  },
  methods: {
    async renew() {
      let token = localStorage.getItem('token')
      if (token) {
        try {
          let response = await axios.post('/api/renew_token/', {token})
          let new_token = response.data.token
          localStorage.setItem('token', new_token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${new_token}`

          let payload = JSON.parse(atob(new_token.split('.')[1]))
          this.username = payload.user
          this.loggedIn = true
          return  // We're good
        } catch (err) {
          // Handle error case below
        }
      }
      this.loggedIn = false
      this.username = ''
      localStorage.removeItem('token')
    },

    async login() {
      try {
        let response = await axios.post('/api/login/', this.loginform)
        if (response.status === 200) {
          this.loggedIn = true;
          this.loginform = {}
          let token = response.data.token
          // Extract payload
          let payload = token.split('.')[1]
          // Convert back to 'normal' base64
          payload = payload.replace(/-/g, '+').replace(/_/g, '/')
          // Decode and parse
          payload = JSON.parse(atob(payload))
          this.username = payload.user
          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
          alert('Invalid username or password')
        }
      } catch (error) {
        //nothing
      }
    },

    logout() {
      this.loggedIn = false
      this.username = ''
      localStorage.removeItem('token')
    },
  },
}
</script>

<style scoped>
</style>

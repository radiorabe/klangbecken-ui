<template>
  <div>
    <span v-if="loggedIn">{{username}} <button @click="logout">Logout</button></span>
    <span v-else>
      username: <input type="text" placeholder="Username" v-model="loginformUsername"><br/>
      password: <input type="password" placeholder="Password" v-model="loginformPassword">  <button @click="login">Login</button>
    </span>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  async created() {
    try {
      let response = await axios.get('/api/login/')
      this.loggedIn = true
      this.username = response.data.user

    } catch (err) {
      // Nothing todo
    }
  },
  methods: {
    logout() {
      this.loggedIn  = false
    },
    async login() {
      try {
        let response = await axios.post('/api/login/', {username: this.loginformUsername, password: this.loginformPassword})
        if (response.status === 200) {
          this.loggedIn = true;
          this.username = response.data.user
        } else {
          alert('Invalid username or password')
        }
      } catch (error) {
        //nothing
      }
    }
  },
  data() {
    return {
      loggedIn: false,
      username: '',
      loginformUsername: '',
      loginformPassword: '',
    }
  },
}
</script>

<style scoped>
</style>

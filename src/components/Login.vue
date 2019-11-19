<template>
  <div>
    <span v-if="isLoggedIn">{{username}} <button @click="logout">Logout</button></span>
    <span v-else>
      username: <input type="text" placeholder="Username" v-model="loginform.username"><br/>
      password: <input type="password" placeholder="Password" v-model="loginform.password">
      <button @click="tryLogin">Login</button>
    </span>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loginform: {},
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'username'])
  },
  methods: {
    async tryLogin() {
      try {
        await this.login(this.loginform)
        this.loginform = {}
      } catch (err) {
        this.loginform.password = ''
      }
    },
    ...mapActions(['login', 'logout']),
  },
}
</script>

<style scoped>
</style>

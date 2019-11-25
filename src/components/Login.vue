<template>
  <div>
    <span v-if="isLoggedIn">{{username}} <button @click="logout">Logout</button></span>
    <span v-else>
      username: <input type="text" ref="username" placeholder="Username" v-model="loginform.username"><br/>
      password: <input type="password" placeholder="Password" v-model="loginform.password" @keyup.enter="tryLogin">
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
  mounted() {
    this.$refs.username.focus()
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

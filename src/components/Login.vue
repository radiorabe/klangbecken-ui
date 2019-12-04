<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      persistent
      max-width="300"
      @keydown.esc="cancel"
      @click:outside="cancel"
    >
      <v-card>
        <v-card-title class="headline">Login</v-card-title>
        <v-card-text>
          <form @submit.prevent="tryLogin" id="login-form">
            <v-col cols="12">
              <v-text-field
                label="Benutzername"
                ref="username"
                required
                autofocus
                v-model="loginform.username"
                @keyup.enter="next"
                @keyup.esc="cancel"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Passwort"
                type="password"
                required
                ref="password"
                v-model="loginform.password"
                @keyup.esc="cancel"
              ></v-text-field>
            </v-col>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" outlined @click="cancel">Abbrechen</v-btn>
          <v-btn color="secondary" type="submit" form="login-form">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loginform: {},
    }
  },
  props: ['show'],
  computed: {
    ...mapGetters(['isLoggedIn', 'username'])
  },
  methods: {
    async tryLogin() {
      try {
        await this.login(this.loginform)
        this.loginform = {}
        this.$emit('done')
        this.success('Login erfolgreich.')
      } catch (err) {
        this.error('Login ist fehlgeschlagen. ')
        this.loginform.password = ''
      }
    },
    next() {
      this.$refs.password.focus()
    },
    cancel() {
      this.loginform = {}
      this.$emit('done')
    },
    ...mapActions(['login', 'logout']),
    ...mapMutations(['success', 'error']),
  },
  watch: {
    async show(show) {
      if (show) {
        await this.$nextTick()
        this.$refs.username.focus()
      }
    }
  },
}
</script>

<style scoped>
</style>

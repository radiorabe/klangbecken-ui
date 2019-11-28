<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-app-bar
      fixed
      app
      dense
      elevation="1"
      extension-height="40"
      height="40"
    >
      <v-toolbar-title><span class="title">Klangbecken</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <Status/>

      <v-toolbar-items>
      <v-menu bottom left offset-y v-if="isLoggedIn">
        <template v-slot:activator="{ on }">
          <v-btn small text tile v-on="on">
            <v-icon>mdi-account</v-icon>
            {{username}}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="isLoggedIn" @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-else small text tile v-on:click="showLogin = true">
        Login
      </v-btn>
      </v-toolbar-items>

      <template v-slot:img>
        <v-img
          height="80"
          :src="require('./assets/logo.svg')"
          contain
          position="center left"
        ></v-img>
      </template>

      <template v-slot:extension>
        <v-tabs
          background-color="transparent"
          color="secondary"
          fixed-tabs
        >
          <v-tab
            v-for="(entry, playlist) in playlists"
            :key="playlist"
            :to="`/${playlist}`"
          >
            {{entry.name}}
          </v-tab>
          <v-tab to="/stats">
            Statistik
          </v-tab>
        </v-tabs>
        <v-progress-linear
        :active="loadingData"
        :indeterminate="loadingData"
        absolute
        bottom
        color="primary"
      ></v-progress-linear>
      </template>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view :key="$route.fullPath" v-if="!loadingData"/>
      </v-container>
    </v-content>
    <Login :show="showLogin" @done="showLogin = false"/>
    <PreviewPlayer/>
    <Notifications/>
  </v-app>
</template>

<script>
import axios from 'axios'
import {mapGetters, mapMutations, mapActions} from 'vuex'

import Login from '@/components/Login.vue'
import Notifications from '@/components/Notifications.vue'
import PreviewPlayer from '@/components/PreviewPlayer.vue'
import Status from '@/components/Status.vue'

import playlists from '@/playlists'


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
      showLogin: false,
    }
  },
  computed:{
    ...mapGetters(['isLoggedIn', 'username', 'loadingData'])
  },
  async created() {
    this.loadData()
    this.renewToken()
    this.tokenInterval = setInterval(this.renewToken, TOKEN_RENEW_TIMEOUT)
    axios.interceptors.response.use((resp) => resp, async (err) => {
      if (err.response.status === 401 &&
          err.response.config.url !== '/api/auth/login/') {
        this.logout()
        this.error('User wurde ausgelogt')
      }
      throw err
    })
  },
  beforeDestroy () {
    clearInterval(this.tokenInterval)
  },
  methods: {
    ...mapActions(['loadData', 'renewToken', 'logout']),
    ...mapMutations(['error']),
  },
  components: {
    Login,
    Notifications,
    PreviewPlayer,
    Status,
  },
}
</script>

<style>
.title {
  padding-left: 40px;
}
</style>

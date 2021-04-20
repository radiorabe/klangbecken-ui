<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-app-bar fixed app dense elevation="1" extension-height="40" height="40">
      <v-toolbar-title>
        <span class="title">Klangbecken</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <Status />

      <v-toolbar-items>
        <v-menu bottom left offset-y v-if="isLoggedIn">
          <template v-slot:activator="{ on }">
            <v-btn small text tile v-on="on">
              <v-icon>mdi-account</v-icon>
              {{username.split('@')[0]}}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-if="isLoggedIn" @click="logout">
              <v-list-item-title>
                <v-icon left small>mdi-logout</v-icon>Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn v-else small text tile v-on:click="showLogin = true">Login</v-btn>
      </v-toolbar-items>

      <template v-slot:img>
        <v-img height="80" :src="require('./assets/logo.svg')" contain position="center left"></v-img>
      </template>

      <template v-slot:extension>
        <v-tabs background-color="transparent" color="secondary" fixed-tabs>
          <v-tab
            v-for="(entry, playlist) in playlists"
            :key="playlist"
            :to="`/${playlist}`"
          >{{entry.name}}</v-tab>
          <v-tab to="/stats">Statistik</v-tab>
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
    <v-main>
      <v-container fluid>
        <router-view :key="$route.fullPath" v-if="!loadingData" />
      </v-container>
    </v-main>
    <Login :show="showLogin" @done="showLogin = false" />
    <PreviewPlayer />
    <Notifications />
    <NeedReload :show="needReload"/>
  </v-app>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations, mapActions } from "vuex";

import Login from "@/components/Login.vue";
import NeedReload from "@/components/NeedReload.vue";
import Notifications from "@/components/Notifications.vue";
import PreviewPlayer from "@/components/PreviewPlayer.vue";
import Status from "@/components/Status.vue";

import playlists from "@/playlists";

const TOKEN_RENEW_TIMEOUT = 10 * 60 * 1000; // ten minutes
const INFO_RENEW_TIMEOUT = 3 * 1000;

export default {
  name: "app",
  data() {
    let pls = {};
    for (let playlist in playlists) {
      pls[playlist] = { name: playlists[playlist].name };
    }

    return {
      data: {},
      tokenInterval: null,
      infoInterval: null,
      timeInterval: null,
      playlists: pls,
      showLogin: false
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "username", "loadingData", "needReload"])
  },
  async created() {
    this.loadData();
    this.renewToken();
    this.tokenInterval = setInterval(this.renewToken, TOKEN_RENEW_TIMEOUT);
    this.infoInterval = setInterval(this.loadInfo, INFO_RENEW_TIMEOUT, INFO_RENEW_TIMEOUT);
    axios.interceptors.response.use(
      resp => resp,
      async err => {
        if (
          err.response &&
          err.response.status === 401 &&
          err.response.config.url !== "/api/auth/login/"
        ) {
          this.logout();
          this.error("User wurde ausgelogt");
        }
        throw err;
      }
    );
  },
  beforeDestroy() {
    clearInterval(this.tokenInterval);
    clearInterval(this.infoInterval);
    clearInterval(this.timeInterval);
    this.tokenInterval = null;
    this.infoInterval = null;
    this.timeInterval = null;
  },
  methods: {
    ...mapActions(["loadData", "loadInfo", "renewToken", "logout"]),
    ...mapMutations(["error"])
  },
  components: {
    Login,
    NeedReload,
    Notifications,
    PreviewPlayer,
    Status
  }
};
</script>

<style>
.title {
  padding-left: 40px;
}
</style>

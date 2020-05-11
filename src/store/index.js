import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import data from "./data";
import notify from "./notify";
import preview from "./preview";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    online: true,
  },
  getters: {
    online: (state) => state.online,
  },
  mutations: {
    setOnline: (state) => (state.online = true),
    setOffline: (state) => (state.online = false),
  },
  actions: {},
  modules: {
    auth,
    data,
    notify,
    preview,
  },
});

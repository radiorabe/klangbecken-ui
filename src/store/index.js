import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import data from "./data";
import info from "./info";
import notify from "./notify";
import preview from "./preview";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {},
  modules: {
    auth,
    data,
    info,
    notify,
    preview,
  },
});

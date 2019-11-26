import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import data from './data'
import notify from './notify'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    data,
    notify,
  }
})

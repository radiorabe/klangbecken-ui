import Vue from 'vue'
import axios from 'axios'

import index from '@/search'


export default {
  state: {
    data: {},
  },

  getters: {
    hasData: (state) => !!state.data,
    data: (state) => state.data,
  },

  mutations: {
    setData: (state, newData) => {
      index.add(Object.values(newData))
      state.data = newData
    },
    addItem: (state, item) => {
      for (let key in item) {
        index.add(item[key])
        Vue.set(state.data, key, item[key])
      }
    },
    removeItem: (state, itemId) => {
      index.delete(state.data[itemId])
      Vue.delete(state.data, itemId)
    },
    modifyItem: (state, itemId, modifications) => {
      for (let key in modifications) {
        state[itemId][key] = modifications[key]
      }
      index.update(state.data[itemId])
    },
  },

  actions: {
    async loadData({commit}) {
      try {
        let response = await axios.get('/data/index.json')
        commit('setData', response.data)
      } catch (err) {
        // Show notification!
      }
    },
  },
}

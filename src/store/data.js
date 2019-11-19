import Vue from 'vue'
import axios from 'axios'

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
      state.data = newData
    },
    addItem: (state, item) => {
      state.data[item.id] = item
    },
    removeItem: (state, itemId) => {
      Vue.delete(state.data, itemId)
    },
    modifyItem: (state, itemId, modifications) => {
      for (let key in modifications) {
        state[itemId][key] = modifications[key]
      }
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

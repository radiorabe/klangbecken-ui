export default {
  state: {
    notifications: [],
  },

  getters: {
    notifications: (state) => state.notifications,
  },

  mutations: {
    error: (state, message) => {
      state.notifications.push({type: 'error', message})
    },
    success: (state, message) => {
      state.notifications.push({type: 'success', message})
    },
    popNotification: (state) => {
      return state.notifications.shift()
    },
  },

  actions: {
  },
}

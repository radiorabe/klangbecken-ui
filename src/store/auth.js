import axios from 'axios'

export default {
  state: {
    token: localStorage.getItem('token'),
  },
  getters: {
    isLoggedIn: state => state.token !== '',
    username: state => {
      if (!state.token) {
        return ''
      }
      // Extract payload
      let payload = state.token.split('.')[1]
      // Convert back to 'normal' base64
      payload = payload.replace(/-/g, '+').replace(/_/g, '/')
      // Decode and parse
      let result = JSON.parse(atob(payload))
      return result.user
    },
  },
  mutations: {
    setToken: (state, newToken) => {
      state.token = newToken
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    },
    removeToken: (state) => {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  },
  actions: {
    async renewToken({commit, state}) {
      let token = state.token
      if (token !== '') {
        try {
          let response = await axios.post('/api/renew_token/', {token})
          commit('setToken', response.data.token)
        } catch (err) {
          commit('removeToken')
        }
      }
    },
  },
}

import axios from 'axios'

export default {
  state: {
    token: localStorage.getItem('token'),
  },

  getters: {
    isLoggedIn: state => !!state.token,
    payload: state => {
      if (!state.token) {
        return {}
      }
      // Extract payload
      let payload = state.token.split('.')[1]
      // Convert back to 'normal' base64
      payload = payload.replace(/-/g, '+').replace(/_/g, '/')
      // Decode and parse
      return JSON.parse(atob(payload))
    },
    username: (state, getters) => getters.payload.user,
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
    },
  },

  actions: {
    async renewToken({commit, state}) {
      let token = state.token
      if (token) {
        try {
          let response = await axios.post('/api/auth/renew/', {token})
          commit('setToken', response.data.token)
        } catch (err) {
          commit('removeToken')
        }
      }
    },
    async login({commit}, credentials) {
      let body = new URLSearchParams()
      body.append('login', credentials.username || '')
      body.append('password', credentials.password || '')

      let response = await axios.post('/api/auth/login/', body)

      let new_token = response.data.token
      commit('setToken', new_token)
    },
    async logout({commit}) {
      commit('removeToken')
    },
  },
}

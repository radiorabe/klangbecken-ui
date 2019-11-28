export default {
  state: {
    preview: {},
    isPreviewing: false
  },

  getters: {
    preview: (state) => state.preview,
    isPreviewing: (state) => state.isPreviewing,
    previewPath: (state) => {
      if (state.isPreviewing) {
        return `/data/${state.preview.playlist}/${state.preview.id}${state.preview.ext}`
      } else {
        return ''
      }
    },
  },

  mutations: {
    setPreview: (state, preview) => {
      state.preview = preview
      state.isPreviewing = true
    },
    clearPreview: (state) => {
      state.preview = {}
      state.isPreviewing = false
    },
  },

  actions: {
  },
}

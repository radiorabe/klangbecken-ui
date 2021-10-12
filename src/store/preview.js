export default {
  state: {
    preview: undefined,
  },

  getters: {
    isPreviewing: state => state.preview !== undefined,
    previewPath: state => state.preview ? `/data/${state.preview.playlist}/${state.preview.id}.${state.preview.ext}` : "",
    previewTitle: state => state.preview ? state.preview.title || state.preview.original_filename : "",
    previewArtist: state => state.preview ? state.preview.artist || "<Unbekannter Artist>" : "",
  },

  mutations: {
    setPreview: (state, preview) => {
      state.preview = preview;
    },
    clearPreview: (state) => {
      state.preview = undefined;
    },
  },

  actions: {},
};

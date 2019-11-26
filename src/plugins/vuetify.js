import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import de from 'vuetify/es5/locale/de';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#00c9bf',
        secondary: '#0d4b56',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        background: '#d8efdb',
      },
    },
  },
    lang: {
      locales: { de },
      current: 'de',
    },
});

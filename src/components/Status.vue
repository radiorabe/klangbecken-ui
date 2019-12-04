<template>
  <v-toolbar-items class="disable-events">
    <template v-if="online">
      <v-btn small tile depressed :ripple="false" text>
        {{currentSong}}
      </v-btn>
      <v-btn small depressed tile :disabled="!onair" :ripple="false" text >
        O{{onair ? 'n' : 'ff'}} Air:
        <v-icon color="green">mdi-access-point</v-icon>
      </v-btn>
    </template>
    <v-btn v-else small depressed tile disabled :ripple="false" text >
      Offline: Netzwerkverbindung überprüfen
    </v-btn>

  </v-toolbar-items>
</template>

<script>
import axios from 'axios'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'Status',

  created() {
    let poll = async () => {
      try {
        let response = await axios.get('/data/log/current.json', { headers: {
          'If-Modified-Since': 'invalid',
        }})
        this.current = response.data
        if (!this.online) {
          this.setOnline()
        }
      } catch (err) {
        if (err.message === 'Network Error') {
          this.setOffline()
        }
      }
    }

    this.polling = setInterval(poll, 3000)
    poll()
  },

  beforeDestroy () {
    clearInterval(this.polling)
  },

  data() {
    return {
      current: false,
      polling: null,
    }
  },
  computed: {
    ...mapGetters(['online']),
    onair() {
      return !!this.current
    },
    currentSong() {
      if (this.onair) {
        if (this.current.title || this.current.artist) {
          let artist =  this.current.artist || '<Unknown Artist> '
          let title =  this.current.title || '<Unknown Title> '
          return `Aktueller Song: ${artist} - ${title}`
        } else {
          return `Aktueller Song: ${this.current.original_filename}`
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    ...mapMutations(['setOnline', 'setOffline']),
  },
}
</script>

<style>
.current {
  margin-left: 15px;
  margin-right: 15px;
  overflow: hidden;
}
div.truncate {
  display: inline-block;
}
.disable-events {
  pointer-events: none
}
</style>

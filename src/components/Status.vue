<template>
  <v-toolbar-items class="disable-events">
    <v-btn small tile depressed :ripple="false" text>
      {{currentSong}}
    </v-btn>
    <v-btn small depressed tile :disabled="!onair" :ripple="false" text >
      O{{onair ? 'n' : 'ff'}} Air:
      <v-icon color="green">mdi-access-point</v-icon>
    </v-btn>
  </v-toolbar-items>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Status',

  created() {
    let poll = async () => {
      try {
        let response = await axios.get('/data/log/current.json')
        this.current = response.data
      } catch (err) {
        // Nothing yet
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

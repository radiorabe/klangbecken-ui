<template>
  <ul>
    <li>On Air: {{onair ? 'yes' : 'no'}}</li>
    <li>Aktueller Song: {{current.artist}} - {{current.title}}</li>
  </ul>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Status',

  created() {
    let poll = async () => {
      try {
        let response = await axios.get('/data/log/onair.json')
        this.onair = response.data
        response = await axios.get('/data/log/current.json')
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
      onair: false,
      current:{},
      polling: null,
    }
  },
}
</script>

<style scoped>
</style>

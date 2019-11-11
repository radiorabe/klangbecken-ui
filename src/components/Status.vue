<template>
  <ul>
    <li>On Air: {{onair ? 'yes' : 'no'}}</li>
    <li>Aktueller Song: ...</li>
  </ul>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Status',

  created() {
    let poll = async () => {
      try {
        let response = await axios.get('/data/onair.json')
        this.onair = response.data
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
      polling: null,
    }
  },
}
</script>

<style scoped>
</style>

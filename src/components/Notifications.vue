<template>
<div>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="4000"
    top
  >
    1: {{text}}
    <v-btn dark text v-on:click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
  </v-snackbar>
  <v-snackbar
    v-model="show2"
    :color="color"
    :timeout="4000"
    top
  >
    2: {{text}}
    <v-btn dark text v-on:click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
  </v-snackbar>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'


export default {
  name: 'Notifications',

  created() {
  },

  beforeDestroy () {
    clearInterval(this.polling)
  },

  data() {
    return {
      show: false,
      show2: false,
      text: '',
      color: '',
    }
  },
  computed: {
    ...mapGetters(['notifications']),
  },
  methods: {
    ...mapMutations(['popNotification']),
  },
  watch: {
    notifications() {
      // console.log(newVal, oldVal)
      if (this.notifications.length > 0) {
        this.color = this.notifications[0].type
        this.text = this.notifications[0].message
        this.show = true
        this.show2 = true

        this.popNotification()
      }
    },
  },
}
</script>

<style>

</style>

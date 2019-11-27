<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="4000"
    top
  >
    {{text}}
    <v-btn dark text v-on:click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
  </v-snackbar>
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
      if (this.notifications.length > 0) {
        this.color = this.notifications[0].type
        this.text = this.notifications[0].message
        this.show = true

        this.popNotification()
      }
    },
  },
}
</script>

<style>

</style>

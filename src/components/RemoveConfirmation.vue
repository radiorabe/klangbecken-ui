<template>
  <v-row justify="center">
    <v-dialog
      :value="show"
      persistent
      max-width="300"
      @keydown.esc="cancel"
      @keydown.enter="remove"
      @click:outside="cancel"
    >
      <v-card>
        <v-card-title class="headline">Eintrag löschen?</v-card-title>
        <v-card-text>
          Die Datei <code>{{entry.original_filename}}</code>
          ({{entry.artist || '&lt;Unbekannter Artist>'}} - {{entry.title || '&lt;Unbekannter Titel>'}})
          wirklich löschen?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" outlined @click="cancel">Abbrechen</v-btn>
          <v-btn color="secondary" @click="remove">Löschen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'RemoveConfirmation',
  props: [
    'removing'
  ],
  computed: {
    ...mapGetters(['data']),
    show() {
      return this.removing !== '' && this.data[this.removing]
    },
    entry() {
      if (this.show) {
        return this.data[this.removing]
      } else {
        return {}
      }
    }
  },

  methods: {
    ...mapMutations(['removeItem']),
    next() {
      this.$refs.title.focus()
    },
    async remove() {
      let entry = this.data[this.removing]
      try {
        await axios.delete(`/api/${entry.playlist}/${entry.id}${entry.ext}`)
        this.removeItem(entry.id)
      } catch (err) {
        //Nothing
      }
      this.$emit('done')
    },
    cancel() {
      this.$emit('done')
    },
  },
}
</script>

<style scoped>
</style>

<template>
  <v-row justify="center">
    <v-dialog
      :value="show"
      persistent
      max-width="300"
      @keydown.esc="cancel"
      @click:outside="cancel"
    >
      <v-card>
        <v-card-title class="headline">Login</v-card-title>
        <v-card-text>
          <v-col cols="12">
            <v-text-field
              label="Artist"
              ref="artist"
              required
              autofocus
              v-model="artist"
              @keyup.enter="next"
              @keyup.esc="cancel"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Title"
              ref="title"
              required
              v-model="title"
              @keyup.enter="save"
              @keyup.esc="cancel"
            ></v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="cancel">Abbrechen</v-btn>
          <v-btn color="secondary" @click="save">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  <!-- <div>
    <input ref="artist" v-model="artist" @keyup.enter="save" @keyup.esc="cancel" placeholder="Artist">
    <input v-model="title" @keyup.enter="save" @keyup.esc="cancel" placeholder="Title">
    {{editing.original_filename}}
    <button @click="save">Save</button>
    <button @click="cancel">Cancel</button>
  </div> -->
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Edit',
  data() {
    return {
      artist: '',//this.data[this.editing].artist,
      title: '', //this.editing.title,
    }
  },
  props: [
    'editing'
  ],
  computed: {
    ...mapGetters(['data']),
    show() {
      return this.editing !== '' && this.data[this.editing]
    }
  },

  methods: {
    ...mapActions(['updateMetadata']),
    next() {
      this.$refs.title.focus()
    },
    save() {
      this.updateMetadata({
        entry: this.data[this.editing],
        modifications: {artist: this.artist, title: this.title}
      })
      this.$emit('done')
    },

    cancel() {
      this.$emit('done')
    },
  },
  watch: {
    async show(show) {
      if (show) {
        this.artist = this.data[this.editing].artist
        this.title = this.data[this.editing].title

        await this.$nextTick()
        this.$refs.artist.focus()
      }
    }
  },
}
</script>

<style scoped>
</style>

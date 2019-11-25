<template>
  <div>
    <input ref="artist" v-model="artist" @keyup.enter="save" @keyup.esc="cancel" placeholder="Artist">
    <input v-model="title" @keyup.enter="save" @keyup.esc="cancel" placeholder="Title">
    {{editing.original_filename}}
    <button @click="save">Save</button>
    <button @click="cancel">Cancel</button>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'Edit',
  data() {
    return {
      artist: this.editing.artist,
      title: this.editing.title,
    }
  },
  props: [
    'editing'
  ],
  mounted() {
    this.$refs.artist.focus()
  },
  methods: {
    ...mapActions(['updateMetadata']),

    save() {
      this.updateMetadata({
        entry: editing,
        modifications: {artist: this.artist, title: this.title}
      })
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

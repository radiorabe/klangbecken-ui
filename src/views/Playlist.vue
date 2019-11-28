<template>
  <div>
    <h2>Playlist - {{playlistName}}</h2>

    <h3>Upload</h3>
    <input type="file" ref="fileupload" multiple accept="audio/*" @change="upload" :disabled="!isLoggedIn">
    <progress :value="progress"></progress> {{ processing ? 'processing ...' : ''}}

    <h3>Preview Player</h3>
    <div>
      <audio :src="preview_path" v-on:ended="ended" autoplay controls></audio>
      {{preview_name}}
    </div>
    <h3>Playlist</h3>
    Order by
    <select v-model="order_key">
      <option value="-import_timestamp" selected="selected">Import-Datum (neuste zuerst)</option>
      <option value="+artist">Artist (aufsteigend)</option>
    </select>

    Search: <input v-model="search" placeholder="Search ..." @keyup.esc="search = ''"><button @click="search = ''">x</button>
    <ul>
      <li v-for="value in playlistData" :key="value.id">
        <Edit v-if="editing === value.id" :editing="value" @done="editing = ''"/>
        <template v-else>
          {{value.artist}} - {{value.title}} - {{value.original_filename}}
          <button @click="setPreview(value)">preview</button>
          <button @click="remove(value)" :disabled="!isLoggedIn">delete</button>
          <button @click="playNext(value)" :disabled="!isLoggedIn">play next</button>
          <button v-if="value.weight" @click="disable(value)" :disabled="!isLoggedIn">disable</button>
          <button v-else @click="enable(value)" :disabled="!isLoggedIn">enable</button>
          <button @click="editing = value.id" :disabled="!isLoggedIn">edit</button>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import 'core-js/proposals/promise-all-settled'

import axios from 'axios'
import {mapGetters, mapMutations, mapActions} from 'vuex'

import Edit from '@/components/Edit.vue'

import playlists from '@/playlists'
import index from '@/search'

export default {
  name: 'playlist',
  data() {
    return {
      order_key: '-import_timestamp',
      progress: 0,
      preview_path: '',
      preview_name: '',
      search: '',
      editing: '',
      processing: false,
    }
  },
  props: ['playlist'],
  created() {
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'data']),
    playlistName() {
      return playlists[this.playlist].name
    },
    playlistDescription() {
      return playlists[this.playlist].description
    },
    playlistData() {
      if (this.search) {
        return this.playlistSearchData
      } else {
        return this.playlistSortedData
      }
    },
    playlistSearchData() {
      return index.search(this.search, {where: {'playlist': this.playlist}})
    },
    playlistSortedData() {
      let playlist = Object.values(this.data)
        .filter((entry) => entry.playlist === this.playlist)
      let key = this.order_key.substr(1)
      let direction = this.order_key[0] === '+' ? 1 : -1
      playlist.sort((left, right) => {
        if (left[key] < right[key]) {
          return -1 * direction
        } else if (right[key] < left[key]) {
          return 1 * direction
        } else {
          return 0
        }
      })
      return playlist
    }
  },
  methods: {
    ...mapMutations(['addItem', 'updateItem', 'removeItem', 'setPreview']),
    ...mapActions(['updateMetadata']),

    async upload(ev) {
      this.progress = 0
      let files = ev.srcElement.files

      let chunks = [...files].reduce((chunks, file) => {
        if (chunks[chunks.length - 1].length === 4) {
          chunks.push([])
        }
        chunks[chunks.length - 1].push(file)
        return chunks
      }, [[]])

      let progress = 0
      for (let chunk of chunks) {
        let promises = []
        let progresses = chunk.map(() => 0)
        for (const [index, file] of chunk.entries()) {
          let formData = new FormData();
          formData.append('file', file);
          let promise = axios.post(
            `/api/${this.playlist}/`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              onUploadProgress: (progressEvent) => {
                progresses[index] = progressEvent.loaded / progressEvent.total;
                let current_progress = progresses.reduce((a, b) => a + b)
                this.progress = (progress + current_progress) / files.length
                if (current_progress === progresses.length) {
                  this.processing = true
                }
              }
            }
          )
          promises.push(promise)
        }

        let results = await Promise.allSettled(promises)
        this.processing = false
        for (let result in results) {
          if (result.status === 'fullfilled') {
            this.addItem(result.value.data)
          } else {
            // Notify
          }
        }

        progress += promises.length
      }
      this.progress = 0
      this.$refs.fileupload.value = ''
    },
    preview(entry) {
      this.preview_path = `/data/${entry.playlist}/${entry.id}${entry.ext}`
      this.preview_name = `${entry.artist} - ${entry.title}`
    },
    ended() {
      this.preview_path = ''
      this.preview_name = ''
    },
    async remove(entry) {
      try {
        await axios.delete(`/api/${entry.playlist}/${entry.id}${entry.ext}`)
        this.removeItem(entry.id)
      } catch (err) {
        //Nothing
      }
    },
    async playNext(entry) {
      try {
        await axios.post(`/api/playnext/`, {file:`${entry.playlist}/${entry.id}${entry.ext}`})
      } catch (err) {
        //fail
      }
    },
    async enable(entry) {
      await this.updateMetadata({ entry, modifications: {weight: 1} })
    },
    async disable(entry) {
      await this.updateMetadata({ entry, modifications: {weight: 0} })
    },
  },
  components: {
    Edit,
  },
}
</script>

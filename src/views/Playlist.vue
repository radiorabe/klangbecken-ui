<template>
  <div>
    <h2>Playlist - {{playlistName}}</h2>

    <h3>Upload</h3>
    <input type="file" multiple accept="audio/*" @change="upload" :disabled="!isLoggedIn">
    <progress :value="progress"></progress>

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

    Search: <input v-model="search" placeholder="Search ..."><button @click="search = ''">x</button>
    <ul>
      <li v-for="value in playlistData" :key="value.id">
        <Edit v-if="editing === value.id" :editing="value" @done="editing = ''"/>
        <template v-else>
          {{value.artist}} - {{value.title}} - {{value.original_filename}}
          <button @click="preview(value)">preview</button>
          <button @click="remove(value)" :disabled="!isLoggedIn">delete</button>
          <button @click="playNext(value)" :disabled="!isLoggedIn">play next</button>
          <button v-if="value.weight !== 0" @click="update(value, {weight: 0})" :disabled="!isLoggedIn">disable</button>
          <button v-else @click="update(value, {weight: 1})" :disabled="!isLoggedIn">enable</button>
          <button @click="editing = value.id" :disabled="!isLoggedIn">edit</button>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import {mapGetters, mapMutations} from 'vuex'

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
      if (this.search.trim() !== '') {
        return index.search(this.search, {where: {'playlist': this.playlist}})
      }
      let obj = this.data
      let result =  Object.keys(obj)
          .filter( key => obj[key].playlist === this.playlist )
          .reduce((res, key) => res.concat([obj[key]]), [])
      let key = this.order_key.substr(1)
      let direction = this.order_key[0] === '+' ? 1 : -1
      result.sort((left, right) => {
        left = left[key]
        right = right[key]
        if (left < right) {
          return -1 * direction
        } else if (right < left) {
          return 1 * direction
        } else {
          return 0
        }
      })
      return result
    }
  },
  methods: {
    ...mapMutations(['addItem', 'updateItem', 'removeItem']),
    async upload(ev) {
      this.progress = 0
      let files = ev.srcElement.files
      // FIXME: async for loop
      for (let file of files) {
        let formData = new FormData();
        formData.append('file', file);
        try {
          let response = await axios.post(
            `/api/${this.playlist}/`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' }}
          )
          this.addItem(response.data)
        } catch (err) {
          // nothing
        }
        this.progress += 1 / files.length
      }
      this.progress = 1
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
    async update(entry, modifications) {
      try {
        let path = `/api/${entry.playlist}/${entry.id}${entry.ext}`
        await axios.put(path, modifications)
        this.updateItem({itemId: entry.id, modifications})
      } catch (err) {
        // Notification
      }
    },
  },
  components: {
    Edit,
  },
}
</script>

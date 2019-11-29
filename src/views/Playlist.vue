<template>
  <v-card>
    <v-container fluid class="ma-0 pa-0">
      <v-row no-gutters justify="start">
        <v-col lg="3" md="4" sm="5" col="6">
          <v-card-title>
            {{playlistName}} Playliste
          </v-card-title>
          <v-card-subtitle v-html="playlistDescription"></v-card-subtitle>
        </v-col>
        <v-col lg="9" md="8" sm="7" col="6" >
          <FileUpload
            :playlist="playlist"
            class="pa-4"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-card-text class="py-0">
      <v-container fluid class="ma-0 pa-0">
        <v-row no-gutters justify="start">
          <v-col lg="3" md="4" sm="5" col="12">
            <v-select
              v-model="orderKey"
              :items="orderItems"
              item-text="text"
              item-value="value"
              label="orderItems"
              single-line
              color="primary"
              prepend-inner-icon="mdi-sort"
              class="mr-2 pa-0"
              :full-width="false"
              hide-details
            ></v-select>
          </v-col>
          <v-col col="12" lg="4" md="5" sm="6">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Suchen"
              single-line
              hide-details
              clearable
              @keyup.esc="search = ''"
              color="primary"
              class="ml-2 pa-0"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text>
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
    <Edit :editing="editing" @done="editing = ''"/>
    </v-card-text>
  </v-card>
</template>

<script>
import 'core-js/proposals/promise-all-settled'

import axios from 'axios'
import {mapGetters, mapMutations, mapActions} from 'vuex'

import Edit from '@/components/Edit.vue'
import FileUpload from '@/components/FileUpload.vue'


import playlists from '@/playlists'
import index from '@/search'

export default {
  name: 'playlist',
  data() {
    return {
      orderKey: '-import_timestamp',
      orderItems: [
        {text: 'Import-Datum (Neuste zuerst)', value: '-import_timestamp'},
        {text: 'Artist (Aufsteigend)', value: '+artist'},
      ],
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
      let key = this.orderKey.substr(1)
      let direction = this.orderKey[0] === '+' ? 1 : -1
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
    async remove(entry) {
      try {
        await axios.delete(`/api/${entry.playlist}/${entry.id}${entry.ext}`)
        this.removeItem(entry.id)
      } catch (err) {
        //Nothing
      }
    edit(entry) {
      this.editing = entry.id
    },
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
    FileUpload,
  },
}
</script>

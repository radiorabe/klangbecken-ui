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
      <v-divider/>

      <template v-for="(entry, index) in playlistData">
      <v-list-item
        :key="entry.id"
        two-line
        dense

      >
        <v-list-item-content class="py-1">
          <v-container fluid class="ma-0 pa-0">
            <v-row no-gutters justify="start">
              <v-col xl="10" lg="8" md="8" sm="6">
                <v-list-item-title>
                  {{entry.title || '&lt;Unbekanter Titel>'}}
                  <span class="caption">({{toMinutes(entry.length)}})</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  von <span class="font-italic">{{entry.artist || '&lt;Unbekannter Artist>'}}</span>
                  &nbsp;<span class="caption">({{entry.play_count}} Plays)</span>
                </v-list-item-subtitle>
                <v-list-item-subtitle class="font-weight-light caption">
                  {{entry.original_filename}}
                </v-list-item-subtitle>
                </v-col>
                <v-col xl="1" lg="2" md="2" sm="3" class="px-2 py-1">
                  <v-btn
                    x-small
                    outlined
                    block
                    color="secondary"
                    @click="setPreview(entry)"
                    class="ma-0 mb-2"
                  >
                    <v-icon x-small left>mdi-play</v-icon>
                    Vorhören
                  </v-btn>
                  <v-btn
                    x-small
                    outlined
                    block
                    color="secondary"
                    @click="edit(entry)"
                    :disabled="!isLoggedIn"
                    class="ma-0 text-truncate"
                  >
                    <v-icon x-small left>mdi-playlist-edit</v-icon>
                    Tags bearbeiten
                  </v-btn>
                </v-col>
                <v-col xl="1" lg="2" md="2" sm="3" class="px-2 py-1">
                  <v-btn
                    x-small
                    outlined
                    block
                    color="secondary"
                    @click="playNext(entry)"
                    :disabled="!isLoggedIn"
                    class="ma-0 mb-2"
                  >
                    <v-icon x-small left>mdi-upload</v-icon>
                    Play next
                  </v-btn>
                  <v-btn
                    x-small
                    outlined
                    block
                    color="error"
                    @click="remove(entry)"
                    :disabled="!isLoggedIn"
                    class="ma-0"
                  >
                    <v-icon x-small left>mdi-delete</v-icon>
                    Löschen
                  </v-btn>

                </v-col>
              </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="index"/>
    </template>
    <Edit :editing="editing" @done="editing = ''"/>
    <RemoveConfirmation :removing="removing" @done="removing = ''"/>
    </v-card-text>
  </v-card>
</template>

<script>
import 'core-js/proposals/promise-all-settled'

import axios from 'axios'
import {mapGetters, mapMutations, mapActions} from 'vuex'

import Edit from '@/components/Edit.vue'
import RemoveConfirmation from '@/components/RemoveConfirmation.vue'
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
      removing: '',
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
    toMinutes(seconds) {
      let minutes = Math.round(seconds / 60)
      seconds = `00${Math.round(seconds % 60)}`
      seconds = seconds.substr(seconds.length - 2)
      return `${minutes}:${seconds}`
    },
    edit(entry) {
      this.editing = entry.id
    },
    remove(entry) {
      this.removing = entry.id
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
    RemoveConfirmation,
    FileUpload,
  },
}
</script>

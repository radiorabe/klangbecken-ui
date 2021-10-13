<template>
  <v-card>
    <v-container fluid class="ma-0 pa-4">
      <v-row>
        <v-col class="title pl-4">Player Information</v-col>
      </v-row>
      <v-row v-if="onAir && hasData" class="mt-0">
        <v-col lg=1 md=2 sm=3 class="subtitle-2">Aktueller Track:</v-col>
        <v-col lg=11 md=10 sm=9 class="subtitle-2 font-weight-regular">
          {{current.artist}} &mdash; {{current.title}}
          <span class="font-italic pl-2">(aus der Playlist {{currentSource}})</span>
        </v-col>
      </v-row>
      <v-row v-else class="pt-0 mt-0 subtitle-2 font-weight-regular">
        <v-col><span class="font-italic">Nicht</span> "on air".</v-col>
      </v-row>
      <v-row>
        <v-col class="subtitle-1 font-weight-bold">Anstehende Tracks</v-col>
      </v-row>
      <template v-if="hasData">
        <v-row v-for="[playlist, artist, title] of nextSongs" :key="playlist" class="mt-0">
          <v-col lg=1 md=2 sm=3 class="subtitle-2">{{playlist}}:</v-col>
          <v-col v-if="onAir && (artist || title)" lg=11 md=10 sm=9 class="subtitle-2 font-weight-regular">
            {{artist || '&lt;Unbekannter Artist&gt;'}} &mdash;
            {{title || '&lt;Unbekannter Titel&gt;'}}
          </v-col>
          <v-col v-else lg=11 md=10 sm=9 class="subtitle-2 font-weight-regular font-italic">
            Noch kein Track eingeplant
          </v-col>
        </v-row>
      </template>
      <v-row>
        <v-col lg=2 md=2 sm=3 class="subtitle-1 font-weight-bold pb-4">Warteschlange</v-col>
      </v-row>
      <v-row v-if="!onAir" class="mt-0">
        <v-col class="subtitle-2 font-weight-regular font-italic pb-6 pt-0 mt-0">
          Die Tracks werden abgespielt, sobald das Klangbecken wieder "on air" ist.
        </v-col>
      </v-row>
      <template v-if="hasData && info.queue">
        <v-row v-for="entry, number of queue" :key="entry.id + entry.queue_id" class="my-0">
          <v-col lg=4 md=6 sm=7 class="subtitle-2 font-weight-regular text-truncate pt-0">
            {{number + 1}}. {{data[entry.id].artist || '&lt;Unbekannter Artist&gt;'}} &mdash;
            {{data[entry.id].title || '&lt;Unbekannter Titel&gt;'}}
          </v-col>
          <v-col lg="1" md="2" sm="3" class="pt-0">
            <v-btn
              v-if="entry.queue === 'secondary'"
              x-small
              outlined
              color="error"
              @click="queueRemove(entry.queue_id)"
              :disabled="!isLoggedIn || !online"
              class="ma-0"
            ><v-icon x-small left>mdi-delete</v-icon> Löschen</v-btn>
          </v-col>
        </v-row>
      </template>
      <v-row v-else class="my-0">
        <v-col class="subtitle-2 font-weight-regular font-italic pt-0">Keine Einträge</v-col>
      </v-row>
    </v-container>

    <v-divider />

    <v-card-subtitle class="title px-4 mb-0 pb-0 text--primary">
      System Information
    </v-card-subtitle>
    <v-card-subtitle class="pt-2">
      <p class="mt-0 mb-1">
        <span class="subtitle-2 font-weight-bold">UI Version: </span>
        <span class="subtitle-2 font-weight-regular">{{version}}</span>
      </p>
      <p class="mb-1">
        <span class="subtitle-2 font-weight-bold">API Version: </span>
        <span class="subtitle-2 font-weight-regular">{{info.api_version}}</span>
      </p>
      <p class="mb-1">
        <span class="subtitle-2 font-weight-bold">Python Version: </span>
        <span class="subtitle-2 font-weight-regular">{{info.python_version}}</span>
      </p>
      <p class="mb-1">
        <span class="subtitle-2 font-weight-bold">Player Version: </span>
        <span class="subtitle-2 font-weight-regular">{{info.liquidsoap_version}}</span>
      </p>
      <p class="mb-1">
        <span class="subtitle-2 font-weight-bold">Player Uptime: </span>
        <span class="subtitle-2 font-weight-regular">{{info.uptime}}</span>
      </p>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations} from "vuex";
import playlists from "@/playlists"
import {version} from '../../package.json';

const QUEUE_TIMEOUT = 3 * 1000;  // three seconds

export default {
  name: "info",
  data() {
      return {
        queue: [],
        queueInterval: null,
        version: version,
      }
  },
  created() {
    this.loadQueue();
    this.queueInterval = setInterval(this.loadQueue, QUEUE_TIMEOUT);
  },
  beforeDestroy() {
    clearInterval(this.queueInterval);
    this.queueInterval = null;
  },
  computed: {
    ...mapGetters(["info", "data", "onAir", "online", "hasData", "isLoggedIn"]),
    current() {
      let id =  this.info.current_track.id
      return this.data[id]
    },
    currentSource() {
      let source = this.info.current_track.source
      if (source === "queue") {
        return "Warteschlange"
      } else {
        return playlists[source].name
      }
    },
    nextSongs() {
      let lst = []
      for (let playlist of Object.keys(playlists)) {
        let id = this.info[playlist]
        let playlistName = playlists[playlist] ? playlists[playlist].name : "Warteschlange"
        if (id && id in this.data) {
          let track = this.data[id]
          lst.push([playlistName, track.artist, track.title])
        } else {
          lst.push([playlistName])
        }
      }
      return lst
    }
  },
  methods: {
    ...mapMutations(["error"]),
    async loadQueue() {
      try {
        let response = await axios.get('/api/player/queue/');
        this.queue = response.data
      } catch (err) {
        this.error(err)
      }
    },
    async queueRemove(queue_id) {
      try {
        axios.delete(`/api/player/queue/${queue_id}`)
        let idx = this.queue.findIndex(entry => entry.queue_id === queue_id)
        this.queue.splice(idx, 1)
      } catch (err) {
        this.error(err)
      }
    },
  }
}
</script>

<template>
  <div>
    <v-card>
      <v-container fluid class="ma-0 pa-0">
        <v-row no-gutters justify="start">
          <v-col lg="3" md="4" sm="5" col="6">
            <v-card-title>{{playlistName}} Playliste ({{playlistData.length}} Songs)</v-card-title>
            <v-card-subtitle v-html="playlistDescription"></v-card-subtitle>
          </v-col>
          <v-col lg="9" md="8" sm="7" col="6">
            <FileUpload :playlist="playlist" class="pa-4" />
          </v-col>
        </v-row>
      </v-container>
      <v-card-text class="py-0">
        <v-container fluid class="ma-0 pa-0">
          <v-row no-gutters justify="start">
            <v-col lg="3" md="4" sm="6" col="12">
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
            <v-col lg="4" md="5" sm="6" >
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Suchen"
                single-line
                hide-details
                clearable
                @click:clear="search = ''"
                @keyup.esc="search = ''"
                color="primary"
                class="ml-2 pa-0"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" lg="5" md="3" sm="12" v-if="hasMarked">
              <div class="ml-auto pl-4 pt-2 mr-0">
                <v-btn
                  color="error"
                  :disabled="!isLoggedIn || !online"
                  class="ml-auto"
                  @click="remove(marked)"
                  small
                >
                  <v-icon small left>mdi-delete</v-icon>markierte Löschen
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-text>
        <v-divider />
        <RecycleScroller
          :items="playlistData"
          :item-size="40"
          key-field="id"
          v-slot="{ item: entry }"
          class="scroller"
          page-mode
        >
          <v-card
            flat
            tile
            height="39"
            @mouseover="hovering = entry.id"
            @mouseleave="hovering = ''"
            style="flex"
            class="d-flex justify-space-between align-center flex-nowrap"
            :class="{
                disabled: entry.weight === 0,
                'grey lighten-3': (isMarked(entry) && hovering !== entry.id),
                'teal lighten-5': (!isMarked(entry) && hovering === entry.id),
                'blue-grey lighten-4': (isMarked(entry) && hovering === entry.id)
            }"
          >
            <p
              class="mb-0 mr-1 text-truncate flex-grow-1"
              :class="{'flex-shrink-0': (hovering !== entry.id)}"
              @click="toggleMark(entry)"
            >
              <span
                class="subtitle-1 font-weight-bold"
              >{{entry.title || '&lt;Unbekannter Titel&gt;'}}</span> von
              <span
                class="subtitle-1 font-italic"
              >{{entry.artist || '&lt;Unbekannter Artist&gt;'}}</span>
              <span class="ml-2 caption">
                (Plays: {{entry.play_count}}
                <span
                  v-if="playlistShowWeights"
                >&mdash; Priorität: {{entry.weight}}</span>
                <span
                  v-if="playlistShowExpiration && entry.expiration"
                >&mdash; Ablaufdatum: {{niceDate(entry.expiration)}}</span>)
              </span>
            </p>
            <p
              class="mb-0 flex-grow-0 text-right caption text-truncate"
              v-if="hovering !== entry.id"
            >
              <span>{{entry.original_filename}}</span>
              <br />
              <span>I: {{niceDate(entry.import_timestamp)}}</span>
              <span> / </span>
              <span>P: {{niceDate(entry.last_play) || 'Nie' }}</span>
            </p>
            <template v-else>
              <p class="mb-0 mr-1 flex-grow-0 text-right">
                <v-btn
                  small
                  color="secondary"
                  @click="setPreview(entry)"
                  class="ma-0"
                  :disabled="!online"
                >
                  <v-icon x-small left>mdi-play</v-icon>Vorhören
                </v-btn>
              </p>
              <p class="mb-0 mr-1 flex-grow-0 text-right">
                <v-btn
                  small
                  color="secondary"
                  @click="edit(entry)"
                  :disabled="!isLoggedIn || !online"
                  class="ma-0"
                >
                  <v-icon x-small left>mdi-pencil</v-icon>Bearbeiten
                </v-btn>
              </p>
              <p class="mb-0 mr-1 flex-grow-0 text-right">
                <v-btn
                  small
                  color="secondary"
                  @click="playNext(entry)"
                  :disabled="!isLoggedIn || !online"
                  class="ma-0"
                >
                  <v-icon x-small left>mdi-upload</v-icon>Warteschlange
                </v-btn>
              </p>
              <p class="mb-0 mr-0 flex-grow-0 text-right">
                <v-btn
                  small
                  color="error"
                  @click="remove(entry)"
                  :disabled="!isLoggedIn || !online"
                  class="ma-0"
                >
                  <v-icon x-small left>mdi-delete</v-icon>Löschen
                </v-btn>
              </p>
            </template>
          </v-card>
          <v-divider />
        </RecycleScroller>
      </v-card-text>
    </v-card>
    <Edit :editing="editing" @done="editing = ''" />
    <RemoveConfirmation :removing="removing" @done="afterRemoving" v-if="removing" />
  </div>
</template>

<script>
import "core-js/proposals/promise-all-settled";

import axios from "axios";
import { mapGetters, mapMutations } from "vuex";
import { RecycleScroller } from "vue-virtual-scroller";

import Edit from "@/components/Edit.vue";
import RemoveConfirmation from "@/components/RemoveConfirmation.vue";
import FileUpload from "@/components/FileUpload.vue";

import playlists from "@/playlists";
import index from "@/search";

export default {
  name: "playlist",
  data() {
    return {
      orderKey: "-import_timestamp",
      search: "",
      editing: "",
      removing: "",
      hovering: "",
      marked: []
    };
  },
  props: ["playlist"],
  created() {},
  computed: {
    ...mapGetters(["isLoggedIn", "data", "online"]),
    playlistName() {
      return playlists[this.playlist].name;
    },
    playlistDescription() {
      return playlists[this.playlist].description;
    },
    playlistShowWeights() {
      return playlists[this.playlist].weights;
    },
    playlistShowExpiration() {
      return playlists[this.playlist].expirable;
    },
    orderItems() {
      let orders = [
        { text: "Importdatum (Neuste zuerst)", value: "-import_timestamp" },
        { text: "Artist (Aufsteigend)", value: "+artist" },
        { text: "Anzahl Plays (Absteigend)", value: "-play_count" }
      ];
      if (this.playlistShowWeights) {
        orders.push({ text: "Priorität (Absteigend)", value: "-weight" });
      }
      return orders;
    },
    playlistData() {
      if (this.search) {
        return this.playlistSearchData;
      } else {
        return this.playlistSortedData;
      }
    },
    playlistSearchData() {
      let ids = index[this.playlist].search(this.search)
      let results = []
      for (let id of ids) {
        results.push(this.data[id])
      }
      return results
    },
    playlistSortedData() {
      let playlist = Object.values(this.data).filter(
        entry => entry.playlist === this.playlist
      );
      let key = this.orderKey.substr(1);
      let direction = this.orderKey[0] === "+" ? 1 : -1;
      playlist.sort((left, right) => {
        if (left[key] < right[key]) {
          return -1 * direction;
        } else if (right[key] < left[key]) {
          return 1 * direction;
        } else {
          return 0;
        }
      });
      return playlist;
    },
    hasMarked() {
      return this.marked.length > 0;
    }
  },
  methods: {
    ...mapMutations(["setPreview", "success", "error"]),
    edit(entry) {
      this.editing = entry.id;
    },
    remove(entries) {
      if (! (entries instanceof Array)) {
        this.removing = [entries.id]
      } else {
        this.removing = entries;
      }
    },
    toggleMark(entry) {
      let currentIndex = this.marked.indexOf(entry.id);
      if (currentIndex == -1) {
        this.marked.push(entry.id);
      } else {
        this.marked.splice(currentIndex, 1);
      }
    },
    isMarked(entry) {
      return this.marked.indexOf(entry.id) != -1;
    },
    async playNext(entry) {
      try {
        await axios.post(`/api/player/queue/`, {
          filename: `${entry.playlist}/${entry.id}.${entry.ext}`
        });
        this.success(
          `Der Song '${entry.title}' wird demnächst im Klangbecken abgespielt.`
        );
      } catch (err) {
        this.error("Der Song konnte nicht in die Queue aufgenommen werden.");
      }
    },
    niceDate(timestamp) {
      let date = new Date(timestamp);
      if (isNaN(date)) {
        return
      }
      let options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      };

      return date.toLocaleDateString("de-CH", options);
    },
    async afterRemoving() {
      this.marked = [];
      let length = this.search.length;
      this.search = this.search + " ";
      this.removing = "";
      await this.$nextTick();
      this.search = this.search.substr(0, length);
    }
  },
  components: {
    RecycleScroller,
    Edit,
    RemoveConfirmation,
    FileUpload
  }
};
</script>
<style>
.scroller {
  position: relative;
}

.vue-recycle-scroller__item-view {
  margin: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
.disabled {
  color: gray !important;
}
</style>

<template>
  <v-dialog
    :value="show"
    persistent
    max-width="500"
    @keydown.esc="cancel"
    @click:outside="cancel"
    @keydown.ctrl.left="prev"
    @keydown.ctrl.right="next"
  >
    <v-card v-if="show">
      <v-card-title class="headline">Bearbeiten</v-card-title>
      <v-card-text class="pl-8 pr-12">
        <v-text-field
          label="Artist"
          ref="artist"
          required
          autofocus
          v-model="artist"
          @keyup.enter="tabbyEnter"
          @keyup.esc="cancel"
          hint="Mit [Tab] oder [Enter] zum nächsten Feld springen"
        ></v-text-field>
        <v-text-field
          label="Title"
          ref="title"
          required
          v-model="title"
          @keyup.enter="save"
          @keyup.esc="cancel"
          hint="Mit [Enter] abspeichern, mit [Esc] abbrechen"
        ></v-text-field>
        <v-slider
          v-if="showWeight"
          label="Priorität"
          v-model="weight"
          min="0"
          max="5"
          :hint="weight ? '' : 'Abgestellt'"
          :color="weight ? 'primary': 'error'"
          :thumb-size="20"
          thumb-label="always"
          class="mt-5"
        ></v-slider>
        <p class="mt-2 mb-0">
          <span class="subtitle-1">Dateiname:</span>
          <span class="ml-2">{{item.original_filename}}</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Anzahl Plays:</span>
          <span class="ml-2">{{item.play_count}}</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Zuletzt gespielt:</span>
          <span class="ml-2">{{item.last_play.replace('T', ' ').substr(0,19) || 'noch nie'}}</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Länge:</span>
          <span
            class="ml-2"
          >{{toMinutes(item.cue_out - item.cue_in)}} ({{Math.round(100 * (item.cue_out - item.cue_in)) / 100}} s)</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Cue in:</span>
          <span class="ml-2">{{Math.round(100 * item.cue_in) / 100}} s</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Cue out:</span>
          <span class="ml-2">{{Math.round(100 * item.cue_out) / 100}} s</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Normalisierung:</span>
          <span class="ml-2">{{item.track_gain}}</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Kanäle:</span>
          <span class="ml-2">{{item.channels === 2 ? 'stereo': 'mono'}}</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Samplerate:</span>
          <span class="ml-2">{{item.samplerate/1000}} kHz</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Bitrate:</span>
          <span class="ml-2">{{item.bitrate}} kbit/s</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Importdatum:</span>
          <span class="ml-2">{{item.import_timestamp.replace('T', ' ').substr(0,19)}}</span>
        </p>
        <p class="mb-0">
          <span class="subtitle-1">Hochgeladen von:</span>
          <span class="ml-2">{{item.uploader}}</span>
        </p>

        <p class="mb-0">
          <span class="subtitle-1">ID:</span>
          <span class="ml-2">{{item.id}}</span>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" text :disabled="isFirst()" @click="prev" title="[Ctrl]-[Links]">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn color="secondary" text :disabled="isLast()" @click="next" title="[Ctrl]-[Rechts]">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="cancel" title="[Esc]">Abbrechen</v-btn>
        <v-btn color="secondary" @click="save(); cancel()">Speichern</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Edit",
  data() {
    return {
      artist: "",
      title: "",
      weight: 0
    };
  },
  props: ["editing"],
  computed: {
    ...mapGetters(["data"]),
    show() {
      return this.editing !== "" && this.data[this.editing];
    },
    item() {
      if (this.show) {
        return this.data[this.editing];
      } else {
        return {};
      }
    },
    showWeight() {
      return this.$parent.playlistShowWeights;
    }
  },

  methods: {
    ...mapMutations(["error"]),
    ...mapActions(["updateMetadata"]),
    tabbyEnter() {
      this.$refs.title.focus();
    },
    save() {
      this.updateMetadata({
        entry: this.data[this.editing],
        modifications: {
          artist: this.artist,
          title: this.title,
          weight: this.weight
        }
      });
    },
    cancel() {
      this.$emit("done");
    },
    isFirst() {
      let idx = this.$parent.playlistData.findIndex(item => item === this.item);
      return idx === 0;
    },
    isLast() {
      let idx = this.$parent.playlistData.findIndex(item => item === this.item);
      return idx === this.$parent.playlistData.length - 1;
    },
    prev() {
      if (this.artist !== this.item.artist || this.title !== this.item.title) {
        this.error("Nicht gespeicherte Änderungen.");
      } else {
        let idx = this.$parent.playlistData.findIndex(
          item => item === this.item
        );
        if (idx > 0) {
          this.$parent.editing = this.$parent.playlistData[idx - 1].id;
        }
      }
    },
    next() {
      if (this.artist !== this.item.artist || this.title !== this.item.title) {
        this.error("Nicht gespeicherte Änderungen.");
      } else {
        let idx = this.$parent.playlistData.findIndex(
          item => item === this.item
        );
        if (idx < this.$parent.playlistData.length - 1) {
          this.$parent.editing = this.$parent.playlistData[idx + 1].id;
        }
      }
    },
    toMinutes(seconds) {
      let minutes = Math.round(seconds / 60);
      seconds = `00${Math.round(seconds % 60)}`;
      seconds = seconds.substr(seconds.length - 2);
      return `${minutes}:${seconds}`;
    }
  },
  watch: {
    async show(show) {
      if (show) {
        this.artist = this.data[this.editing].artist;
        this.title = this.data[this.editing].title;
        this.weight = this.data[this.editing].weight;

        await this.$nextTick();
        this.$refs.artist.focus();
      }
    }
  }
};
</script>

<style scoped>
</style>

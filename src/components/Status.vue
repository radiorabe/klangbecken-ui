<template>
  <v-toolbar-items class="disable-events">
    <template v-if="state === 'online'">
      <v-btn small tile depressed :ripple="false" text>{{currentSong}}</v-btn>
      <v-btn small depressed tile :disabled="!onAir" :ripple="false" text>
        O{{onAir ? 'n' : 'ff'}} Air:
        <v-icon color="green">mdi-access-point</v-icon>
      </v-btn>
    </template>
    <v-btn
      v-else-if="state === 'not_running'"
      small
      depressed
      tile
      disabled
      :ripple="false"
      text
    >Player läuft nicht</v-btn>
    <v-btn
      v-else
      small
      depressed
      tile
      disabled
      :ripple="false"
      text
    >Offline: Netzwerkverbindung überprüfen</v-btn>
  </v-toolbar-items>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Status",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["state", "data", "hasData", "info", "onAir"]),
    currentSong() {
      if (this.onAir && this.hasData && this.info.current_track !== {}) {
        let id = this.info.current_track.id
        if (id in this.data) {
          let current = this.data[id]
          if (current.title || current.artist) {
            let artist = current.artist || "<Unbekannter Artist> ";
            let title = current.title || "<Unbekannter Title> ";
            return `Aktueller Track: ${artist} - ${title}`
          } else {
            return `Aktueller Track: ${current.original_filename}`;
          }
        } else {
          return "Aktueller Track: <Unbekannter Track>"
        }
      } else {
        return ""
      }
    }
  },
};
</script>

<style>
.disable-events {
  pointer-events: none;
}
</style>

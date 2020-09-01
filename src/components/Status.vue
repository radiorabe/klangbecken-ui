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
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Status",

  created() {},

  beforeDestroy() {},

  data() {
    return {};
  },
  computed: {
    ...mapGetters(["state", "data", "hasData", "info", "onAir"]),
    currentSong() {
      if (this.onAir && this.hasData) {
        let id = this.info.on_air.id
        let current = this.data[id]
        if (current.title || current.artist) {
          let artist = current.artist || "<Unknown Artist> ";
          let title = current.title || "<Unknown Title> ";
          return `Aktueller Song: ${artist} - ${title}`
        } else {
          return `Aktueller Song: ${current.original_filename}`;
        }
      } else {
        return ""
      }
    }
  },
  methods: {
    ...mapMutations(["setOnline", "setOffline", "error"])
  }
};
</script>

<style>
.disable-events {
  pointer-events: none;
}
</style>

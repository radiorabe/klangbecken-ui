<template>
  <v-snackbar :value="isPreviewing" bottom multi-line :timeout="-1">
    <v-container fluid class="flex-grow-1 d-flex justify-space-between align-center flex-nowrap px-0 py-2" style="margin-right: -12px; max-width:100%;">
      <audio :src="previewPath" v-on:ended="ended" autoplay controls class="flex-grow-0 flex-shrink-0"></audio>
      <div class="flex-grow-1 flex-shrink-1 text-truncate" style="min-width: 180px;">
        <strong>{{preview.title || preview.original_filename}}</strong>
        <br/>
        von <em>{{preview.artist}}</em>
      </div>
      <v-btn dark text v-on:click="ended" class="flex-grow-0 flex-shrink-0 px-0 mx-0">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-container>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "PreviewPlayer",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["preview", "previewPath", "isPreviewing"])
  },
  methods: {
    ...mapMutations(["setPreview", "clearPreview"]),
    ended() {
      this.clearPreview();
    }
  }
};
</script>

<style scoped>
audio {
  padding-right: 1em;
}
</style>

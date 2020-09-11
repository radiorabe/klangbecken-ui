<template>
  <v-snackbar :value="isPreviewing" bottom multi-line :timeout="-1">
    <audio :src="previewPath" v-on:ended="ended" autoplay controls></audio>
    {{preview.artist}}
    <br />
    {{preview.title || preview.original_filename}}
    <v-btn dark text v-on:click="ended">
      <v-icon>mdi-close</v-icon>
    </v-btn>
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

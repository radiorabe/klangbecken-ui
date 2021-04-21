<template>
  <v-dialog
    :value="show"
    persistent
    max-width="400"
    @keydown.esc="cancel"
    @keydown.enter="remove"
    @click:outside="cancel"
  >
    <v-card>
      <v-card-title class="headline">Eintrag löschen?</v-card-title>
      <v-card-text>
        Die Datei{{multiple ? 'en': ''}}
        <ul class="my-1" v-if="multiple">
          <li v-for="entry of entries" :key="entry.id">
            {{entry.artist || '&lt;Unbekannter Artist>'}} &mdash; {{entry.title || '&lt;Unbekannter Titel>'}}
            <span class="font-italic">({{entry.original_filename}})</span>
          </li>
        </ul>
        <ul class="my-1" v-else-if="one">
          <li>
            {{entries[0].artist || '&lt;Unbekannter Artist>'}} &mdash; {{entries[0].title || '&lt;Unbekannter Titel>'}}
            <span class="font-italic">({{entries[0].original_filename}})</span>
          </li>
        </ul>
        wirklich löschen?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" outlined @click="cancel">Abbrechen</v-btn>
        <v-btn color="secondary" @click="remove">Löschen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "RemoveConfirmation",
  props: ["removing"],
  computed: {
    ...mapGetters(["data"]),
    show() {
      return this.removing !== "";
    },
    multiple() {
      return this.entries.length > 1;
    },
    one() {
      return this.entries.length === 1;
    },
    entries() {
      if (this.show) {
        return this.removing.filter(entry => entry in this.data)
                            .map(entry => this.data[entry]);
      } else {
        return [];
      }
    },
  },

  methods: {
    ...mapMutations(["removeItem", "success", "error"]),
    next() {
      this.$refs.title.focus();
    },
    async remove() {
      let entries = this.entries
      for (let entry of entries) {
        try {
          await axios.delete(`/api/playlist/${entry.playlist}/${entry.id}.${entry.ext}`);
          this.removeItem(entry.id);
          this.success(`Datei '${entry.original_filename}' wurde gelöscht.`);
        } catch (err) {
          this.error(`Datei '${entry.original_filename}' konnte nicht gelöscht werden.`);
        }
      }
      this.$emit("done");
    },
    cancel() {
      this.$emit("done");
    }
  }
};
</script>

<style scoped>
</style>

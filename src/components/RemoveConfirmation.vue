<template>
  <v-row justify="center">
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
          Die Datei
          <ul class="my-1">
            <li class="font-italic">{{entry.original_filename}}</li>
            <li>{{entry.artist || '&lt;Unbekannter Artist>'}} &mdash; {{entry.title || '&lt;Unbekannter Titel>'}}</li>
          </ul>wirklich löschen?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" outlined @click="cancel">Abbrechen</v-btn>
          <v-btn color="secondary" @click="remove">Löschen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
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
      return this.removing !== "" && this.data[this.removing];
    },
    entry() {
      if (this.show) {
        return this.data[this.removing];
      } else {
        return {};
      }
    }
  },

  methods: {
    ...mapMutations(["removeItem", "success", "error"]),
    next() {
      this.$refs.title.focus();
    },
    async remove() {
      let entry = this.data[this.removing];
      try {
        await axios.delete(`/api/${entry.playlist}/${entry.id}${entry.ext}`);
        this.removeItem(entry.id);
        this.success("Datei wurde gelöscht.");
      } catch (err) {
        this.error("Datei konnte nicht gelöscht werden.");
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

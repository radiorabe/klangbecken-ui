<template>
  <div>
    <v-snackbar
      v-for="(entry, index) in entries"
      :key="index"
      v-model="entry.show"
      :color="entry.color"
      :timeout="6000"
      bottom
      left
      :style="{bottom: (8 + index * 64) + 'px'}"
      @input="update"
    >
      {{entry.text}}
      <v-btn dark text v-on:click="hide(entry)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Notifications",
  data() {
    return {
      entries: []
    };
  },
  computed: {
    ...mapGetters(["notifications"])
  },
  methods: {
    ...mapMutations(["popNotification"]),
    hide(entry) {
      entry.show = false;
      this.$forceUpdate();
    },
    update() {
      this.$forceUpdate();
    }
  },
  watch: {
    notifications() {
      if (this.notifications.length > 0) {
        // Find first empty slot
        for (var entry of this.entries) {
          if (!entry.show) {
            break;
          }
        }
        // `entries` empty, or full
        if (!entry || entry.show) {
          entry = {};
          this.entries.push(entry);
        }
        entry.color = this.notifications[0].type;
        entry.text = this.notifications[0].message;
        entry.show = true;
        this.$forceUpdate();

        this.popNotification();
      }
    }
  }
};
</script>

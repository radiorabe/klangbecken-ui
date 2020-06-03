<template>
  <v-subheader v-if="hasNext" class="v-btn overline">
    <span class="font-weight-regular">Next:</span>
    <span class="custom-transform-class text-none font-weight-bold">{{trackData.title}}</span>
    <span class="custom-transform-class text-none font-weight-thin"> von </span>
    <span class="custom-transform-class text-none">{{trackData.artist}}</span>
  </v-subheader>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

const POLL_TIMEOUT = 3000;

export default {
  name: "NextTrack",
  created() {
    let poll = async () => {
      try {
        let response = await axios.get("/data/prio.m3u", {
          timeout: POLL_TIMEOUT - 100,
          headers: {
            "If-Modified-Since": "invalid"
          }
        });
        this.prioPlaylist = response.data.trim();
      } catch (err) {
        this.error(
          `Der nächste Track konnte nicht abgefragt werden: ${err.message}`
        );
        this.prioPlaylist = "";
      }
    };

    this.polling = setInterval(poll, POLL_TIMEOUT);
    poll();
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },

  data() {
    return {
      prioPlaylist: ""
    };
  },
  computed: {
    ...mapGetters(["data"]),
    hasNext() {
      return this.prioPlaylist != "";
    },
    trackData() {
      return this.data[
        this.prioPlaylist
          .split("/")
          .pop()
          .split(".")
          .shift()
      ];
    }
  }
};
</script>

<style></style>
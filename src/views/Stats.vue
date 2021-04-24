<template>
  <v-card>
    <v-card-title>
      Statistik für {{monthName}} {{year}}
      <v-spacer></v-spacer>

      <v-btn text small color="secondary" :to="{name: 'stats', params: {month: prevMonth}}">
        <v-icon small>mdi-chevron-left</v-icon>Vorheriger Monat
      </v-btn>
      <v-btn text small color="secondary" :to="{name: 'stats', params: {month: nextMonth}}">
        Nächster Monat
        <v-icon small>mdi-chevron-right</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn small color="secondary" :href="`/data/log/${this.month}.csv`" :disabled="!online">
        <v-icon small left>mdi-download</v-icon>CSV-Datei herunterladen
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="dataPrepared"
      :items-per-page="50"
      dense
      must-sort
      sort-by="last_play"
      sort-desc
      :footer-props="{'items-per-page-options':  [50, 100, 200, -1]}"
      :loading="loading"
      loading-text="Daten werden geladen. Bitte warten ..."
      :no-data-text="online ? 'Keine Daten vorhanden' : 'Offline'"
    ></v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
import { parse } from "papaparse";
import { mapGetters } from "vuex";

export default {
  name: "stats",
  data() {
    return {
      headers: [
        {
          text: "Artist",
          align: "left",
          value: "artist"
        },
        {
          text: "Titel",
          align: "left",
          value: "title"
        },
        {
          text: "Dateiname",
          align: "left",
          value: "original_filename"
        },
        {
          text: "Playliste",
          value: "playlist",
          width: 110
        },
        {
          text: "Zeitstempel",
          align: "left",
          value: "last_play",
          width: 170
        },
        {
          text: "Plays",
          value: "play_count",
          width: 90
        }
      ],
      search: "",
      data: [],
      loading: true
    };
  },
  props: ["month"],
  computed: {
    ...mapGetters(["online"]),
    months() {
      return "Januar Februar März April Mai Juni Juli August September Oktober November Dezember".split(
        " "
      );
    },
    monthName() {
      let month = this.month.split("-").map(s => parseInt(s, 10))[1];
      return this.months[month - 1];
    },
    year() {
      return this.month.split("-").map(s => parseInt(s, 10))[0];
    },
    nextMonth() {
      return this.adjacentMonth(1);
    },
    prevMonth() {
      return this.adjacentMonth(-1);
    },
    dataPrepared() {
      if (this.loading) return [];
      let lst = [];
      for (let entry of this.data) {
        let obj = {};
        for (let { value } of this.headers) {
          obj[value] = entry[value];
        }
        if (entry.id !== "") {
          obj.last_play = obj.last_play.replace("T", " ").substr(0, 19);
          lst.push(obj);
        }
      }
      return lst;
    }
  },
  async created() {
    this.loading = true;
    try {
      let response = await axios.get(`/data/log/${this.month}.csv`);
      let parsed = parse(response.data, { header: true });
      this.data = parsed.data;
    } catch (err) {
      // Not available
    }
    this.loading = false;
  },
  beforeDestroy() {},
  methods: {
    adjacentMonth(direction) {
      let [year, month] = this.month.split("-").map(s => parseInt(s, 10));
      let newMonth = ((month + 11 + direction) % 12) + 1;
      let newYear = year + Math.floor((month + 11 + direction) / 12) - 1;
      return `${newYear}-${String(newMonth).padStart(2, "0")}`;
    }
  }
};
</script>


<template>
  <div>
    <h2>Play-Statistik für {{month}}</h2>
    <router-link :to="{name: 'stats', params: {month: prevMonth}}">&lt; {{prevMonth}}</router-link> |
    <router-link :to="{name: 'stats', params: {month: nextMonth}}">{{nextMonth}} &gt;</router-link>

    <v-data-table
      :headers="headers"
      :items="dataPrepared"
      :items-per-page="50"
      class="elevation-2"
      :footer-props="{'items-per-page-options':  [50, 100, 200, -1]}"
      :loading="loading"
      :loading-text="loadingText"
      dense
     ></v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
import {parse} from 'papaparse'

export default {
  data() {
    return {
      headers: [
        {
          text: 'Artist',
          align: 'left',
          value: 'artist',
        },
        {
          text: 'Titel',
          align: 'left',
          value: 'title',
        },
        {
          text: 'Dateiname',
          align: 'left',
          value: 'original_filename',
        },
        {
          text: 'Zeitstempel',
          align: 'left',
          value: 'last_play',
        },
        {
          text: 'Anzahl Plays',
          align: 'left',
          value: 'play_count',
        },

      ],
      data: {},
      loadingText: 'Daten werden geladen. Bitte warten ...',
      loading: true
    }
  },
  props: ['month'],
  computed:{
    nextMonth() {
      return this.adjacentMonth(1)
    },
    prevMonth() {
      return this.adjacentMonth(-1)
    },
    dataPrepared() {
      if (this.loading)
        return []
      let lst = []
      for (let entry of this.data) {
        let obj = {}
        for (let {value} of this.headers) {
          obj[value] = entry[value]
        }
        if (entry.id !== '')
          lst.push(obj)
      }
      return lst
    }
  },
  async created() {
    this.loading = true
    try {
      let response = await axios.get(`/data/log/${this.month}.csv`)
      let parsed = parse(response.data, {header: true})
      this.data = parsed.data
      this.loading = false
    } catch (err) {
      this.loadingText = "Keine Daten verfügbar."
    }
  },
  beforeDestroy () {
  },
  methods: {
    adjacentMonth(direction) {
      let [year, month] = this.month.split('-').map((s) => parseInt(s, 10))
      let newMonth = (month + 11 + direction) % 12 + 1
      let newYear = year + Math.floor((month + 11 + direction) / 12) - 1
      return `${newYear}-${newMonth}`
    },
  },
}
</script>


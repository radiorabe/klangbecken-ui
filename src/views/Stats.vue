<template>
  <div>
    <h2>Statistics for {{month}}</h2>
    <router-link :to="{name: 'stats', params: {month: prevMonth}}">&lt; {{prevMonth}}</router-link> |
    <router-link :to="{name: 'stats', params: {month: nextMonth}}">{{nextMonth}} &gt;</router-link>

    <div v-if="loading">Loading</div>
    <table border="1" v-else-if="available">
      <tr>
        <th v-for="title in headers" :key="title">{{title}}</th>
      </tr>
      <tr v-for="entry in data" :key="entry.id">
        <td v-for="key in headers" :key="key">{{entry[key] || ''}}</td>
      </tr>
    </table>
    <div v-else>No data available</div>
  </div>
</template>

<script>
import axios from 'axios'
import {parse} from 'papaparse'

export default {
  data() {
    return {
      headers: [],
      data: {},
      available: true,
      loading: true
    }
  },
  computed:{
    month() {
      return this.$route.params.month
    },
    nextMonth() {
      return this.adjacentMonth(1)
    },
    prevMonth() {
      return this.adjacentMonth(-1)
    }
  },
  created() {
    this.load()
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
    async load() {
      this.loading = true
      try {
        let response = await axios.get(`/data/log/${this.month}.csv`)
        let parsed = parse(response.data, {header: true})
        this.headers = parsed.meta.fields
        this.data = parsed.data
        this.available = true
      } catch (err) {
        this.available = false
      }
      this.loading = false
    },
  },
  watch: {
    '$route'() {
      this.load()
    }
  },
}
</script>


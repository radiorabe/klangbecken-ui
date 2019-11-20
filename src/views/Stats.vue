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
      let [year, month] = this.month.split('-').map((s) => parseInt(s, 10))
      if (month === 12) {
        month = 1
        year += 1
      } else {
        month += 1
      }
      if (month < 10) {
        return `${year}-0${month}`
      } else {
        return `${year}-${month}`
      }
    },
    prevMonth() {
      let [year, month] = this.month.split('-').map((s) => parseInt(s, 10))
      if (month === 1) {
        month = 12
        year -= 1
      } else {
        month -= 1
      }
      if (month < 10) {
        return `${year}-0${month}`
      } else {
        return `${year}-${month}`
      }
    }
  },
  created() {
    this.load()
  },
  beforeDestroy () {
  },
  methods: {
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
  }
}
</script>


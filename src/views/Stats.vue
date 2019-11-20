<template>
  <div>
    <h2>Statistics for {{month}}</h2>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  computed:{
    month() {
      return this.$route.params.month
    }
  },
  async created() {
  },
  beforeDestroy () {
  },
  methods: {
  },
}
</script>


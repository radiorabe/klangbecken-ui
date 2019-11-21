<template>
  <div>
    <h2>Not Found</h2>
    The page <code>'{{path}}'</code> you requested does not exist.
  </div>
</template>

<script>
export default {
  computed: {
    path() { return this.$route.params.pathMatch },
  }
}
</script>

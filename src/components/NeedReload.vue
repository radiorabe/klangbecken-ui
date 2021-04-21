<template>
  <v-dialog
    :value="show"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">Bitte Seite neu laden</v-card-title>
      <v-card-text>
        Für die Applikation wurde ein Update eingespielt. Bitte die Seite neu laden, um die Änderungen zu laden.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="reload">Neu laden</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NeedReload",
  props: ["show"],
  methods: {
    reload() {
        window.location.reload()
    },
  },
}
</script>

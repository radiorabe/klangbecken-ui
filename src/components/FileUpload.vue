<template>
  <div class="d-flex">
    <v-btn
      color="secondary"
      :disabled="!isLoggedIn || !online"
      @click="showUploadDialog"
      class="ml-auto"
      small
      v-if="!uploading"
    >
      <v-icon small left>mdi-file-music</v-icon>Dateien hochladen
    </v-btn>
    <v-list-item two-line v-else>
      <v-list-item-content>
        <v-list-item-title>
          <v-progress-linear
            class="mt-0"
            color="primary"
            :value="processing ? 0 : progress"
            :indeterminate="processing"
            rounded
            height="10"
          ></v-progress-linear>
        </v-list-item-title>
        <v-list-item-subtitle
          class="text-center"
        >{{processing ? 'Audio analysieren' : 'Files transferieren'}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <input
      type="file"
      ref="fileupload"
      multiple
      accept="audio/*"
      style="display: none;"
      @change="upload"
      :disabled="!isLoggedIn"
    />
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "FileUpload",
  data() {
    return {
      uploading: false,
      progress: 0,
      processing: false
    };
  },
  props: ["playlist"],
  computed: {
    ...mapGetters(["isLoggedIn", "data", "online"])
  },
  methods: {
    ...mapMutations(["error", "success", "addItem"]),
    ...mapActions(["updateMetadata"]),

    showUploadDialog() {
      this.$refs.fileupload.click();
    },

    async upload(ev) {
      this.progress = 0;
      this.uploading = true;
      let files = ev.srcElement.files;

      let chunks = [...files].reduce(
        (chunks, file) => {
          if (chunks[chunks.length - 1].length === 4) {
            chunks.push([]);
          }
          chunks[chunks.length - 1].push(file);
          return chunks;
        },
        [[]]
      );

      let progress = 0;
      let successes = 0;
      for (let chunk of chunks) {
        let promises = [];
        let progresses = chunk.map(() => 0);
        for (const [index, file] of chunk.entries()) {
          let formData = new FormData();
          formData.append("file", file);
          let promise = axios.post(`/api/${this.playlist}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: progressEvent => {
              progresses[index] = progressEvent.loaded / progressEvent.total;
              let current_progress = progresses.reduce((a, b) => a + b);
              this.progress =
                ((progress + current_progress) / files.length) * 100;
              if (current_progress === progresses.length) {
                this.processing = true;
              }
            }
          });
          promises.push(promise);
        }

        let results = await Promise.allSettled(promises);
        this.processing = false;
        for (let result of results) {
          if (result.status === "fulfilled") {
            this.addItem(result.value.data);
            successes += 1;
          } else {
            this.error(result.reason.response.data.description);
          }
        }
        progress += promises.length;
      }
      if (successes === files.length) {
        this.success(
          `Alle ${successes} Dateien wurden erfolgreich hochgeladen`
        );
      } else {
        this.success(
          `${successes} von ${files.length} Dateien wurden erfolgreich hochgeladen`
        );
      }
      //this.progress = 0
      this.uploading = false;
      //this.$refs.fileupload.value = ''
    }
  }
};
</script>

<style>
</style>

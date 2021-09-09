import Vue from "vue";
import axios from "axios";
import { Index } from "flexsearch";

import index from "@/search";
import playlists from "../playlists"

export default {
  state: {
    data: {},
    loading: false,
    hasData: false,
  },

  getters: {
    hasData: (state) => state.hasData,
    data: (state) => state.data,
    loadingData: (state) => state.loading,
  },

  mutations: {
    setData: (state, newData) => {
      for (let playlist of Object.keys(playlists)) {
        index[playlist] = new Index(
       {
          preset: "performance",
          tokenize: "forward",
        }
        )
      }
      for (let item of Object.values(newData)) {
        index[item.playlist].add(item.id, `${item.artist} - ${item.title} - ${item.original_filename}`);
      }
      state.data = newData;
      state.hasData = true;
    },
    addItems: (state, items) => {
      for (let item of Object.values(items)) {
        index[item.playlist].add(item.id, `${item.artist} - ${item.title} - ${item.original_filename}`);
        Vue.set(state.data, item.id, item);
      }
    },
    removeItem: (state, itemId) => {
      index[state.data[itemId].playlist].remove(itemId);
      Vue.delete(state.data, itemId);
    },
    updateItem: (state, { itemId, modifications }) => {
      for (let key in modifications) {
        Vue.set(state.data[itemId], key, modifications[key]);
      }
      let item = state.data[itemId]
      index[item.playlist].update(itemId, `${item.artist} - ${item.title} - ${item.original_filename}`);
    },
    startLoading: (state) => (state.loading = true),
    endLoading: (state) => (state.loading = false),
  },

  actions: {
    async loadData({ commit }) {
      commit("startLoading");
      try {
        let response = await axios.get("/data/index.json");
        commit("setData", response.data);
      } catch (err) {
        commit("error", "Daten konnten nicht geladen werden.");
      }
      commit("endLoading");
    },
    async updateMetadata({ commit }, { entry, modifications }) {
      try {
        let path = `/api/playlist/${entry.playlist}/${entry.id}.${entry.ext}`;
        await axios.put(path, modifications);
        if (modifications.weight !== entry.weight) {
          await axios.post(`/api/player/reload/${entry.playlist}`);
        }
        commit("updateItem", { itemId: entry.id, modifications });
        commit("success", "Metadaten wurden gespeichert.");
      } catch (err) {
        commit("error", "Metadaten konnten nicht gespeichert werden.");
      }
    },
  },
};

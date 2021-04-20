import axios from "axios";

export default {
    state: {
        state: "offline",
        info: {},
    },

    getters: {
        state: (state) => state.state,
        online: (state) => state.state === "online",
        info: (state) => state.info,
        onAir: (state) => state.state === "online" && "id" in state.info.on_air,
    },

    mutations: {
        setOnline: (state) => { state.state = "online" },
        setOffline: (state) => { state.state = "offline" },
        setNotRunning: (state) => {state.state = "not_running" },
        setInfo: (state, newInfo) => {
            state.info = newInfo;
        },
    },

    actions: {
        async loadInfo(o, timeout) {
            let {commit, getters, dispatch} = o
            try {
                let response = await axios.get("/api/player/", {
                  timeout: (timeout || 1000) - 100,
                  headers: {
                    "If-Modified-Since": "invalid"
                  }
                });
                commit("setInfo", response.data)
                if (getters.state !== "online") {
                    commit("setOnline")
                    dispatch("renewToken")
                }
            } catch (err) {
                if (err.message === "Network Error" || err.message.startsWith("timeout")) {
                    if (getters.state !== "offline") {
                        commit("setOffline")
                        commit("setInfo", {})
                    }
                } else if (err.response.status === 404) {
                    if (getters.state !== "not_running") {
                        commit("setNotRunning")
                        commit("error", `Klangbecken Player läuft nicht`);
                    }
                } else {
                    commit("error", `Klangbecken-Status konnte nicht abgefragt werden: ${err.message}`);
                }
              }
        },
    },
};

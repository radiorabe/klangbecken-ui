module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
      },
      "/data": {
        target: "http://127.0.0.1:5000",
      },
    },
  },
  transpileDependencies: ["vuetify"],
};

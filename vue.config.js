module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      "": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      }
    }
  },
  transpileDependencies: ["vuetify"]
};

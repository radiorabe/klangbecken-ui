module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      "": {
        "target": "http://localhost:5000",
        "changeOrigin": true
      }
    }
  }
}

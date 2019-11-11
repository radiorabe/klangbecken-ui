module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/ui/' : '/',
  devServer: {
    proxy: {
      "": {
        "target": "http://localhost:5000",
        "changeOrigin": true
      }
    }
  }
}

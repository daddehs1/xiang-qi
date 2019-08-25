module.exports = {
  lintOnSave: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: ['./src/sass/global.scss']
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      "/socket.io": {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
}
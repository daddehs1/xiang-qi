module.exports = {
  lintOnSave: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: ['./src/sass/global.scss']
    }
  },
  devServer: {
    proxy: 'http://localhost:80',
  }
}
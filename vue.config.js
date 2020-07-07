// vue.config.js
module.exports = {
  // options...
  pages: {
    index: {
      // entry for the page
      entry: 'main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }

  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  assetsDir: '',
  filenameHashing: true,
  productionSourceMap: false
}

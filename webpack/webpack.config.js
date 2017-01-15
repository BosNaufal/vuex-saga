require('es6-promise').polyfill();

module.exports = {

  entry: __dirname + '/../examples/simple/main.js',

  output: {
    path: __dirname + '/../build',
    publicPath: '/build/',
    filename: 'build.js',
    chunkFilename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
      {
        test: /\.css$/,
        loaders: ['style','css']
      }
    ]
  }

};

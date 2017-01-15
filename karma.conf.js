
var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    singleRun: false,

    frameworks: ['mocha'],

    files: [
      'webpack/webpack-test.config.js'
    ],

    preprocessors: {
      'webpack/webpack-test.config.js': ['webpack']
    },

    reporters: ['mocha'],

    port: 9090,

    webpack: {

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
            query: {
              presets: ["es2015"],
              plugins: ["transform-object-rest-spread","transform-vue-jsx"]
            }
          }
        ],


      },

      webpackMiddleware: {
           // webpack-dev-middleware configuration
           // i.e.
           noInfo: true,
           // and use stats to turn off verbose output
           stats: {
               // options i.e.
               chunks: false
           }
      },

      resolve: {
        alias: {
          vue: 'vue/dist/vue.js',
          components: '../../../src/js/components',
          myVuex: '../../../src/js/vuex/modules',
          js: '../../../src/js'
        }
      },
    },

    webpackServer: {
      noInfo: true,
    },

  })
};

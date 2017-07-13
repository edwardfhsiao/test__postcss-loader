const webpack = require('webpack');
const path = require('path');
const PATH = require('./build_path');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = (module.exports = {
  context: PATH.ROOT_PATH,
  entry: {
    index: PATH.ROOT_PATH + 'src/js/index.jsx'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [{ loader: 'eslint-loader', options: {} }]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015', 'react', 'stage-2'] }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)\??.*$/,
        use: [{ loader: 'url-loader?limit=8192&name=font/[name].[ext]' }]
      },
      {
        test: /\.(jpe?g|png|gif|svg)\??.*$/,
        use: [{ loader: 'url-loader?limit=8192&name=img/[name].[ext]' }]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      // DEPENDENCIES CSS FILE
      // {
      //   test: /\.css$/,
      //   include: /node_modules/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       {
      //         loader: 'css-loader',
      //         options: {
      //           importLoaders: 1
      //         }
      //       },
      //       {
      //         loader: 'postcss-loader',
      //         options: {
      //           // ident: 'postcss',
      //           plugins: loader => [
      //             require('postcss-import')({
      //               root: loader.resourcePath
      //             }),
      //             require('lost'),
      //             require('autoprefixer')(),
      //             require('cssnano')()
      //           ]
      //         }
      //       }
      //     ]
      //   })
      // },
      // MY CSS FILE
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                // ident: 'postcss',
                plugins: loader => [
                  require('postcss-import')({
                    root: loader.resourcePath
                  }),
                  require('lost'),
                  require('autoprefixer')(),
                  require('cssnano')()
                ]
              }
            }
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.coffee', '.json'],
  },
  output: {
    path: PATH.ASSET_PATH,
    filename: 'js/[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: 'commons',
      chunks: ['lib', 'index']
    }),
    new webpack.ContextReplacementPlugin(
      /\.\/locale$/,
      'empty-module',
      false,
      /js$/
    ),
    new webpack.ProvidePlugin({
      React: 'React',
      react: 'React',
      'window.react': 'React',
      'window.React': 'React',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new ManifestPlugin({
      fileName: 'rev-manifest.json'
    }),
    new HtmlWebpackPlugin({
      template: PATH.HTML_PATH + '/layout.html',
      title: 'test__postcss-loader',
      page: 'index',
      filename: 'index.html',
      hash: false,
      chunksSortMode: function(chunk1, chunk2) {
        var orders = ['common', 'index'];
        var order1 = orders.indexOf(chunk1.names[0]);
        var order2 = orders.indexOf(chunk2.names[0]);
        if (order1 > order2) {
          return 1;
        } else if (order1 < order2) {
          return -1;
        } else {
          return 0;
        }
      }
    })
  ]
});

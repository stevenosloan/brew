var path = require("path");
var webpack = require("webpack");

var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
var OfflinePlugin = require("offline-plugin");
var WebpackPwaManifest = require('webpack-pwa-manifest');
var ExtractSass = new ExtractTextPlugin({
  filename: "[name]-[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]-[hash].js"
  },
  plugins: [
    ExtractSass,
    new WebpackPwaManifest({
      name: "Brew",
      short_name: "Brew",
      description: "Little tools to help brew",
      background_color: "#eeeeee",
      theme_color: "#59569d",
      orientation: "portrait",
      display: "standalone",
      ios: {
        "apple-mobile-web-app-capable": "yes"
      },
      inject: true,
      icons: [
        {
          src: path.resolve('src/assets/img/icon.png'),
          sizes: [192],
          destination: path.join("assets", "img"),
          ios: true
        }
      ]
    }),
    new HtmlWebpackPlugin({
      title: "Brew",
      template: "src/layout/layout.ejs",
      hash: true,
      showErrors: true,
      xhtml: true,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin(),
    new OfflinePlugin({
      relativePaths: true,
      caches: {
        main: [
          "*.css",
          "*.js",
        ],
        additional: [
          ":externals:"
        ],
        optional: [
          ":rest:"
        ]
      },
      ServiceWorker: {
        navigateFallbackURL: "/"
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss: "vue-style-loader!css-loader!sass-loader",
            sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
          }
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractSass.extract({
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "postcss-loader"
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: ["src/assets/css"]
              }
            }
          ],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name]-[hash].[ext]"
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: "#eval-source-map"
};

if (process.env.NODE_ENV === "production") {
  module.exports.devtool = "#source-map";
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}

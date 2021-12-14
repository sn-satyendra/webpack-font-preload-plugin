import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import WebpackFontPreloadPlugin from "../../src/cjs";

/**
 * Default webpack configuration.
 */
export const DEFAULT_WEBPACK_CONFIG = {
  mode: "production",
  entry: [path.resolve(__dirname, "../fixtures/index.js")],
  output: {
    filename: "[name].[chunkhash].bundle.js",
    chunkFilename: "[name].[chunkhash].chunk.js",
    assetModuleFilename: "[name].[hash][ext]",
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../fixtures/index.html"),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true,
        minifyCSS: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].bundle.css",
      chunkFilename: "[name].[contenthash].chunk.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
};

/**
 * Provides the ability to run `webpack` function by passing the webpack configuration
 * and the `WebpackFontPreloadPlugin` options.
 * @param {object} webpackConfigurationOverrides Any overrides for the default webpack
 *                                               configuration.
 * @param {object} pluginOptions WebpackFontPreloadPlugin options.
 * @returns {Promise} Promise which resolves if the webpack is able to do the processing
 *                    else rejects with an error.
 */
export function run(webpackConfigurationOverrides, pluginOptions = {}) {
  const finalWpConfig = {
    ...DEFAULT_WEBPACK_CONFIG,
    ...webpackConfigurationOverrides,
  };
  finalWpConfig.plugins.push(new WebpackFontPreloadPlugin(pluginOptions));
  return new Promise((resolve, reject) => {
    webpack(finalWpConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err || stats);
      }

      const modulePaths = stats.compilation.modules
        .map((i) => i.resource)
        .filter(Boolean)
        .map((mpath) => mpath.replace(/\\/g, "/"));

      resolve(modulePaths);
    });
  });
}

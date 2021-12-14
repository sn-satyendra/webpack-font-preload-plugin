import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

/**
 * Webpack output folder.
 */
export const WP_OUTPUT_DIR = path.resolve(__dirname, "../dist/");

/**
 * Default webpack configuration.
 */
export const DEFAULT_WEBPACK_CONFIG = {
  mode: "production",
  entry: [path.resolve(__dirname, "../fixtures/index.js")],
  output: {
    path: WP_OUTPUT_DIR,
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

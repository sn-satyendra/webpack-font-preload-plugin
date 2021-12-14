const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * Get the webpack configuration for test.
 * @param {object} overrides Webpack configuration overrides.
 * @returns {object} Final configuration.
 */
export default function getConfig(overrides) {
  const config = {
    mode: "production",
    entry: [path.resolve(__dirname, "../fixtures/index.js")],
    output: {
      filename: "[name].[chunkhash].bundle.js",
      chunkFilename: "[name].[chunkhash].chunk.js",
      assetModuleFilename: "[name].[hash][ext]",
      publicPath: "/",
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
      ],
    },
  };
  return {
    ...config,
    ...overrides,
  };
}

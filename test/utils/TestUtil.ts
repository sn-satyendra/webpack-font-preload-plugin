import fs from "fs";
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { JSDOM } from "jsdom";
import WebpackFontPreloadPlugin from "../../src/index";
import { PluginOptions } from "../../src/Types";
import { WP_OUTPUT_DIR } from "../constants/Constants";
import { RunOutput } from "../constants/Types";

/**
 * Get the default webpack config.
 * @returns {object} Config object.
 */
export function getDefaultWebpackConfig(): webpack.Configuration {
  return {
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
}

/**
 * Provides the ability to run `webpack` function by passing the webpack configuration
 * , `WebpackFontPreloadPlugin` and index file name options.
 * @param {object} webpackConfigurationOverrides Any overrides for the default webpack
 *                                               configuration.
 * @param {object} pluginOptions WebpackFontPreloadPlugin options.
 * @param {string} indexFileName Name of the index html file.
 * @returns {Promise} Promise which resolves if the webpack is able to do the processing
 *                    else rejects with an error.
 */
export function run(
  webpackConfigurationOverrides?: webpack.Configuration | null,
  pluginOptions?: PluginOptions,
  indexFileName: string = "index.html"
): Promise<RunOutput> {
  const finalWpConfig = {
    ...getDefaultWebpackConfig(),
    ...webpackConfigurationOverrides,
  };
  finalWpConfig?.plugins?.push(new WebpackFontPreloadPlugin(pluginOptions));
  return new Promise((resolve, reject) => {
    webpack(finalWpConfig, (err, stats) => {
      if (err || stats?.hasErrors()) {
        reject(err || stats);
        return;
      }

      const assets = stats?.compilation?.assets;
      const assetNames = assets && (Object.keys(assets) || []);
      try {
        const htmlContent = fs
          .readFileSync(
            path.join(
              finalWpConfig?.output?.path || WP_OUTPUT_DIR,
              indexFileName
            )
          )
          .toString();
        const parsed = new JSDOM(htmlContent);
        const { document } = parsed && parsed.window;
        resolve({
          index: htmlContent,
          document,
          assets: assetNames,
        });
      } catch (fileReadError) {
        reject(fileReadError);
      }
    });
  });
}

/**
 * Get all the link tags for font preloads/prefetch from the provided
 * document.
 * @param {object} document JSDOM document object.
 * @returns {Element[]} Array of font link tags generated in document.
 */
export function findPreloadedFonts(document: Document): Element[] {
  const links = document.querySelectorAll("link[as='font']");
  return Array.from(links);
}

/**
 * Get all the font names from the link tags for fonts preloaded in document.
 * @param {object} document JSDOM document object.
 * @returns {string[]} Array of font names generated in document.
 */
export function findPreloadedFontNames(document: Document): string[] {
  const names: string[] = [];
  findPreloadedFonts(document).forEach((link) => {
    const name = link.getAttribute("href")?.split("/").pop();
    if (name) {
      names.push(name);
    }
  });
  return names;
}

/**
 * Check if the provided set of fonts match with the provided set of extensions.
 * If there is any mismatch, the function promise rejects with all failures.
 * @param {string[]} fonts List of fonts to check.
 * @param {string[]} validExtensions Valid extensions to test against.
 * @returns {Promise<true|string[]>} In case the fonts are valid resolves with true,
 *                                   otherwise rejects with error messages for failed
 *                                   fonts.
 */
export function areValidFonts(
  fonts: string[],
  validExtensions: string[]
): Promise<true | string[]> {
  const expression = /(?:\.([^.]+))?$/;
  const errors = [];
  if (fonts.length === 0) {
    return Promise.reject(["No font's are preloaded in the output."]);
  }
  for (let i = 0; i < fonts.length; i += 1) {
    const font = fonts[i];
    const tokens = expression.exec(font);
    const isValid = tokens && tokens[1] && validExtensions.includes(tokens[1]);
    if (!isValid) {
      errors.push(`"${font}" is not valid as per the provided extensions`);
    }
  }
  return errors.length === 0 ? Promise.resolve(true) : Promise.reject(errors);
}

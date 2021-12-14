import fs from "fs";
import path from "path";
import webpack from "webpack";
import { JSDOM } from "jsdom";
import WebpackFontPreloadPlugin from "../../src/index";
import { DEFAULT_WEBPACK_CONFIG, WP_OUTPUT_DIR } from "../constants/Constants";

/**
 * Provides the ability to run `webpack` function by passing the webpack configuration
 * and the `WebpackFontPreloadPlugin` options.
 * @param {object} webpackConfigurationOverrides Any overrides for the default webpack
 *                                               configuration.
 * @param {object} pluginOptions WebpackFontPreloadPlugin options.
 * @param {string} indexFileName Name of the index html file.
 * @returns {Promise} Promise which resolves if the webpack is able to do the processing
 *                    else rejects with an error.
 */
export function run(
  webpackConfigurationOverrides,
  pluginOptions,
  indexFileName = "index.html"
) {
  const finalWpConfig = {
    ...DEFAULT_WEBPACK_CONFIG,
    ...webpackConfigurationOverrides,
  };
  finalWpConfig.plugins.push(new WebpackFontPreloadPlugin(pluginOptions));
  return new Promise((resolve, reject) => {
    webpack(finalWpConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err || stats);
        return;
      }

      const { assets } = stats.compilation;
      const assetNames = assets && (Object.keys(assets) || []);
      try {
        const htmlContent = fs
          .readFileSync(path.join(WP_OUTPUT_DIR, indexFileName))
          .toString();
        const parsed = new JSDOM(htmlContent);
        const { document } = parsed && parsed.window;
        resolve({
          index: htmlContent,
          indexDocument: document,
          assets: assetNames,
        });
      } catch (fileReadError) {
        reject(fileReadError);
      }
    });
  });
}

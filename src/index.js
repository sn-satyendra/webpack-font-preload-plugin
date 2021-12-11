// @ts-check
// Import types
/** @typedef {import("./index.d").Options} WebpackFontPreloadPluginOptions */
/** @typedef {import('webpack').Compiler} WebpackCompiler */
/** @typedef {import('webpack').Compilation} WebpackCompilation */
/** @typedef {import('jsdom').DOMWindow} Document */

const RawSource = require("webpack-sources/lib/RawSource");
const JsDom = require("jsdom");

class WebpackFontPreloadPlugin {
  /**
   * @param {WebpackFontPreloadPluginOptions} options
   */
  constructor(options) {
    const defaults = {
      // Name of the index file which needs modification
      index: "index.html",

      // Default font extensions which should be used
      extensions: ["woff", "ttf", "eot"],

      // Is the font request crossorigin
      crossorigin: true,

      // Type of load. It can be either "preload" or "prefetch"
      loadType: "preload",

      // String representing the selector of tag before which the <link>
      // tags would be inserted.
      insertBefore: "head > title",

      // Callback for doing custom manipulations to index.html for special use cases
      // like templating or server side rendering.
      // This callback would be passed an `object` as parameter with 2 keys:
      //  - `indexSource`: Full source string of the index.html.
      //  - `linksAsString`: `<link>` tags for preloading fonts as a string.
      // The consuming app can use this information to generate the final index.html
      // and must return an updated string which would be used as index.html after
      // webpack build.
      replaceCallback: undefined,
    };
    /** @type {WebpackFontPreloadPluginOptions} */
    this.options = { ...defaults, ...options };
  }

  /**
   * This method is called once by the webpack compiler while installing the plugin.
   * @param {WebpackCompiler} compiler
   */
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      this.constructor.name,
      (compilation, callback) => this.addFonts(compilation, callback)
    );
  }

  /**
   * Process the generated assets to add new <link> tags in the
   * generated html.
   *
   * @param {WebpackCompilation} compilation Compilation object from webpack hook
   * @param {(err?: Error) => void} callback Callback to be invoked after processing
   *
   */
  addFonts(compilation, callback) {
    try {
      if (this.options.index) {
        const { assets, outputOptions } = compilation;
        const assetNames = assets && (Object.keys(assets) || []);
        const index = assets[this.options.index];
        const indexSource = index && index.source();
        const publicPath = outputOptions && outputOptions.publicPath;
        if (indexSource && publicPath) {
          let strLink = "";
          assetNames.forEach((asset) => {
            if (this.isFontAsset(asset)) {
              strLink += this.getLinkTag(asset, publicPath.toString());
            }
          });
          // If `replaceCallback` is specified then app is responsible to forming the updated
          // index.html by using the generated link string.
          if (this.options.replaceCallback) {
            assets[this.options.index] = new RawSource(
              this.options.replaceCallback({
                indexSource: indexSource.toString(),
                linksAsString: strLink,
              })
            );
          } else {
            assets[this.options.index] = new RawSource(
              this.appendLinks(indexSource.toString(), strLink)
            );
          }
        }
      }
    } catch (error) {
      return callback(error);
    }
    return callback();
  }

  /**
   * Parse the passed html string and add <link> tags.
   *
   * @param {string} html Source html string
   * @param {string} links String representation of all links
   * @returns {string} Modified html as string
   *
   */
  appendLinks(html, links) {
    const { JSDOM } = JsDom;
    const parsed = new JSDOM(html);
    const { document } = parsed && parsed.window;
    const head = document && document.getElementsByTagName("head")[0];
    const insertBeforeTag =
      document && document.querySelector(this.options.insertBefore);
    if (head) {
      if (!insertBeforeTag) {
        // The `insertBeforeTag` is not present. Prepend to head itself.
        head.innerHTML = `${links}${head.innerHTML.trim()}`;
      } else {
        const parent = insertBeforeTag.parentNode;
        const newNodes = Array.from(this.createNodeFromHtml(document, links));
        if (newNodes && newNodes.length > 0) {
          newNodes.forEach((n) => {
            parent.insertBefore(n, insertBeforeTag);
          });
        }
      }
      return parsed.serialize();
    }
    return html;
  }

  /**
   * Get the extension from name of the asset.
   *
   * @param {string} name Name of asset
   * @returns {string|null} Extension of asset
   *
   */
  getExtension(name) {
    const re = /(?:\.([^.]+))?$/;
    const results = re.exec(name);
    return results && results[1];
  }

  /**
   * Get the string representation of a <link> tag for provided name
   * and public path.
   *
   * @param {string} name Name of the font asset
   * @param {string} publicPath Public path from webpack configuration
   * @returns {string} String representaion of link
   *
   */
  getLinkTag(name, publicPath) {
    const { crossorigin, loadType } = this.options;
    return `<link
      rel="${loadType}"
      href="${publicPath}${name}"
      as="font"
      ${crossorigin ? "crossorigin" : ""}
    >`;
  }

  /**
   * Check if the specified asset is a font asset.
   *
   * @param {string} name Name of the asset
   * @returns {Boolean} Returns true if font asset
   */
  isFontAsset(name) {
    const { extensions } = this.options;
    const extension = this.getExtension(name);
    if (extension && extensions) {
      return extensions.includes(extension);
    }
    return false;
  }

  /**
   * Generate nodes/element from the Html string
   * @param {Document} document Document object from jsdom
   * @param {string} strHtml String representing the html
   * @returns {Array} Array of html nodes
   */
  createNodeFromHtml(document, strHtml) {
    const container = document.createElement("div");
    container.innerHTML = strHtml.trim();
    return container.childNodes;
  }
}

module.exports = WebpackFontPreloadPlugin;

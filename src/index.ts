// @ts-check
// Import types
/** @typedef {import("./index.d").Options} WebpackFontPreloadPluginOptions */
/** @typedef {import('webpack').Compiler} WebpackCompiler */
/** @typedef {import('webpack').Compilation} WebpackCompilation */
/** @typedef {import('jsdom').DOMWindow} Document */

import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { Compiler, Compilation } from "webpack";

type FunctionCb = (err?: Error) => void;

interface replaceCallbackOptions {
  /**
   * Full source string of the index.html
   */
  indexSource: string;

  /**
   * `<link>` tags for preloading fonts as a string
   */
  linksAsString: string;
}

enum LoadType {
  PRELOAD = "preload",
  PREFETCH = "prefetch"
}

interface Options {
  /**
   * Name of the index file which needs modification.
   *
   * Defaults to "index.html".
   */
  index?: string;

  /**
   * Default font extensions which should be used.
   *
   * Defaults to ["woff", "woff2", "ttf", "eot"].
   */
  extensions?: string[];

  /**
   * Is the font request crossorigin or not.
   *
   * Defaults to true.
   */
  crossorigin?: boolean;

  /**
   * Type of load. It can be either "preload" or "prefetch".
   *
   * Defaults to "preload".
   */
  loadType?: LoadType

  /**
   * String representing the selector of tag before which the <link>
   * tags would be inserted.
   *
   * Defaults to "head > title".
   */
  insertBefore?: string;

  /**
   * Callback for doing custom manipulations to index.html for special use cases
   * like templating or server side rendering.
   * This callback would be passed an `object` as parameter with 2 keys:
   *   - `indexSource`: Full source string of the index.html.
   *   - `linksAsString`: `<link>` tags for preloading fonts as a string.
   * The consuming app can use this information to generate the final index.html
   * and must return an updated string which would be used as index.html after
   * webpack build.
   *
   * Defaults to undefined.
   */
  replaceCallback?: ({
    indexSource,
    linksAsString,
  }: replaceCallbackOptions) => string;

  /**
   * Expression for allowing more granular filtering of the font assets for doing
   * a preload/prefetch. The filter is applied on the font assets selected by the
   * `extensions` option. If the filter is a string, all the font assets which contain
   * the string as part of the name are included in the preload and rest are ignored.
   * In case filter is regex, the font asset's name is tested to match the regex for
   * allowing preload.
   * If you don't pass this option, all the font assets will be preloaded.
   *
   * Defaults to undefined.
   */
  filter?: string | RegExp;
}

interface WebpackFontPreloadPlugin {
  options: Options
}

class WebpackFontPreloadPlugin {
  /**
   * @param {WebpackFontPreloadPluginOptions} options
   */
  constructor(options: Options) {
    const defaults = {
      index: "index.html",
      extensions: ["woff", "woff2", "ttf", "eot"],
      crossorigin: true,
      loadType: LoadType.PRELOAD,
      insertBefore: "head > title",
      replaceCallback: undefined,
      filter: undefined,
    };
    this.options = { ...defaults, ...options };
  }

  /**
   * This method is called once by the webpack compiler while installing the plugin.
   * @param {WebpackCompiler} compiler
   */
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapAsync(
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
  addFonts(compilation: Compilation, callback: FunctionCb) {
    try {
      if (this.options.index) {
        const { outputOptions } = compilation;
        const stats = compilation.getStats().toJson();
        const { outputPath, assets = [] } = stats;
        const index =
          assets && assets.find((asset) => asset.name === this.options.index);
        const indexSource =
          index &&
          outputPath &&
          fs.readFileSync(path.join(outputPath, index.name)).toString();
        const publicPath = (outputOptions && outputOptions.publicPath) || "";
        if (indexSource) {
          let strLink = "";
          assets.forEach((asset) => {
            if (this.isFontAsset(asset.name) && this.isFiltered(asset.name)) {
              strLink += this.getLinkTag(asset.name, publicPath.toString());
            }
          });
          // If `replaceCallback` is specified then app is responsible to forming the updated
          // index.html by using the generated link string.
          if (this.options.replaceCallback) {
            fs.writeFileSync(
              path.join(outputPath, index.name),
              this.options.replaceCallback({
                indexSource: indexSource.toString(),
                linksAsString: strLink,
              })
            );
          } else {
            fs.writeFileSync(
              path.join(outputPath, index.name),
              this.appendLinks(indexSource.toString(), strLink)
            );
          }
        }
      }
    } catch (error) {
      // @ts-ignore
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
  appendLinks(html: string, links: string): string {
    const parsed = new JSDOM(html);
    const { document } = parsed && parsed.window;
    const head = document && document.getElementsByTagName("head")[0];
    const insertBeforeTag =
      document && document.querySelector(this.options.insertBefore as string);
    if (head) {
      if (!insertBeforeTag) {
        // The `insertBeforeTag` is not present. Prepend to head itself.
        head.innerHTML = `${links}${head.innerHTML.trim()}`;
      } else {
        const parent = insertBeforeTag.parentNode;
        const newNodes = Array.from(this.createNodeFromHtml(document, links));
        if (newNodes && newNodes.length > 0 && parent) {
          newNodes.forEach((n) => {
            parent.insertBefore(n as Node, insertBeforeTag);
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
  getExtension(name: string): string | null {
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
  getLinkTag(name: string, publicPath: string): string {
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
   * @returns {boolean} Returns true if font asset
   */
  isFontAsset(name: string): boolean {
    const { extensions } = this.options;
    const extension = this.getExtension(name);
    if (extension && extensions) {
      return extensions.includes(extension);
    }
    return false;
  }

  /**
   * Check if the asset should be preloaded based on the `filter` option.
   * @param {string} name Name of the asset
   * @returns {boolean} true if the asset is allowed to be preloaded
   */
  isFiltered(name: string): boolean {
    const { filter } = this.options;
    if (filter) {
      if (filter instanceof RegExp) {
        // Check that the asset name matches the filter regex.
        return filter.test(name);
      }
      // Check if the asset name contains the specified filter string.
      return name.includes(filter);
    }
    // If the filter is not defined, allow all the assets to preload.
    return true;
  }

  /**
   * Generate nodes/element from the Html string
   * @param {Document} document Document object from jsdom
   * @param {string} strHtml String representing the html
   * @returns {Array} Array of html nodes
   */
  createNodeFromHtml(document: Document, strHtml: string): any {
    const container = document.createElement("div");
    container.innerHTML = strHtml.trim();
    return container.childNodes;
  }
}

module.exports = WebpackFontPreloadPlugin;

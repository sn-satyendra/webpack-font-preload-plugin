import { Compiler } from "webpack";

declare class WebpackFontPreloadPlugin {
  constructor(options?: WebpackFontPreloadPlugin.Options);

  /**
   * Webpack font preload plugin options to modify the default configuration.
   */
  options?: WebpackFontPreloadPlugin.Options;

  /**
   * This method is called once by the webpack compiler while installing the plugin.
   */
  apply(compiler: Compiler): void;
}

declare namespace WebpackFontPreloadPlugin {
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
  interface Options {
    /**
     * Name of the index file which needs modification.
     */
    index?: string;

    /**
     * Default font extensions which should be used.
     */
    extensions?: string[];

    /**
     * Is the font request crossorigin or not.
     */
    crossorigin?: boolean;

    /**
     * Type of load. It can be either "preload" or "prefetch".
     */
    loadType?: "preload" | "prefetch";

    /**
     * String representing the selector of tag before which the <link>
     * tags would be inserted.
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
     */
    filter?: string | RegExp;
  }
}

export = WebpackFontPreloadPlugin;

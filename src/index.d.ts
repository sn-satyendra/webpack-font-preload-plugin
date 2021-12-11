declare class WebpackFontPreloadPlugin {
  constructor(options?: WebpackFontPreloadPlugin.Options);

  /**
   * Webpack font preload plugin options to modify the default configuration.
   */
  options?: WebpackFontPreloadPlugin.Options;
}

declare namespace WebpackFontPreloadPlugin {
  interface replaceCallbackOptions {
    indexSource: string;
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
      /**
       * Full source string of the index.html
       */
      indexSource,

      /**
       * `<link>` tags for preloading fonts as a string
       */
      linksAsString,
    }: replaceCallbackOptions) => void;
  }
}

export = WebpackFontPreloadPlugin;

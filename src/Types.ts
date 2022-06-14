/**
 * Type for inner callbacks in the webpack plugin.
 */
export type Callback = (err?: Error) => void;

/**
 * Options for the `replaceCallback` option of plugin.
 */
export interface ReplaceCallbackOptions {
  /**
   * Full source string of the index.html
   */
  indexSource: string;

  /**
   * `<link>` tags for preloading fonts as a string
   */
  linksAsString: string;
}

/**
 * Load types supported by plugin.
 */
export enum LoadType {
  PRELOAD = "preload",
  PREFETCH = "prefetch",
}

/**
 * Plugin options.
 */
export interface PluginOptions {
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
  loadType?: LoadType;

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
  }: ReplaceCallbackOptions) => string;

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

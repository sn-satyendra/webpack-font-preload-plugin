declare class WebpackFontPreloadPlugin {
  constructor(options?: WebpackFontPreloadPlugin.Options);
}

declare namespace WebpackFontPreloadPlugin {
  interface replaceCallbackOptions {
    indexSource: string;
    linksAsString: string;
  }
  interface Options {
    index?: string;
    extensions?: string[];
    crossorigin?: boolean;
    loadType?: "preload" | "prefetch" | string;
    insertBefore?: string;
    replaceCallback?: ({
      indexSource,
      linksAsString,
    }: replaceCallbackOptions) => void;
  }
}

export = WebpackFontPreloadPlugin;

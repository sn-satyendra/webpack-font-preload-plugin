declare class WebpackFontPreloadPlugin {
  constructor(options?: WebpackFontPreloadPlugin.Options);
}

declare namespace WebpackFontPreloadPlugin {
  interface Options {
    index?: string;
    extensions?: string[];
    crossorigin?: boolean;
    loadType?: "preload" | "prefetch";
    insertBefore?: string;
    replaceCallback?: (indexSource: string, linksAsString: string) => void;
  }
}

export = WebpackFontPreloadPlugin;

import webpack from "webpack";
import jsdom from "jsdom";

declare class WebpackFontPreloadPlugin {
  constructor(options?: WebpackFontPreloadPlugin.Options);
  apply(compiler: webpack.Compiler): void;
  addFonts(
    compilation: webpack.WebpackCompilation,
    callback: (err?: Error) => void
  ): void;
  appendLinks(html: string, links: string): string;
  getExtension(name: string): string;
  getLinkTag(name: string, publicPath: string): string;
  isFontAsset(name: string): string;
  createNodeFromHtml(document: jsdom.DOMWindow, strHtml: string): any[];
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

const RawSource = require('webpack-sources/lib/RawSource');
const JsDom = require("jsdom");

class FontPreloadPlugin {

  constructor(options) {
    const defaults = {
      // Name of the index file which needs modification
      indexFile: 'index.html',

      // Default font extensions which should be used
      extensions: ['woff', 'ttf', 'eot'],

      // Is the font request crossorigin
      crossorigin: true,

      // Type of load. It can be either "preload" or "prefetch"
      loadType: 'preload'
    };
    this.options = Object.assign({}, defaults, options);
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(this.constructor.name, (compilation, callback) => {
      callback(null, this.addFonts(compilation, callback));
    });
  }

  addFonts(compilation, callback) {
    try {
      const { assets, outputOptions } = compilation;
      const assetNames = assets && (Object.keys(assets) || []);
      const index = assets[this.options.indexFile];
      const indexSource = index && index.source();
      const publicPath = outputOptions && outputOptions.publicPath;
      if (indexSource) {
        let strLink = '';
        assetNames.forEach(asset => {
          if (this.isFontAsset(asset)) {
            strLink += this.getLinkTag(asset, publicPath);
          }
        });
        assets[this.options.indexFile] = new RawSource(this.appendLinks(indexSource, strLink));
      }
    } catch (error) {
      callback(error);
    }
  }

  appendLinks(html, links) {
    const { JSDOM } = JsDom;
    const parsed = new JSDOM(html);
    const { document } = parsed && parsed.window;
    const head = document && document.getElementsByTagName('head')[0];
    if (head) {
      head.innerHTML = `${links}${head.innerHTML.trim()}`;
      return parsed.serialize();
    }
  }

  getExtension(name) {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(name)[1];
  }

  getLinkTag(name, publicPath) {
    const { crossorigin, loadType } = this.options;
    return `<link
      rel="${loadType}"
      href="${publicPath}${name}"
      as="font"
      ${crossorigin ? 'crossorigin' : ''}
    >`;
  }

  isFontAsset(name) {
    return this.options.extensions.includes(
      this.getExtension(name)
    );
  }

}

module.exports = FontPreloadPlugin;


const RawSource = require('webpack-sources/lib/RawSource');
const JsDom = require("jsdom");

class WebpackFontPreloadPlugin {

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
      return this.addFonts(compilation, callback);
    });
  }

  /**
   * Process the generated assets to add new <link> tags in the
   * generated html.
   * 
   * @param {Object} compilation Compilation object from webpack hook
   * @param {Function} callback Callback to be invoked after processing
   * 
   */
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
        return callback();
      }
    } catch (error) {
      return callback(error);
    }
  }

  /**
   * Parse the passed html string and add <link> tags.
   * 
   * @param {String} html Source html string
   * @param {String} links String representation of all links
   * @returns {String} Modified html as string
   *
   */
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

  /**
   * Get the extension from name of the asset.
   * 
   * @param {String} name Name of asset
   * @returns {String} Extension of asset
   * 
   */
  getExtension(name) {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(name)[1];
  }

  /**
   * Get the string representation of a <link> tag for provided name
   * and public path.
   * 
   * @param {String} name Name of the font asset
   * @param {String} publicPath Public path from webpack configuration
   * @returns {String} String representaion of link
   * 
   */
  getLinkTag(name, publicPath) {
    const { crossorigin, loadType } = this.options;
    return `<link
      rel="${loadType}"
      href="${publicPath}${name}"
      as="font"
      ${crossorigin ? 'crossorigin' : ''}
    >`;
  }

  /**
   * Check if the specified asset is a font asset.
   * 
   * @param {String} name Name of the asset
   * @returns {Boolean} Returns true if font asset
   */
  isFontAsset(name) {
    return this.options.extensions.includes(
      this.getExtension(name)
    );
  }

}

module.exports = WebpackFontPreloadPlugin;


[![npm][npm]][npm-url]

# webpack-font-preload-plugin
A webpack plugin to allow preloading or prefetching of fonts.

## Introduction
The [preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) value of the `<link>` element's `rel` attribute lets you declare fetch requests in the HTML's `<head>`, specifying resources that your page will need very soon, which you want to start loading early in the page lifecycle, before browsers' main rendering machinery kicks in. This ensures they are available earlier and are less likely to block the page's render, improving performance.

This plugin specifically targets fonts used with the application which are bundled using webpack. The plugin would add `<link>` tags in the begining of `<head>` of your html:
```html
<link rel="preload" href="/font1.woff" as="font" crossorigin="">
<link rel="preload" href="/font2.woff" as="font" crossorigin="">
```

## Getting Started

To begin, you'll need to install `webpack-font-preload-plugin`:

```console
$ npm install webpack-font-preload-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const FontPreloadPlugin = require('webpack-font-preload-plugin');

module.exports = {
  plugins: [new FontPreloadPlugin()],
};
```

And run `webpack` via your preferred method.

## Options

### `indexFile`

Type: `String`
Default: `index.html`

Name of the index file which needs modification.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  indexFile: 'index.html',
});
```

### `extensions`

Type: `Array`
Default: `['woff', 'ttf', 'eot']`

Default font extensions which should be used.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  extensions: ['woff', 'ttf', 'eot'],
});
```

### `crossorigin`

Type: `Boolean`
Default: `true`

Is the font request crossorigin or not.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  crossorigin: true,
});
```

### `loadType`

Type: `String`
Default: `preload`

Type of load. It can be either `preload` or `prefetch`.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  loadType: 'preload',
});
```

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/webpack-font-preload-plugin
[npm-url]: https://npmjs.com/package/webpack-font-preload-plugin
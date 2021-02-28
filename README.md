[![npm][npm]][npm-url]

# webpack-font-preload-plugin
A webpack plugin to allow preloading or prefetching of fonts.

## Introduction
The [preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) value of the `<link>` element's `rel` attribute lets you declare fetch requests in the HTML's `<head>`, specifying resources that your page will need very soon, which you want to start loading early in the page lifecycle, before browsers' main rendering machinery kicks in. This ensures they are available earlier and are less likely to block the page's render, improving performance.

This plugin specifically targets fonts used with the application which are bundled using webpack. The plugin would add `<link>` tags in the begining of `<head>` of your html:
```html
<link rel="preload" href="/font1.woff" as="font" crossorigin>
<link rel="preload" href="/font2.woff" as="font" crossorigin>
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

### `index`

Type: `String`
Default: `index.html`

Name of the index file which needs modification.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  index: 'index.html',
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

### `insertBefore`

Type: `String`
Default: `head > title`

The selector for node before which the preload/prefetch links should be added.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  // Add the preload statements before any other <link> tag present in html
  insertBefore: 'head > link:nth-child(1)',
});
```

### `replaceCallback`

Type: `Function`
Default: `undefined`

Callback for doing custom manipulations to index.html for special use cases like templating or server side rendering. This callback would be passed an `object` as parameter with 2 keys:
  - `indexSource`: Full source string of the index.html.
  - `linksAsString`: `<link>` tags for preloading fonts as a string.

The consuming app can use this information to generate the final index.html
and must return an updated string which would be used as index.html after
webpack build.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  replaceCallback: ({indexSource, linksAsString}) => {
    return indexSource.replace("{{{links}}}", linksAsString);
  },
});
```

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/webpack-font-preload-plugin
[npm-url]: https://npmjs.com/package/webpack-font-preload-plugin
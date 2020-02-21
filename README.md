# webpack-font-preload-plugin
A webpack plugin to allow preloading or prefetching of fonts.

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
const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "class-methods-use-this": OFF,
    "import/no-extraneous-dependencies": [ERROR, {"devDependencies": true}],
  },
};

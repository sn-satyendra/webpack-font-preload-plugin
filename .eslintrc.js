const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    expect: true,
    document: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "class-methods-use-this": OFF,
    "import/no-extraneous-dependencies": [ERROR, { devDependencies: true }],
    "import/no-relative-packages": OFF,
    "import/no-import-module-exports": OFF,
  },
  overrides: [
    {
      files: ["test/**/*"],
      rules: {
        "no-console": OFF,
        "global-require": OFF,
        "import/prefer-default-export": OFF,
        "prefer-promise-reject-errors": OFF,
      },
    },
  ],
};

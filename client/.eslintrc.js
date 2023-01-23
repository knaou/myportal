module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  extends: ["plugin:nuxt/recommended", "plugin:prettier/recommended"],
  // add your custom rules here
  rules: {
    "nuxt/no-cjs-in-config": "off",
  },
};

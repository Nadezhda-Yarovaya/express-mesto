module.exports = {
  env: {
    browser: true,
    es2021: true,
    amd: true,
    node: true,
  },
  extends: ["plugin:react/recommended", "airbnb-base"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-underscore-dangle": [1, { allow: ["_id"] }],
    quotes: "off",
    "consistent-return": "off",
    "comma-dangle": "off",
    "no-console": "off",
  },
  settings: {
    react: {
      version: "latest",
    },
  },
};

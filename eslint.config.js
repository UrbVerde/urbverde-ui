import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    rules: {
      "no-multiple-empty-lines": ["error", {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      }],
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
];

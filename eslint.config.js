import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'indent': ['error', 2],
      'eol-last': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'eqeqeq': ['error', 'always'],
      'no-unused-vars': ['error'],
      'no-console': ['warn'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-debugger': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'curly': ['error', 'all'],
      'no-duplicate-imports': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 2 }],
      'no-trailing-spaces': 'error',
      'padding-line-between-statements': [
        'error',
        { 'blankLine': 'always', 'prev': 'directive', 'next': '*' },
        { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
      ],
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['error', { 'singleline': 3, 'multiline': 1 }],
      'vue/singleline-html-element-content-newline': 'off',
      'no-multiple-empty-lines': [
        'error',
        {
          'max': 1,
          'maxEOF': 0,
          'maxBOF': 0,
        },
      ],
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
];

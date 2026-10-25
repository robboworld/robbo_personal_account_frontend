import neostandard, { plugins as neoPlugins } from 'neostandard'
import prettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import cypress from 'eslint-plugin-cypress'
import globals from 'globals'

// Formatting is Prettier's job: neostandard runs without its style rules and
// eslint-config-prettier switches off whatever still conflicts. The rules
// below re-enable the few style checks the project kept on top of that.
export default [
  ...neostandard({
    noStyle: true,
    env: ['browser', 'node'],
    ignores: ['dist/**', 'node_modules/**'],
  }),
  prettier,
  {
    files: ['**/*.{js,jsx,mjs}'],
    plugins: {
      '@stylistic': neoPlugins['@stylistic'],
      import: importPlugin,
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/max-len': [
        'warn',
        { code: 150, ignoreUrls: true, ignorePattern: 'import' },
      ],
      '@stylistic/operator-linebreak': [
        'warn',
        'after',
        { overrides: { '?': 'before', ':': 'before', '|>': 'before' } },
      ],
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      '@stylistic/spaced-comment': [
        'error',
        'always',
        {
          line: { markers: ['*package', '!', '/', ',', '='] },
          block: {
            balanced: true,
            markers: ['*package', '!', ',', ':', '::', 'flow-include'],
            exceptions: ['*'],
          },
        },
      ],
      '@stylistic/jsx-closing-tag-location': 'error',
      '@stylistic/jsx-max-props-per-line': [
        'error',
        { maximum: 2, when: 'always' },
      ],
      'unicode-bom': ['error', 'never'],

      // eslint-config-standard had these; neostandard dropped or softened them.
      'dot-notation': ['error', { allowKeywords: true }],
      'n/no-deprecated-api': 'error',

      'prefer-destructuring': 'error',
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          vars: 'all',
        },
      ],
      // Debug output leaked API responses (user lists, emails) to the browser console.
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name='localStorage'][arguments.0.value='token']",
          message:
            'The access token lives in memory: use getAccessToken / setAccessToken / clearAccessToken from @/helpers/accessTokenMemory.',
        },
      ],
      'prefer-const': [
        'error',
        { destructuring: 'any', ignoreReadBeforeAssign: false },
      ],

      // Import rules from eslint-config-standard plus the project's ordering.
      'import/export': 'error',
      'import/first': 'error',
      'import/no-absolute-path': [
        'error',
        { esmodule: true, commonjs: true, amd: false },
      ],
      'import/no-duplicates': 'error',
      'import/no-named-default': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always-and-inside-groups',
        },
      ],

      // React logic rules from eslint-config-standard-react (neostandard has none yet).
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: true,
          allowBind: false,
          ignoreRefs: true,
          allowFunctions: false,
          ignoreDOMComponents: false,
        },
      ],
      'react/no-did-update-set-state': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unused-prop-types': 'error',
      'react/react-in-jsx-scope': 'error',
      // Classic JSX runtime: JSX references React and the components it renders.
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
      'react/jsx-fragments': ['warn', 'element'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['src/index.js'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'react/jsx-filename-extension': 'off',
    },
  },
  {
    files: [
      'src/**/__tests__/**',
      'src/**/*.test.{js,jsx}',
      'src/__mocks__/**',
      'src/setupTests.js',
      'src/testUtils.jsx',
    ],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    files: ['src/helpers/accessTokenMemory.js', 'src/**/__tests__/**'],
    rules: {
      'no-restricted-syntax': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['cypress/**', 'cypress.config.js'],
    ...cypress.configs.globals,
  },
]

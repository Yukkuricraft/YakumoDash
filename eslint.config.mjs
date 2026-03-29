import pluginSecurity from 'eslint-plugin-security'
// @ts-check
import neostandard from 'neostandard'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  ...neostandard({
    ts: false,
    noJsx: true,
    noStyle: true,
  }),
  pluginSecurity.configs.recommended,
  {
    rules: {
      'security/detect-object-injection': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['playwright.config.ts', 'test/unit/*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/only-throw-error': 'error',
    },
  },
  {
    rules: {
      'vue/no-undef-components': ['error', { ignorePatterns: ['Nuxt[A-Z].*', 'ClientOnly', 'DevOnly'] }],
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-multiple-template-root': 'off',
      'no-redeclare': 'off',

      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: false,
        },
      ],
      'require-await': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
        },
      ],
    },
  },
)

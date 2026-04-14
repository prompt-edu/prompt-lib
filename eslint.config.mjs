import tsParser from '@typescript-eslint/parser'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules/**', // Ignore dependencies
      'dist/**',         // Ignore dist output
      'build/**',        // Ignore build output
      'src/components/ui/**', // Ignore UI components
      'src/components/minimal-tiptap/**', // Ignore vendored editor components
    ],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },

    settings: {
      react: {
        version: 'detect', // Automatically detect react version
      },
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: react,
      'react-hooks': reactHooks,
      prettier: prettier,
    },

    // Recommended configs can be merged manually if needed.
    // If you want to extend recommended rules, you could import those configurations
    // and spread their rules here.
    rules: {
      // Shadowing: Turn off the core no-shadow rule and enable the TS version
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/return-await': 'off',

      'max-len': [
        'warn',
        {
          code: 160,
          ignoreComments: true,
          ignoreUrls: true,
        },
      ],

      // React settings
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.jsx', '.tsx'],
        },
      ],

      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Prettier formatting
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
]

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import nextPlugin from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config} */
export default [
  // Base config for JS/TS files (including config files) - NO type-aware rules here
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['node_modules/', '.next/'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: pluginReactConfig.plugins.react,
      '@next/next': nextPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      // Apply only non-type-aware recommended rules initially
      ...tseslint.configs.recommended.rules, // Consider using recommended-requiring-type-checking below instead
      ...pluginReactConfig.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },

  // Specific config for SOURCE files (src/**) - ADD type-aware rules here
  {
    files: ['src/**/*.{ts,tsx}'], // Target only source files
    languageOptions: {
      parserOptions: {
        project: true, // Enable type-aware linting ONLY for source files
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Add rules that require type information here if needed
      // Example: ...tseslint.configs.recommended-requiring-type-checking.rules,
    },
  },

  // Prettier config must be last
  eslintConfigPrettier,
];

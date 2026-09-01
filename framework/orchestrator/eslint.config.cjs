const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    // bin/loop.cjs and this file are intentionally CommonJS: package.json
    // sets "type": "commonjs", and the shim has to require() tsx
    // synchronously before ESM/TS is available at all. Both use the .cjs
    // extension so TypeScript treats them as unambiguously CommonJS instead
    // of suggesting an ESM conversion (TS80001).
    files: ['eslint.config.cjs', 'bin/**/*.cjs'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);

// @ts-check
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    ignores: ['projects/**/*', 'dist/**/*', 'dist-demo/**/*', 'coverage/**/*', 'node_modules/**/*'],
  },
  {
    files: ['**/*.ts'],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'slate',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/no-output-on-prefix': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      // Angular 22 migration adds ChangeDetectionStrategy.Eager to preserve pre-v22 Default CD.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      // Keep parity with previous lint behavior during the Angular 22 upgrade.
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/use-lifecycle-interface': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  }
);

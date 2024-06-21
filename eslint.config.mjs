// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  ignores: ['.github/**/*', '.vscode/**']
})
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      // TODO: 一時的にOFF
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  })
  .override('nuxt/vue/rules', {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off'
    }
  });

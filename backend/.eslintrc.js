module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'space-before-function-paren': ['error', 'never']
  }
}

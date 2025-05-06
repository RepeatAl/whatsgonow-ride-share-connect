module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'react/prop-types': 'off',
    'no-console': 'warn',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'custom-rules'
  ],
  
  settings: {
    'custom-rules/dir': './scripts/eslint-rules'
  },
  
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'react/prop-types': 'off',
    'no-console': 'warn',
    'custom-rules/xrechnung-object-params': 'error'
  }
};

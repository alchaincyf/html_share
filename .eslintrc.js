module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-explicit-any': ['warn', {
      ignoreRestArgs: true,
      allowExplicitAny: false
    }]
  },
  overrides: [
    {
      files: ['lib/firebase-admin.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
} 
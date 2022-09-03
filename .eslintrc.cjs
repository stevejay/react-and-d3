module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    'html',
    'import',
    'unicorn',
    'jest',
    'testing-library',
    'jsx-a11y',
    'eslint-plugin-tsdoc',
    'simple-import-sort',
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
    'plugin:storybook/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'prettier'
  ],
  rules: {
    'no-restricted-globals': ['error', 'innerWidth', 'innerHeight'],
    'sort-imports': 'off',
    'import/order': 'off',
    'import/namespace': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. react related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put .. last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and . last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$']
        ]
      }
    ],
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true
        },
        // ignore ambient module declaration file names
        ignore: ['\\.d\\.ts$', 'XYChart\\.tsx$', 'SVG', 'DOM', 'XYChart', 'UI']
      }
    ],
    'testing-library/no-node-access': 0,
    'testing-library/render-result-naming-convention': 0,
    // Can't enable this until https://github.com/microsoft/tsdoc/issues/220 is fixed:
    'tsdoc/syntax': 0,
    'react/display-name': 'off', // forwardRef causing a problem here
    'react/prop-types': 'off', // forwardRef causing a problem here,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}'],
      rules: {
        'jest/unbound-method': 'error'
      }
    }
  ],
  settings: {
    react: {
      version: '17.0' // Would prefer this to be "detect"
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        // always try to resolve types under  directory even it doesn't contain any source code, like
        alwaysTryTypes: true
      }
    }
  }
};

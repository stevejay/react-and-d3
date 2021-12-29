module.exports = {
  // Add '--max-warnings 0' back to the eslint command below when it is possible
  // to do so. The problem is that if a file in the .eslintignore file is
  // included in the commit, eslint warns that it will ignore the file. This makes
  // it impossible to update the eslint command to fail if there are any warnings.
  // See https://github.com/eslint/eslint/issues/15010
  '*.{js,cjs,mjs,ts,tsx}': 'yarn eslint --cache --fix',
  // tsc-files might cause issues with its use of an empty includes array:
  // https://github.com/gustavopch/tsc-files/issues/20
  // There is a workaround here if this affects you:
  // https://github.com/gustavopch/tsc-files/issues/20#issuecomment-996124875
  '**/*.{ts,tsx}': 'tsc-files --noEmit src/types/use-debounced-effect.d.ts',
  '*.css': 'yarn stylelint --cache',
  '**/*': 'yarn pretty-quick --staged',
  '*.md': 'yarn markdownlint --config ./.markdownlint.json',
  Dockerfile: 'yarn dockerfilelint'
};

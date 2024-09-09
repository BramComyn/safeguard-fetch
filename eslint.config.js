const opinionated = require('opinionated-eslint-config');

module.exports = opinionated({
  typescript: {
    tsconfigPath: [ './tsconfig.json', './scripts/tsconfig.json', './test/tsconfig.json' ],
  },
  ignores: [
    '**/*.md',
  ],
}).append({
  rules: {
    'no-console': 'off',
    'ts/naming-convention': 'off',
  },
});

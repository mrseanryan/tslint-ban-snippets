# tslint-ban-snippets readme

A custom tslint rule to ban configurable lists of code snippets.

examples: "return void reject", "it.only", "debugger".

## status: !IN DEVELOPMENT!

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

[![Greenkeeper badge](https://badges.greenkeeper.io/mrseanryan/tslint-ban-snippets.svg)](https://greenkeeper.io/)
[![Dev Dependencies](https://david-dm.org/mrseanryan/tslint-ban-snippets/dev-status.svg)](https://david-dm.org/mrseanryan/tslint-ban-snippets?type=dev)

[![Travis](https://img.shields.io/travis/mrseanryan/tslint-ban-snippets.svg)](https://travis-ci.org/mrseanryan/tslint-ban-snippets)
[![Coveralls](https://img.shields.io/coveralls/mrseanryan/tslint-ban-snippets.svg)](https://coveralls.io/github/mrseanryan/tslint-ban-snippets)


[![npm Package](https://img.shields.io/npm/v/tslint-ban-snippets.svg?style=flat-square)](https://www.npmjs.org/package/tslint-ban-snippets)
[![NPM Downloads](https://img.shields.io/npm/dm/tslint-ban-snippets.svg)](https://npmjs.org/package/tslint-ban-snippets)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/mrseanryan)

## dependencies

```
npm install -g semantic-release-cli
```

## developing code in *this* repo

This project uses `semantic release`, so when committing its best to use this script:

`./commit.sh`

To release, simply push to github. This will automatically run builds, generate release notes on github, and release to npm!

`git push`

## origin

This project is based on the excellent seeder project [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)

The project was started to avoid having to repeatedly fix similar coding issues in large TypeScript code bases.

### ORIGINAL readme

[see here](./readme.original.md)

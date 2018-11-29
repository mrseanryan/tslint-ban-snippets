# tslint-ban-snippets readme

A custom tslint rule to ban configurable lists of code snippets.

examples: "return void reject", "it.only", "debugger".

## status - stable

tslint-ban-snippets is stable and in use every day in CI builds and on dev boxes (Linux, Mac, Windows) for at least one major product.

[![Travis](https://img.shields.io/travis/mrseanryan/tslint-ban-snippets.svg)](https://travis-ci.org/mrseanryan/tslint-ban-snippets)
[![Coveralls](https://img.shields.io/coveralls/mrseanryan/tslint-ban-snippets.svg)](https://coveralls.io/github/mrseanryan/tslint-ban-snippets)

[![Greenkeeper badge](https://badges.greenkeeper.io/mrseanryan/tslint-ban-snippets.svg)](https://greenkeeper.io/)
[![Dev Dependencies](https://david-dm.org/mrseanryan/tslint-ban-snippets/dev-status.svg)](https://david-dm.org/mrseanryan/tslint-ban-snippets?type=dev)

[![npm Package](https://img.shields.io/npm/v/tslint-ban-snippets.svg?style=flat-square)](https://www.npmjs.org/package/tslint-ban-snippets)
[![NPM Downloads](https://img.shields.io/npm/dm/tslint-ban-snippets.svg)](https://npmjs.org/package/tslint-ban-snippets)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/mrseanryan)

## dependencies

No special dependencies - just `TypeScript` and of course `tslint`.

## custom tslint rule

The custom rule `tsl-ban-snippets` can be configured with small snippets of code that should NOT be used by developers.

If tslint finds the snippets of code, it will raise an error for that line of code.

In this way, a code base can be kept clean of unwanted coding practices.

### note: the rule name

The rule name is `tsl-ban-snippets` to avoid using the prefix `tslint-` which was found to be problematic when other `tslint` libraries are in use.

### note: comparison to the standard `ban` rule

There is standard tslint rule named `ban`. However its scope is quite limited - the `tsl-ban-snippets` rule applies to any statement in a TypeScript file, and so can be configured to detect most unwanted code snippets.

## usage

### 1 Install via npm (or yarn) into your TypeScript project

```
npm install tslint-ban-snippets
```

### 2 Configure tslint to pick up the custom rule

Edit your `tslint.json` to have an entry `"rulesDirectory"` that points to tslint-ban-snippets.

Normally this would be like:

```json
{
    "rulesDirectory": "node_modules/tslint-ban-snippets/dist/lib",
    "rules": {
        // tslint rules here...
    }
}
```

### 3 Configure the custom rule `tsl-ban-snippets`

Now you can configure the custom rule, to ban whatever code snippets you do NOT want developers to use.

#### examples

Example of how to ban the use of "return void":

```json
    "rules": {
        // other rules here...
        "tsl-ban-snippets": [
            true,
            {
                "banned": [
                    {
                        "snippets": ["return void"]
                    }
                ]
            }
        ]
    }
```

Here is another example, with more options:

```json
    "rules": {
        // other rules here...
        "tsl-ban-snippets": [
            true,
            {
                "banned": [
                    {
                        "snippets": ["return void"],
                        "message": "Please do not return void - instead place the return statement on the following line.",
                        "includePaths": [".ts", ".tsx"],
                        "excludePaths": ["itest"]
                    }
                ]
            }
        ]
    }
```

For more examples of how to configure, please see [tslint.json](https://github.com/mrseanryan/tslint-ban-snippets/blob/master/tslint.tslint-ban-snippets.json).

For working examples, please see the [unit tests](https://github.com/mrseanryan/tslint-ban-snippets/blob/master/test/rules).

## sites

| site                 | URL                                               |
| -------------------- | ------------------------------------------------- |
| source code (github) | https://github.com/mrseanryan/tslint-ban-snippets |
| github page          | https://mrseanryan.github.io/tslint-ban-snippets/ |
| npm                  | https://www.npmjs.com/package/tslint-ban-snippets |

## developing code in _this_ repository

see the [contributing readme](CONTRIBUTING.md).

## origin

This project is based on the excellent seeder project [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).

The project was started to avoid having to repeatedly fix similar coding issues in large TypeScript code bases.

### ORIGINAL readme (from the seeder project)

[see here](https://github.com/mrseanryan/tslint-ban-snippets/blob/master/readme.original.md)

## authors

Original work by Sean Ryan - mr.sean.ryan(at gmail.com)

## licence = MIT

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mrseanryan/tslint-ban-snippets/blob/master/LICENSE) file for details

# tslint-ban-snippets readme

A custom tslint rule to ban configurable lists of code snippets.

examples: "return void reject", "it.only", "debugger".

## status: !IN DEVELOPMENT!

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

```
npm install -g semantic-release-cli
```

## custom tslint rule

The custom rule `tsl-ban-snippets` can be configured with small snippets of code that should NOT be used by developers.

If tslint finds the snippets of code, it will raise an error for that line of code.

### examples

First you need to add `tslint-ban-snippets` to the `rulesDirectory` property in `tslint.json`:

```json
{
    "rulesDirectory": "node_modules/tslint-ban-snippets/dist/lib",
    "rules": {
        // tslint rules here...
    }
}
```

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

## developing code in _this_ repo

Any pushes to `master` will try to publish to npm (if travis build succeeds).
So it's best to first develop on a feature branch - named like `feature/my-feature`, and then when it has a green build, merge it master.

This project uses `semantic release`, so when committing its best to use this script:

`./commit.sh`

### merging to master

merging a feature branch into master: (after the bulid is green!)

```
git checkout master
git fetch
git pull
git merge feature/my-feature
git push
```

### releasing (from master branch)
To release, simply push to github. This will automatically run builds, generate release notes on github, and release to npm!

`git push`

## origin

This project is based on the excellent seeder project [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)

The project was started to avoid having to repeatedly fix similar coding issues in large TypeScript code bases.

### ORIGINAL readme

[see here](https://github.com/mrseanryan/tslint-ban-snippets/blob/master/readme.original.md)

## authors

Original work by Sean Ryan - mr.sean.ryan(at gmail.com)

## licence = MIT

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mrseanryan/tslint-ban-snippets/blob/master/LICENSE) file for details

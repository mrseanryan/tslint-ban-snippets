import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { IOptions } from 'tslint';
import { consoleTestResultHandler, runTest } from 'tslint/lib/test';
import { LintError } from 'tslint/lib/verify/lintError';
import * as parse from 'tslint/lib/verify/parse';

import { BAN_SNIPPETS_RULE_ID } from '../src/ruleIds';
import { Rule as BanSnippetsRule } from '../src/tslint-ban-snippets';
import { getSourceFileFromPath } from './rules/testUtils/tslint-palantir/utils';

class ConsoleLogger {
    log(m: any) {
        console.log(m);
    }

    error(m: any) {
        console.error(m);
    }
}

const MARKUP_FILE_EXTENSION = '.lint';

describe('tslint-ban-snippets test', () => {
    it('works if true is truthy', () => {
        expect(true).toBeTruthy();
    });

    const testDirectories = glob.sync('test/rules/**/tslint.json').map(path.dirname);

    describe('standard tslint test runner (NO code coverage!)', () => {
        for (const testDirectory of testDirectories) {
            it(`should run tests at ${testDirectory}`, () => {
                const result = runTest(testDirectory);

                const isOk = consoleTestResultHandler(result, new ConsoleLogger());

                expect(isOk).toBeTruthy();
            });
        }
    });

    describe('custom tslint test runner (WITH code coverage, but cruder assertions)', () => {
        for (const testDirectory of testDirectories) {
            describe(`tests at ${testDirectory}`, () => {
                const filesToLint = glob.sync(
                    path.join(testDirectory, `**/*${MARKUP_FILE_EXTENSION}`)
                );

                for (const fileToLint of filesToLint) {
                    it(`should run custom rule code on file ${fileToLint}`, () => {
                        const tsLintConfig = readTslintConfigFromDirectory(testDirectory);

                        const optionsForRule = getOptionsForRule(
                            BAN_SNIPPETS_RULE_ID,
                            tsLintConfig
                        );

                        const rule = new BanSnippetsRule(optionsForRule);
                        expect(rule).toBeTruthy();

                        const sourceFile = getSourceFileFromPath(fileToLint);

                        const ruleFailures = rule.apply(sourceFile);

                        // perform a crude check - the tslint test runner already performs detailed checks
                        const errorsFromMarkup = parse.parseErrorsFromMarkup(sourceFile.text);

                        if (
                            testDirectory.indexOf('basic-tests') >= 0 &&
                            fileToLint.indexOf('invalid-test.ts.lint') >= 0
                        ) {
                            // 'debug statement' and 'call expression' can double up:
                            expect(ruleFailures.length).toBe(errorsFromMarkup.length + 2);
                        } else {
                            expect(ruleFailures.length).toBe(errorsFromMarkup.length);
                        }
                    });
                }
            });
        }
    });
});

function readTslintConfigFromDirectory(testDirectory: string): any {
    const pathToOptions = path.join(testDirectory, 'tslint.json');

    const text = fs.readFileSync(pathToOptions, 'utf8');

    return JSON.parse(text);
}

function getOptionsForRule(ruleId: string, tslintConfig: any): IOptions {
    const ruleArgs = tslintConfig.rules[ruleId];

    // drop the first arg - this is what tslint does normally
    const ruleArgsTrimmed = [ruleArgs[1]];

    return {
        disabledIntervals: [],
        ruleArguments: ruleArgsTrimmed,
        ruleName: ruleId,
        ruleSeverity: 'error'
    };
}

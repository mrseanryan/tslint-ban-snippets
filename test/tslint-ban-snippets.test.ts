import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { IOptions } from 'tslint';
import { consoleTestResultHandler, runTest } from 'tslint/lib/test';

import { BAN_SNIPPETS_RULE_ID, Rule as BanSnippetsRule } from '../src/tslBanSnippetsRule';
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

    for (const testDirectory of testDirectories) {
        it(`should run tests at ${testDirectory} using tslint test runner (NO code coverage!)`, () => {
            const result = runTest(testDirectory);

            const isOk = consoleTestResultHandler(result, new ConsoleLogger());

            expect(isOk).toBeTruthy();
        });
    }

    for (const testDirectory of testDirectories) {
        const filesToLint = glob.sync(path.join(testDirectory, `**/*${MARKUP_FILE_EXTENSION}`));

        for (const fileToLint of filesToLint) {
            it('should run custom rule code using custom test runner WITH code coverage', () => {
                const tsLintConfig = readTslintConfigFromDirectory(testDirectory);

                const optionsForRule = getOptionsForRule(BAN_SNIPPETS_RULE_ID, tsLintConfig);

                const rule = new BanSnippetsRule(optionsForRule);
                expect(rule).toBeTruthy();

                const sourceFile = getSourceFileFromPath(fileToLint);

                // const ruleFailures =
                rule.apply(sourceFile);

                // TODO xxx
                // const expectedRuleFailures = 0;

                // expect(ruleFailures.length).toBe(expectedRuleFailures);
            });
        }
    }
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

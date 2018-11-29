// TODO xxx kill this file
// Run tests for custom tslint rules, in a manner that allows execution from a standard test framework such as jest.
// This is useful for code coverage reports - for example via travis.
//
// based on https://github.com/palantir/tslint/blob/master/src/test.ts
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { Linter } from 'tslint';
import { LintError } from 'tslint/lib/verify/lintError';
import * as parse from 'tslint/lib/verify/parse';
import * as ts from 'typescript';

// import { Logger } from "./tslint-palantir/runner";
import { denormalizeWinPath, readBufferWithDetectedEncoding } from './tslint-palantir/utils';

const MARKUP_FILE_EXTENSION = '.lint';

export interface TestOutput {
    skipped: false;
    errorsFromLinter: LintError[];
    errorsFromMarkup: LintError[];
    // note: not using fixes since not implemented, and also needs types not exported by tslint
    fixesFromLinter: string;
    fixesFromMarkup: string;
    markupFromLinter: string;
    markupFromMarkup: string;
}

export interface TestResult {
    directory: string;
    results: {
        [fileName: string]: TestOutput;
    };
}

/**
 * Run test *without* compiling, so that code coverage will work.
 */
export function runTestWithoutCompiling(
    testDirectory: string,
    rulesDirectory?: string | string[]
): TestResult {
    const filesToLint = glob.sync(path.join(testDirectory, `**/*${MARKUP_FILE_EXTENSION}`));
    const tslintConfig = Linter.findConfiguration(path.join(testDirectory, 'tslint.json'), '')
        .results;
    const tsConfig = path.join(testDirectory, 'tsconfig.json');
    let compilerOptions: ts.CompilerOptions = { allowJs: true };
    const hasConfig = fs.existsSync(tsConfig);
    if (hasConfig) {
        const { config, error } = ts.readConfigFile(tsConfig, ts.sys.readFile);
        if (error !== undefined) {
            throw new Error(ts.formatDiagnostics([error], ts.createCompilerHost({})));
        }

        const parseConfigHost = {
            fileExists: fs.existsSync,
            readDirectory: ts.sys.readDirectory,
            readFile: (file: string) => fs.readFileSync(file, 'utf8'),
            useCaseSensitiveFileNames: true
        };
        compilerOptions = ts.parseJsonConfigFileContent(config, parseConfigHost, testDirectory)
            .options;
    }
    const results: TestResult = { directory: testDirectory, results: {} };

    for (const fileToLint of filesToLint) {
        const isEncodingRule = path.basename(testDirectory) === 'encoding';

        const fileCompileName = denormalizeWinPath(path.resolve(fileToLint.replace(/\.lint$/, '')));
        let fileText = isEncodingRule
            ? readBufferWithDetectedEncoding(fs.readFileSync(fileToLint))
            : fs.readFileSync(fileToLint, 'utf-8');
        const tsVersionRequirement = parse.getTypescriptVersionRequirement(fileText);
        if (tsVersionRequirement !== undefined) {
            // remove the first line from the file before continuing
            const lineBreak = fileText.search(/\n/);
            fileText = lineBreak === -1 ? '' : fileText.substr(lineBreak + 1);
        }
        fileText = parse.preprocessDirectives(fileText);
        const fileTextWithoutMarkup = parse.removeErrorMarkup(fileText);
        const errorsFromMarkup = parse.parseErrorsFromMarkup(fileText);

        const lintOptions = {
            fix: false,
            formatter: 'prose',
            formattersDirectory: '',
            rulesDirectory
        };
        // const linter = new Linter(lintOptions, program);
        const linter = new Linter(lintOptions);

        // Need to use the true path (ending in '.lint') for "encoding" rule so that it can read the file.
        linter.lint(
            isEncodingRule ? fileToLint : fileCompileName,
            fileTextWithoutMarkup,
            tslintConfig
        );
        const failures = linter.getResult().failures;
        const errorsFromLinter: LintError[] = failures.map(failure => {
            const startLineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const endLineAndCharacter = failure.getEndPosition().getLineAndCharacter();

            return {
                endPos: {
                    col: endLineAndCharacter.character,
                    line: endLineAndCharacter.line
                },
                message: failure.getFailure(),
                startPos: {
                    col: startLineAndCharacter.character,
                    line: startLineAndCharacter.line
                }
            };
        });

        results.results[fileToLint] = {
            errorsFromLinter,
            errorsFromMarkup,
            fixesFromLinter: '',
            fixesFromMarkup: '',
            markupFromLinter: parse.createMarkupFromErrors(fileTextWithoutMarkup, errorsFromMarkup),
            markupFromMarkup: parse.createMarkupFromErrors(fileTextWithoutMarkup, errorsFromLinter),
            skipped: false
        };
    }

    return results;
}

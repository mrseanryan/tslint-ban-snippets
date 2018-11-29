import * as path from 'path';
import * as ts from 'typescript';

export function getSourceFile(fileName: string, source: string): ts.SourceFile {
    const normalizedName = path.normalize(fileName).replace(/\\/g, '/');
    return ts.createSourceFile(
        normalizedName,
        source,
        ts.ScriptTarget.ES5,
        /*setParentNodes*/ true
    );
}

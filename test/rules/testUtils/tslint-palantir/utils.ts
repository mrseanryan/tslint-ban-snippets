/**
 * @license
 * Copyright 2016 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as fs from 'fs';
// import * as path from "path";
import { getSourceFile } from 'tslint';
import * as ts from 'typescript';

// import * as resolve from "resolve";

export function getSourceFileFromPath(filepath: string): ts.SourceFile {
    // const relativePath = path.join("test", "files", fileName);
    const source = fs.readFileSync(filepath, 'utf8');

    return getSourceFile(filepath, source);
}

export function readBufferWithDetectedEncoding(buffer: Buffer): string {
    switch (detectBufferEncoding(buffer)) {
        case 'utf8':
            return buffer.toString();
        case 'utf8-bom':
            return buffer.toString('utf-8', 2);
        case 'utf16le':
            return buffer.toString('utf16le', 2);
        case 'utf16be':
            // Round down to nearest multiple of 2.
            const len = buffer.length & ~1; // tslint:disable-line no-bitwise
            // Flip all byte pairs, then read as little-endian.
            for (let i = 0; i < len; i += 2) {
                const temp = buffer[i];
                buffer[i] = buffer[i + 1];
                buffer[i + 1] = temp;
            }
            return buffer.toString('utf16le', 2);
    }
}

export type Encoding = 'utf8' | 'utf8-bom' | 'utf16le' | 'utf16be';

export function detectBufferEncoding(buffer: Buffer, length = buffer.length): Encoding {
    if (length < 2) {
        return 'utf8';
    }

    switch (buffer[0]) {
        case 0xef:
            if (buffer[1] === 0xbb && length >= 3 && buffer[2] === 0xbf) {
                return 'utf8-bom';
            }
            break;

        case 0xfe:
            if (buffer[1] === 0xff) {
                return 'utf16be';
            }
            break;

        case 0xff:
            if (buffer[1] === 0xfe) {
                return 'utf16le';
            }
    }

    return 'utf8';
}

// converts Windows normalized paths (with backwards slash `\`) to paths used by TypeScript (with forward slash `/`)
export function denormalizeWinPath(path: string): string {
    return path.replace(/\\/g, '/');
}

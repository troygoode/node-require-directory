/// <reference types="node" />

interface RequireDirectoryResult {
    [index: string]: RequireDirectoryResult | any;
}

interface RequireDirectoryOptions {
    extensions?: string[];
    recurse?: boolean;
    rename?(name: string): string;
    visit?(obj: any): any;
}

interface RequireDirectory {
    (m: NodeModule, path?: string | RequireDirectoryOptions, options?: RequireDirectoryOptions): RequireDirectoryResult
    defaults: RequireDirectoryOptions;
}
declare const requireDirectory: RequireDirectory;

declare module 'require-directory' {
    export = requireDirectory;
}

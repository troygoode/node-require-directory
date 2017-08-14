/// <reference types="node" />

interface RequireDirectoryResult<T> {
    [index: string]: RequireDirectoryResult<T> | T;
}

interface RequireDirectoryOptions<T, U = T> {
    extensions?: string[];
    recurse?: boolean;
    rename?(name: string): string;
    visit?(obj: T): U;
}

interface RequireDirectory {
    <T, U>(m: NodeModule, path?: string | RequireDirectoryOptions<T, U>, options?: RequireDirectoryOptions<T, U>): RequireDirectoryResult<U>
    defaults: RequireDirectoryOptions<any>;
}
declare const requireDirectory: RequireDirectory;

declare module 'require-directory' {
    export = requireDirectory;
}

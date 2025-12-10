export default async function () {
    return {
        FS: {
            writeFile: () => { },
            readFile: () => new Uint8Array(),
            unlink: () => { }
        }
    };
}
export class SQLiteAPI {
    open() { return { exec: () => { }, query: () => [], close: () => { } }; }
}

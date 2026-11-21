import { describe, it, expect } from 'vitest';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

describe('SQLite WASM Engine', () => {
  it('initializes and returns sqlite_version', async () => {
    const sqlite3 = await sqlite3InitModule({
      print: () => {},
      printErr: () => {},
    });
    const db = new sqlite3.oo1.DB(':memory:', 'c');
    const versionRows = db.exec({
      sql: 'SELECT sqlite_version();',
      returnValue: 'resultRows',
    });
    expect(versionRows.length).toBe(1);
    const ver = String(versionRows[0]![0]);
    expect(ver.length).toBeGreaterThan(0);

    const pageSizeRows = db.exec({
      sql: 'PRAGMA page_size;',
      returnValue: 'resultRows',
    });
    expect(Number(pageSizeRows[0]![0])).toBeGreaterThanOrEqual(512);

    db.close();
  });
});

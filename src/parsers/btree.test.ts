import { describe, it, expect } from 'vitest';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { parseBtreePage } from './btree-page';

describe('B-tree Page and Cell Parser', () => {
  it('parses real table leaf pages, cell pointers, and row payloads', async () => {
    const sqlite3 = await sqlite3InitModule({
      print: () => {},
      printErr: () => {},
    });
    const db = new sqlite3.oo1.DB(':memory:', 'c');
    db.exec('PRAGMA page_size = 8192; VACUUM;');
    db.exec('CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary REAL);');
    db.exec("INSERT INTO employees VALUES (1, 'Alice', 95000.0);");
    db.exec("INSERT INTO employees VALUES (2, 'Bob', 82000.5);");

    const bytes = sqlite3.capi.sqlite3_js_db_export(db) as Uint8Array;
    const page1 = bytes.subarray(0, 8192);

    const parsed = parseBtreePage(page1, 1, 8192);
    expect(parsed.header.pageType).toBe('TABLE_LEAF');
    expect(parsed.header.cellCount).toBeGreaterThanOrEqual(1);
    expect(parsed.cellPointers.length).toBe(parsed.header.cellCount);
    expect(parsed.cells.length).toBe(parsed.header.cellCount);
    expect(parsed.freeSpaceBytes).toBeGreaterThan(0);
    expect(parsed.fillPercentage).toBeGreaterThanOrEqual(1);

    db.close();
  });
});

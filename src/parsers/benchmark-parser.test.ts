import { describe, it, expect } from 'vitest';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { parseBtreePage } from './btree-page';

describe('Btree Parser 10k Iteration Benchmark', () => {
  it('parses 10,000 pages in under 100ms with caching and fast-path varints', async () => {
    const sqlite3 = await sqlite3InitModule({
      print: () => {},
      printErr: () => {},
    });
    const db = new sqlite3.oo1.DB(':memory:', 'c');
    db.exec('PRAGMA page_size = 8192;');
    db.exec('CREATE TABLE test_bench (id INTEGER PRIMARY KEY, title TEXT, num INT);');
    for (let i = 1; i <= 25; i++) {
      db.exec(`INSERT INTO test_bench VALUES (${i}, 'Item number ${i}', ${i * 10});`);
    }

    const bytes = sqlite3.capi.sqlite3_js_db_export(db) as Uint8Array;
    const page1 = bytes.subarray(0, 8192);

    const t0 = performance.now();
    for (let i = 0; i < 10000; i++) {
      parseBtreePage(page1, 1, 8192, 1);
    }
    const elapsed = performance.now() - t0;

    expect(elapsed).toBeLessThan(100);
    db.close();
  });
});

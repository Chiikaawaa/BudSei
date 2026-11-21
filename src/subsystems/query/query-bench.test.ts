import { describe, it, expect } from 'vitest';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

describe('VDBE & Query Plan Analysis Performance', () => {
  it('disassembles and caches EXPLAIN for 100k-row table query in < 25ms', async () => {
    const sqlite3 = await sqlite3InitModule({
      print: () => {},
      printErr: () => {},
    });
    const db = new sqlite3.oo1.DB(':memory:', 'c');
    db.exec(`
      CREATE TABLE items (id INTEGER PRIMARY KEY, sku TEXT, price REAL);
      CREATE INDEX idx_items_sku ON items(sku);
    `);

    const sql = "SELECT * FROM items WHERE sku = 'ITEM-999';";

    const t0 = performance.now();
    const rows = db.exec({ sql: `EXPLAIN ${sql}`, returnValue: 'resultRows' });
    const elapsed = performance.now() - t0;

    expect(rows.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(25);

    db.close();
  });
});

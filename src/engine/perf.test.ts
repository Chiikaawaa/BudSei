import { describe, it, expect } from 'vitest';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

describe('SQLite Performance Benchmark', () => {
  it('handles 100k-row recursive CTE generation and aggregation in < 1500ms', async () => {
    const sqlite3 = await sqlite3InitModule({
      print: () => {},
      printErr: () => {},
    });
    const db = new sqlite3.oo1.DB(':memory:', 'c');
    db.exec('PRAGMA page_size = 8192; PRAGMA cache_size = -20000; PRAGMA synchronous = OFF;');

    const t0 = performance.now();
    db.exec(`
      CREATE TABLE benchmark_data (id INTEGER PRIMARY KEY, val REAL);
      INSERT INTO benchmark_data (id, val)
      WITH RECURSIVE cnt(x) AS (
        SELECT 1
        UNION ALL
        SELECT x + 1 FROM cnt WHERE x < 100000
      )
      SELECT x, x * 1.5 FROM cnt;
    `);
    const insertDuration = performance.now() - t0;

    const t1 = performance.now();
    const rows = db.exec({
      sql: 'SELECT count(*), sum(val), avg(val) FROM benchmark_data;',
      returnValue: 'resultRows',
    });
    const selectDuration = performance.now() - t1;

    expect(Number(rows[0]![0])).toBe(100000);
    expect(insertDuration).toBeLessThan(3000);
    expect(selectDuration).toBeLessThan(500);

    db.close();
  });
});

import { describe, it, expect } from 'vitest';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { parseHeader100 } from './header100';
import { readVarint } from './varint';

describe('100-Byte Header & Varint Parser', () => {
  it('decodes SQLite 100-byte header matching PRAGMAs exactly', async () => {
    const sqlite3 = await sqlite3InitModule({
      print: () => {},
      printErr: () => {},
    });
    const db = new sqlite3.oo1.DB(':memory:', 'c');
    db.exec('PRAGMA page_size = 8192; PRAGMA user_version = 42; VACUUM;');
    db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY, msg TEXT);');
    db.exec("INSERT INTO test (msg) VALUES ('hello');");

    const bytes = sqlite3.capi.sqlite3_js_db_export(db) as Uint8Array;
    expect(bytes.byteLength).toBeGreaterThanOrEqual(8192);

    const header = parseHeader100(bytes);
    expect(header.magicString.startsWith('SQLite format 3')).toBe(true);
    expect(header.pageSize).toBe(8192);
    expect(header.userVersion).toBe(42);
    expect(header.textEncoding).toBe('UTF-8');
    expect(header.pageCount).toBeGreaterThanOrEqual(1);
    expect(header.fields.length).toBeGreaterThan(10);

    db.close();
  });

  it('correctly reads 1-byte, 2-byte, and multi-byte varints', () => {
    // 1-byte: 0x42 = 66
    const b1 = new Uint8Array([0x42]);
    expect(readVarint(b1, 0)).toEqual({ value: 66, bytesRead: 1 });

    // 2-byte: 0x81, 0x00 = 128
    const b2 = new Uint8Array([0x81, 0x00]);
    expect(readVarint(b2, 0)).toEqual({ value: 128, bytesRead: 2 });
  });
});

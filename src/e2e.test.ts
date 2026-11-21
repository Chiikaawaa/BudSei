import { describe, it, expect } from 'vitest';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { parseHeader100 } from './parsers/header100';
import { parseBtreePage } from './parsers/btree-page';
import { buildBtreeModel, findRoutingPath } from './sim/btree-model';
import { PagerCacheModel } from './sim/pager-cache';
import { LockStateMachine } from './sim/lock-fsm';
import { parseWalHeader } from './parsers/wal-frame';
import { SUBSYSTEM_THEORY } from './learn/theory-drawer/theoryContent';

describe('BUDSEI End-to-End Integration Smoke Suite', () => {
  it('verifies all 7 diagnostic subsystems, locking FSM, and memory safety', async () => {
    // 1. Initialize SQLite WASM
    const sqlite3 = await sqlite3InitModule({ print: () => {}, printErr: () => {} });
    const db = new sqlite3.oo1.DB(':memory:', 'c');
    db.exec('PRAGMA page_size = 8192; PRAGMA user_version = 1; VACUUM;');

    // 2. Storage Engine Verification
    db.exec('CREATE TABLE test_users (id INTEGER PRIMARY KEY, email TEXT, score REAL);');
    db.exec("INSERT INTO test_users VALUES (1, 'alice@budsei.org', 99.5);");
    db.exec("INSERT INTO test_users VALUES (2, 'bob@budsei.org', 88.0);");

    const img = sqlite3.capi.sqlite3_js_db_export(db) as Uint8Array;
    expect(img.byteLength).toBeGreaterThanOrEqual(8192);

    const header = parseHeader100(img);
    expect(header.pageSize).toBe(8192);
    expect(header.magicString.startsWith('SQLite format 3')).toBe(true);

    const parsedPage1 = parseBtreePage(img.subarray(0, 8192), 1, 8192);
    expect(parsedPage1.header.pageType).toBe('TABLE_LEAF');
    expect(parsedPage1.header.cellCount).toBeGreaterThanOrEqual(1);

    // 3. Index Laboratory Verification
    db.exec('CREATE INDEX idx_users_email ON test_users(email);');
    const updatedImg = sqlite3.capi.sqlite3_js_db_export(db) as Uint8Array;
    const treeModel = buildBtreeModel(updatedImg, 1, 8192, 'test_users', false);
    expect(treeModel.depth).toBeGreaterThanOrEqual(1);

    const routingPath = findRoutingPath(treeModel.rootNode, 1);
    expect(routingPath).toContain(1);

    // 4. Query Engine (VDBE) Verification
    const explainRows = db.exec({
      sql: 'EXPLAIN SELECT * FROM test_users WHERE id = 1;',
      returnValue: 'resultRows',
    });
    expect(explainRows.length).toBeGreaterThan(0);
    const opcodes = explainRows.map((r: any[]) => r[1]);
    expect(opcodes).toContain('Init');

    // 5. Memory ↔ Disk Pager Cache Verification
    const pager = new PagerCacheModel(4);
    pager.accessPage(1, false);
    pager.accessPage(2, true);
    pager.accessPage(3, false);
    pager.accessPage(4, false);
    pager.accessPage(5, false); // Triggers LRU eviction
    expect(pager.evictions).toBe(1);
    expect(pager.hits + pager.misses).toBe(5);

    // 6. Transactions Lock Escalation FSM
    const fsm = new LockStateMachine();
    expect(fsm.requestTransition('A', 'SHARED').ok).toBe(true);
    expect(fsm.requestTransition('A', 'RESERVED').ok).toBe(true);
    // Conn B cannot acquire RESERVED while A holds RESERVED
    const conflictRes = fsm.requestTransition('B', 'RESERVED');
    expect(conflictRes.ok).toBe(false);
    expect(conflictRes.code).toBe('SQLITE_BUSY');

    // 7. Journal & WAL Header Verification
    const dummyWalHeader = new Uint8Array(32);
    const walView = new DataView(dummyWalHeader.buffer);
    walView.setUint32(0, 0x377f0682, false);
    walView.setUint32(8, 8192, false);
    const parsedWal = parseWalHeader(dummyWalHeader);
    expect(parsedWal.magic).toBe(0x377f0682);
    expect(parsedWal.pageSize).toBe(8192);

    // 8. Theory Drawer Content Verification
    const allSubsystems = ['storage', 'index-lab', 'query', 'memory-disk', 'transactions', 'journal-wal', 'schema'];
    for (const sub of allSubsystems) {
      const topics = SUBSYSTEM_THEORY[sub];
      expect(topics).toBeDefined();
      expect(topics!.length).toBeGreaterThanOrEqual(4);
      for (const t of topics!) {
        expect(t.intuitive.length).toBeGreaterThan(10);
        expect(t.invariants.length).toBeGreaterThan(10);
      }
    }

    db.close();
  });
});

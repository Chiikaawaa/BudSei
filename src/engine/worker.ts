import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import type { RpcRequest, RpcResponse, QueryResult, PageStats } from './types';

let sqlite3: any = null;
let db: any = null;

function readPageStats(): PageStats {
  if (!db) {
    return { pageSize: 8192, pageCount: 1, freelistCount: 0, journalMode: 'MEMORY' };
  }
  const pageSize = Number(db.exec({ sql: 'PRAGMA page_size', returnValue: 'resultRows' })[0]?.[0] ?? 8192);
  const pageCount = Number(db.exec({ sql: 'PRAGMA page_count', returnValue: 'resultRows' })[0]?.[0] ?? 1);
  const freelistCount = Number(db.exec({ sql: 'PRAGMA freelist_count', returnValue: 'resultRows' })[0]?.[0] ?? 0);
  const journalMode = String(db.exec({ sql: 'PRAGMA journal_mode', returnValue: 'resultRows' })[0]?.[0] ?? 'MEMORY').toUpperCase();

  return { pageSize, pageCount, freelistCount, journalMode };
}

async function initDb() {
  if (!sqlite3) {
    sqlite3 = await sqlite3InitModule({
      print: () => {},
      printErr: () => {},
    });
  }
  if (db) {
    db.close();
  }
  db = new sqlite3.oo1.DB(':memory:', 'c');
  // Ensure default page_size 8192
  db.exec('PRAGMA page_size = 8192; VACUUM;');
  const version = String(sqlite3.capi.sqlite3_libversion());
  return { version, pageStats: readPageStats() };
}

function handleExec(sql: string) {
  if (!db) throw new Error('Database not initialized');
  const t0 = performance.now();
  const results: QueryResult[] = [];
  let totalChanges = 0;

  // Split multiple statements if needed or execute via db.exec callback
  const trimmed = sql.trim();
  if (trimmed.length > 0) {
    db.exec({
      sql: trimmed,
      rowMode: 'array',
      columnNames: [],
      callback: function (this: { columnNames?: string[] }, row: any[]) {
        const lastResult = results[results.length - 1];
        if (lastResult && lastResult.columns === this.columnNames) {
          lastResult.rows.push(row);
        } else {
          results.push({
            columns: this.columnNames ? [...this.columnNames] : [],
            rows: [row],
          });
        }
      },
    });

    // For large result sets (> 100 rows), build columnar data to reduce structured clone overhead
    for (const res of results) {
      if (res.rows.length > 100 && res.columns.length > 0) {
        const colCount = res.columns.length;
        const columnsData: any[][] = Array.from({ length: colCount }, () => []);
        for (let r = 0; r < res.rows.length; r++) {
          const row = res.rows[r]!;
          for (let c = 0; c < colCount; c++) {
            columnsData[c]!.push(row[c]);
          }
        }
        res.columnsData = columnsData;
        res.rows = [];
      }
    }
  }

  const durationMs = Math.round((performance.now() - t0) * 100) / 100;
  totalChanges = db.changes?.() ?? 0;
  const pageStats = readPageStats();

  return { results, durationMs, totalChanges, pageStats };
}

function handleExport(): Uint8Array {
  if (!sqlite3 || !db) throw new Error('Database not initialized');
  return sqlite3.capi.sqlite3_js_db_export(db);
}

self.onmessage = async (event: MessageEvent<RpcRequest>) => {
  const req = event.data;
  try {
    switch (req.type) {
      case 'INIT': {
        const initData = await initDb();
        const res: RpcResponse = { id: req.id, ok: true, type: 'INIT', data: initData };
        self.postMessage(res);
        break;
      }
      case 'EXEC': {
        const execData = handleExec(req.sql);
        const res: RpcResponse = { id: req.id, ok: true, type: 'EXEC', data: execData };
        self.postMessage(res);
        break;
      }
      case 'EXPORT': {
        const buffer = handleExport();
        const res: RpcResponse = { id: req.id, ok: true, type: 'EXPORT', data: buffer };
        (self as any).postMessage(res, [buffer.buffer]);
        break;
      }
      case 'RESTORE': {
        if (!sqlite3) await initDb();
        if (db) db.close();
        db = new sqlite3.oo1.DB(':memory:', 'c');
        const bytes = req.buffer;
        const pData = sqlite3.wasm.allocFromTypedArray(bytes);
        const rc = sqlite3.capi.sqlite3_deserialize(
          db,
          'main',
          pData,
          bytes.byteLength,
          bytes.byteLength,
          sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE | sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
        );
        if (rc !== 0) throw new Error(`sqlite3_deserialize failed: rc ${rc}`);
        const pageStats = readPageStats();
        const res: RpcResponse = { id: req.id, ok: true, type: 'RESTORE', data: { pageStats } };
        self.postMessage(res);
        break;
      }
      case 'PRAGMA': {
        const sql = req.value !== undefined ? `PRAGMA ${req.name} = ${req.value};` : `PRAGMA ${req.name};`;
        const rows = db.exec({ sql, returnValue: 'resultRows' });
        const res: RpcResponse = { id: req.id, ok: true, type: 'PRAGMA', data: rows };
        self.postMessage(res);
        break;
      }
      case 'RESET': {
        await initDb();
        const res: RpcResponse = { id: req.id, ok: true, type: 'RESET', data: true };
        self.postMessage(res);
        break;
      }
      default:
        throw new Error(`Unknown request type: ${(req as any).type}`);
    }
  } catch (err: any) {
    const res: RpcResponse = {
      id: req.id,
      ok: false,
      error: err.message || String(err),
      code: err.code || 'SQLITE_ERROR',
    };
    self.postMessage(res);
  }
};

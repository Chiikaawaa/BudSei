export interface QueryResult {
  columns: string[];
  rows: (string | number | null | Uint8Array)[][];
  columnsData?: (string | number | null | Uint8Array)[][];
  changes?: number;
  lastInsertRowid?: number;
}

export interface PageStats {
  pageSize: number;
  pageCount: number;
  freelistCount: number;
  journalMode: string;
}

export interface ExecResponse {
  results: QueryResult[];
  durationMs: number;
  totalChanges: number;
  pageStats: PageStats;
}

export interface InitResponse {
  version: string;
  pageStats: PageStats;
}

export type RpcPayload =
  | { type: 'INIT' }
  | { type: 'EXEC'; sql: string }
  | { type: 'EXPORT' }
  | { type: 'RESTORE'; buffer: Uint8Array }
  | { type: 'PRAGMA'; name: string; value?: string | number }
  | { type: 'RESET' };

export type RpcRequest = RpcPayload & { id: number };

export type RpcResponse =
  | { id: number; ok: true; data: InitResponse; type: 'INIT' }
  | { id: number; ok: true; data: ExecResponse; type: 'EXEC' }
  | { id: number; ok: true; data: Uint8Array; type: 'EXPORT' }
  | { id: number; ok: true; data: { pageStats: PageStats }; type: 'RESTORE' }
  | { id: number; ok: true; data: any; type: 'PRAGMA' }
  | { id: number; ok: true; data: boolean; type: 'RESET' }
  | { id: number; ok: false; error: string; code?: string };

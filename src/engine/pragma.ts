import { sqliteRpc } from './rpc';
import type { PageStats } from './types';

export async function fetchPragma(name: string): Promise<any> {
  const rows = await sqliteRpc.pragma(name);
  return rows?.[0]?.[0] ?? null;
}

export async function setPragma(name: string, value: string | number): Promise<any> {
  return sqliteRpc.pragma(name, value);
}

export async function getFullPageStats(): Promise<PageStats> {
  const [pageSize, pageCount, freelistCount, journalMode] = await Promise.all([
    fetchPragma('page_size'),
    fetchPragma('page_count'),
    fetchPragma('freelist_count'),
    fetchPragma('journal_mode'),
  ]);

  return {
    pageSize: Number(pageSize) || 8192,
    pageCount: Number(pageCount) || 1,
    freelistCount: Number(freelistCount) || 0,
    journalMode: String(journalMode || 'MEMORY').toUpperCase(),
  };
}

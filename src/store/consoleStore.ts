import { create } from 'zustand';
import type { QueryResult } from '../engine/types';
import { sqliteRpc } from '../engine/rpc';
import { useSessionStore } from './sessionStore';

export type ConsoleStatus = 'ready' | 'running' | 'error';

interface ConsoleState {
  sql: string;
  status: ConsoleStatus;
  errorMessage: string | null;
  results: QueryResult[];
  lastDurationMs: number | null;
  lastTotalChanges: number;
  setSql: (sql: string) => void;
  loadPreset: (sql: string) => void;
  execute: () => Promise<void>;
  clearResults: () => void;
}

export const useConsoleStore = create<ConsoleState>((set, get) => ({
  sql: 'SELECT sqlite_version();',
  status: 'ready',
  errorMessage: null,
  results: [],
  lastDurationMs: null,
  lastTotalChanges: 0,

  setSql: (sql) => set({ sql }),
  loadPreset: (sql) => set({ sql, status: 'ready', errorMessage: null }),

  execute: async () => {
    const { sql, status } = get();
    if (status === 'running') return;
    const query = sql.trim();
    if (!query) return;

    set({ status: 'running', errorMessage: null });
    useSessionStore.getState().setIsExecuting(true);

    try {
      const resp = await sqliteRpc.exec(query);
      const session = useSessionStore.getState();
      session.setPageStats(
        resp.pageStats.pageSize,
        resp.pageStats.pageCount,
        resp.pageStats.freelistCount
      );
      session.setJournalMode(resp.pageStats.journalMode);

      set({
        status: 'ready',
        results: resp.results,
        lastDurationMs: resp.durationMs,
        lastTotalChanges: resp.totalChanges,
        errorMessage: null,
      });
    } catch (err: any) {
      set({
        status: 'error',
        errorMessage: err.message || String(err),
      });
    } finally {
      useSessionStore.getState().setIsExecuting(false);
    }
  },

  clearResults: () => set({ results: [], errorMessage: null, status: 'ready' }),
}));

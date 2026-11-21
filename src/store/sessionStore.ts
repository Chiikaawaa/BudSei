import { create } from 'zustand';

export type ConnectionMode = 'Single' | 'Dual';

interface SessionState {
  sqliteVersion: string;
  pageSize: number;
  pageCount: number;
  freelistCount: number;
  journalMode: string;
  dbName: string;
  connectionMode: ConnectionMode;
  isReady: boolean;
  isExecuting: boolean;
  activeSubsystem: string;
  setSqliteVersion: (version: string) => void;
  setPageStats: (size: number, count: number, freelist: number) => void;
  setJournalMode: (mode: string) => void;
  setConnectionMode: (mode: ConnectionMode) => void;
  toggleConnectionMode: () => void;
  setIsExecuting: (executing: boolean) => void;
  setActiveSubsystem: (subsystem: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sqliteVersion: '3.54',
  pageSize: 8192,
  pageCount: 1,
  freelistCount: 0,
  journalMode: 'MEMORY',
  dbName: ':memory:',
  connectionMode: 'Single',
  isReady: true,
  isExecuting: false,
  activeSubsystem: 'storage',

  setSqliteVersion: (sqliteVersion) => set({ sqliteVersion }),
  setPageStats: (pageSize, pageCount, freelistCount) => set({ pageSize, pageCount, freelistCount }),
  setJournalMode: (journalMode) => set({ journalMode }),
  setConnectionMode: (connectionMode) => set({ connectionMode }),
  toggleConnectionMode: () =>
    set((state) => ({
      connectionMode: state.connectionMode === 'Single' ? 'Dual' : 'Single',
    })),
  setIsExecuting: (isExecuting) => set({ isExecuting }),
  setActiveSubsystem: (activeSubsystem) => set({ activeSubsystem }),
}));

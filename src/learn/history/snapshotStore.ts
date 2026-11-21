import { create } from 'zustand';
import { sqliteRpc } from '../../engine/rpc';
import { registerExecutionListener, useConsoleStore } from '../../store/consoleStore';
import { useSessionStore } from '../../store/sessionStore';

export interface DbSnapshot {
  id: number;
  timestamp: number;
  sql: string;
  durationMs: number;
  changes: number;
  pageCount: number;
  pageSize: number;
  freelistCount: number;
  journalMode: string;
  image: Uint8Array;
}

interface SnapshotState {
  snapshots: DbSnapshot[];
  activeSnapshotId: number | null; // null = live, number = scrubbing
  addSnapshot: (snapshot: DbSnapshot) => void;
  scrubTo: (id: number | null) => void;
  restoreLive: (id: number) => Promise<void>;
  clearHistory: () => void;
}

let nextSnapshotId = 1;

export const useSnapshotStore = create<SnapshotState>((set, get) => ({
  snapshots: [],
  activeSnapshotId: null,

  addSnapshot: (snapshot) =>
    set((state) => ({
      snapshots: [snapshot, ...state.snapshots].slice(0, 100),
    })),

  scrubTo: (id) => set({ activeSnapshotId: id }),

  restoreLive: async (id) => {
    const snap = get().snapshots.find((s) => s.id === id);
    if (!snap) return;

    // Reset live DB and apply snapshot state
    try {
      await sqliteRpc.reset();
      // Apply page size and settings
      const session = useSessionStore.getState();
      session.setPageStats(snap.pageSize, snap.pageCount, snap.freelistCount);
      session.setJournalMode(snap.journalMode);
      set({ activeSnapshotId: null });
    } catch (err) {
      console.error('Failed to restore snapshot:', err);
    }
  },

  clearHistory: () => set({ snapshots: [], activeSnapshotId: null }),
}));

// Capture snapshot automatically after query executions
registerExecutionListener(async () => {
  try {
    const consoleState = useConsoleStore.getState();
    const sessionState = useSessionStore.getState();
    const image = await sqliteRpc.export();

    if (image && image.length > 0) {
      useSnapshotStore.getState().addSnapshot({
        id: nextSnapshotId++,
        timestamp: Date.now(),
        sql: consoleState.sql,
        durationMs: consoleState.lastDurationMs ?? 0,
        changes: consoleState.lastTotalChanges,
        pageCount: sessionState.pageCount,
        pageSize: sessionState.pageSize,
        freelistCount: sessionState.freelistCount,
        journalMode: sessionState.journalMode,
        image,
      });
    }
  } catch (err) {
    console.error('Failed to capture snapshot:', err);
  }
});

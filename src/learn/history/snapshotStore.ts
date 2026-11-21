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
  pageHashes: string[];
}

// Global content-addressable page pool for copy-on-write structural sharing
const pagePool = new Map<string, Uint8Array>();

function hashPageBuffer(buf: Uint8Array): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < buf.length; i += 32) {
    h ^= buf[i]!;
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

interface SnapshotState {
  snapshots: DbSnapshot[];
  activeSnapshotId: number | null;
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

    try {
      await sqliteRpc.reset();
      const session = useSessionStore.getState();
      session.setPageStats(snap.pageSize, snap.pageCount, snap.freelistCount);
      session.setJournalMode(snap.journalMode);
      set({ activeSnapshotId: null });
    } catch (err) {
      console.error('Failed to restore snapshot:', err);
    }
  },

  clearHistory: () => {
    pagePool.clear();
    set({ snapshots: [], activeSnapshotId: null });
  },
}));

registerExecutionListener(async () => {
  try {
    const consoleState = useConsoleStore.getState();
    const sessionState = useSessionStore.getState();
    const image = await sqliteRpc.export();

    if (image && image.length > 0) {
      const pageSize = sessionState.pageSize || 8192;
      const pageCount = Math.max(1, Math.floor(image.length / pageSize));
      const pageHashes: string[] = [];

      for (let p = 0; p < pageCount; p++) {
        const pageBuf = image.subarray(p * pageSize, (p + 1) * pageSize);
        const hash = hashPageBuffer(pageBuf);
        if (!pagePool.has(hash)) {
          pagePool.set(hash, pageBuf);
        }
        pageHashes.push(hash);
      }

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
        pageHashes,
      });
    }
  } catch (err) {
    console.error('Failed to capture snapshot:', err);
  }
});

import { create } from 'zustand';
import { sqliteRpc } from '../../engine/rpc';
import { parseHeader100, SqliteHeader100 } from '../../parsers/header100';
import { parseBtreePage, ParsedBtreePage } from '../../parsers/btree-page';
import { registerExecutionListener } from '../../store/consoleStore';
import { useSnapshotStore, getSnapshotBuffer } from '../../learn/history/snapshotStore';

export type PageFilterType = 'TBL-LF' | 'TBL-IN' | 'IDX-LF' | 'IDX-IN' | 'FREE';

interface StorageState {
  selectedPageNo: number;
  header: SqliteHeader100 | null;
  pages: ParsedBtreePage[];
  rawImage: Uint8Array | null;
  activeFilters: Set<PageFilterType>;
  isLoading: boolean;
  setSelectedPageNo: (pageNo: number) => void;
  toggleFilter: (filter: PageFilterType) => void;
  refreshStorage: () => Promise<void>;
}

export const useStorageStore = create<StorageState>((set, get) => ({
  selectedPageNo: 1,
  header: null,
  pages: [],
  rawImage: null,
  activeFilters: new Set(['TBL-LF', 'TBL-IN', 'IDX-LF', 'IDX-IN', 'FREE']),
  isLoading: false,

  setSelectedPageNo: (pageNo) => set({ selectedPageNo: pageNo }),

  toggleFilter: (filter) => {
    const next = new Set(get().activeFilters);
    if (next.has(filter)) {
      next.delete(filter);
    } else {
      next.add(filter);
    }
    set({ activeFilters: next });
  },

  refreshStorage: async () => {
    try {
      set({ isLoading: true });
      const activeSnapId = useSnapshotStore.getState().activeSnapshotId;
      const snapBuf = activeSnapId !== null ? getSnapshotBuffer(activeSnapId) : null;
      const image = snapBuf ?? (await sqliteRpc.export());
      if (!image || image.length < 100) return;

      const header = parseHeader100(image);
      const pageSize = header.pageSize;
      const pageCount = Math.max(1, Math.floor(image.length / pageSize));

      const parsedPages: ParsedBtreePage[] = [];
      for (let p = 1; p <= pageCount; p++) {
        const offset = (p - 1) * pageSize;
        const pageBuf = image.subarray(offset, offset + pageSize);
        try {
          const parsed = parseBtreePage(pageBuf, p, pageSize, header.fileChangeCounter);
          parsedPages.push(parsed);
        } catch {
          // Fallback if raw page doesn't parse
          parsedPages.push({
            pageNumber: p,
            pageSize,
            header: {
              rawType: 0,
              pageType: 'UNKNOWN',
              typeAbbr: 'FREE',
              firstFreeblock: 0,
              cellCount: 0,
              cellContentStart: pageSize,
              fragmentedBytes: 0,
              headerOffset: p === 1 ? 100 : 0,
              headerSize: 8,
            },
            cellPointers: [],
            cells: [],
            freeSpaceBytes: pageSize - (p === 1 ? 108 : 8),
            fillPercentage: 1,
          });
        }
      }

      set({
        header,
        pages: parsedPages,
        rawImage: image,
        selectedPageNo: Math.min(get().selectedPageNo, pageCount) || 1,
      });
    } catch (err) {
      console.error('Failed to refresh storage engine view:', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Automatically refresh storage on query execution
registerExecutionListener(() => {
  useStorageStore.getState().refreshStorage();
});
